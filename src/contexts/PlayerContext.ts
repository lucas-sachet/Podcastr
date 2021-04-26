import { createContext} from 'react'

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
}

type PLayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  play: (episode: Episode) => void,
}

export const PlayerContext = createContext({} as PLayerContextData);