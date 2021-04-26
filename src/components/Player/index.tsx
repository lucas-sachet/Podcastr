import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    isLooping,
    isShuffling,
    togglePlay, 
    toggleLoop,
    toggleShuffle,
    setPlayingState, 
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSick(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
   <div className={styles.playerContainer}>

      <Head>
        <title>{episode ? episode.title : 'Player'} | Podcastr</title>
      </Head>

     <header>
       <img src="/playing.svg" alt="playing now"/>
       <strong>Playing now</strong>
     </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592} 
            src={episode.thumbnail} 
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (  
        <div className={styles.emptyPlayer}>
        <strong>Select one podcast to play</strong>
        </div>
      )}

     <footer className={!episode ? styles.empty : ''}>
       <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
         <div className={styles.slider}>
          {episode ? (
            <Slider 
              max={episode.duration}
              value={progress}
              onChange={handleSick}
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }}
              handleStyle={{ borderColor: '#9f75ff', borderWidth: 4 }}
            />
          ) : (
            <div className={styles.emptySlider} />
          )}
         </div>
         <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
       </div>

       { episode && (
         <audio 
          src={episode.url}
          ref={audioRef} 
          autoPlay
          onEnded={handleEpisodeEnded}
          loop={isLooping}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
         />
       )}

       <div className={styles.buttons}>
         <button 
          type="button" 
          disabled={!episode || episodeList.length == 1}
          onClick={toggleShuffle}
          className={isShuffling ? styles.isActive : ''}
         >
          <img src="/shuffle.svg" alt="shuffle"/>
         </button>
         <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
          <img src="/play-previous.svg" alt="previous"/>
         </button>
         <button
          type="button" 
          className={styles.playButton} 
          disabled={!episode}
          onClick={togglePlay}
          >
            {isPlaying
            ? <img src="/pause.svg" alt="pause"/>
            : <img src="/play.svg" alt="play"/>}
         </button>
         <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
          <img src="/play-next.svg" alt="next"/>
         </button>
         <button 
          type="button" 
          disabled={!episode}
          onClick={toggleLoop}
          className={isLooping ? styles.isActive : ''}
         >
          <img src="/repeat.svg" alt="repeat"/>
         </button>
       </div>
     </footer>
   </div>
  );
}