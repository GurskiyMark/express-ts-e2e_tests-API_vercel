export type dbVideo = {

    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Resolution[];
}

export enum Resolution {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

export type inputVideoData = {
    
  title: string,
  author: string,
  availableResolutions: Resolution[]

}


export type updateVideoData = {
    title: string,
    author: string,
    availableResolutions: Resolution[],
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}   


export const db: dbVideo[] = [
    {
        id: 1,
        title: '2342351',
        author: '235r23tfdssfa',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [Resolution.P144]
    },

    {
        id: 2,
        title: '2342351',
        author: '235r23tfdssfa',
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [Resolution.P480]
    }
]

