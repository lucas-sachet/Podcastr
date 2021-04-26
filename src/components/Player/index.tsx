import Image from 'next/image';
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'

export function Player() {
  const { episodeList, currentEpisodeIndex } = useContext(PlayerContext)

  const episode = episodeList[currentEpisodeIndex]

  return (
   <div className={styles.playerContainer}>
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
         <span>00:00</span>
         <div className={styles.slider}>
          {episode ? (
            <Slider 
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }}
              handleStyle={{ borderColor: '#9f75ff', borderWidth: 4 }}
            />
          ) : (
            <div className={styles.emptySlider} />
          )}
         </div>
         <span>00:00</span>
       </div>

       <div className={styles.buttons}>
         <button type="button" disabled={!episode}>
          <img src="/shuffle.svg" alt="shuffle"/>
         </button>
         <button type="button" disabled={!episode}>
          <img src="/play-previous.svg" alt="previous"/>
         </button>
         <button type="button" className={styles.playButton} disabled={!episode}>
          <img src="/play.svg" alt="play"/>
         </button>
         <button type="button" disabled={!episode}>
          <img src="/play-next.svg" alt="next"/>
         </button>
         <button type="button" disabled={!episode}>
          <img src="/repeat.svg" alt="repeat"/>
         </button>
       </div>
     </footer>
   </div>
  );
}