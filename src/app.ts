import express, { Request, Response } from "express";
import { db, dbVideo, inputVideoData, Resolution, updateVideoData } from "./db";



export const app = express();
app.use(express.json());

export enum HttpStatus {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    ServerError = 500
}

export enum myURL {
    VIDEOS = '/videos',
    TEST = '/testing/all-data'
}

app.get(myURL.VIDEOS, (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json(db);
});




/*
title:	string  maxLength: 40
author:	string  maxLength: 20
availableResolutions: Enum: [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]

*/

function defaultValidatePost(body: inputVideoData) {
    const errors: { message: string, field: string }[] = [];

    if (!body.title || body.title.length > 40) {
        errors.push({ message: 'Incorrect title', field: 'title' })
    }

    if (!body.author || body.author.length > 20) {
        errors.push({ message: 'Incorrect author', field: 'author' })
    }

    if (!Array.isArray(body.availableResolutions) || body.availableResolutions.length < 1) {
        errors.push({ message: `Incorrect availableResolutions: it's not array or empty`, field: 'availableResolutions' })

    } else {
        const allowed = Object.values(Resolution) //изначально объект, сейчас уже стал массивом значений [values]
        const invalid = body.availableResolutions.filter(el => !allowed.includes(el))
        if (invalid.length > 0) {
            errors.push({ message: `Incorrect availableResolutions: ${invalid.join(', ')}`, field: 'availableResolutions' })
        }
    }

    return errors;
}
/*
title	string        maxLength: 40
author	string        maxLength: 20
availableResolutions enum []


canBeDownloaded  boolean
minAgeRestriction*	Number | null minimum: 1 maximum: 18
publicationDate  string
*/
function validateUpdateVideo(body: updateVideoData) {
    const errors = defaultValidatePost(body);

    if(typeof body.canBeDownloaded !== "boolean"){
        errors.push({message: 'incorrect type data in canBeDownloaded ', field: 'canBeDownloaded'})
    }
    
    if(body.minAgeRestriction !== null && (body.minAgeRestriction < 1 || body.minAgeRestriction > 18)) {
        errors.push({message: 'incorrect minAgeRestriction ', field: 'minAgeRestriction'})
    }


    if (typeof body.publicationDate !== "string" ||
    isNaN(Date.parse(body.publicationDate))) {

    errors.push({
        message: "Incorrect publicationDate",
        field: "publicationDate"
    });
}

    return errors;
}




/*
 dbVideo default:

    id:     number,
    title:  string,
    author: string,
    canBeDownloaded:   false,
    minAgeRestriction: null,  
    createdAt:         string,
    publicationDate:   string, +1 day from CreatedAt
    availableResolutions: Resolution[];
*/

app.post(myURL.VIDEOS, (req: Request, res: Response) => {
    const errors = defaultValidatePost(req.body);

    if (errors.length > 0) {
        return res.status(HttpStatus.BadRequest).json({ errors });
    }


    const createdAt = new Date();
    const publicationDate = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24);// +1 день зависящий от даты в createdAt

    const createVideo: dbVideo = {
        id: new Date().getTime(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: req.body.availableResolutions
    }

    db.push(createVideo);

    res.status(HttpStatus.Created).json(createVideo);

});

app.put(myURL.VIDEOS + '/:id', (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const index = db.findIndex(el => el.id === idURL);

    if(index === -1){
    res.sendStatus(HttpStatus.NotFound);
    }

    const data : updateVideoData = req.body;

    const errors = validateUpdateVideo(req.body);
    if(errors.length > 1){
        return res.status(HttpStatus.BadRequest).json({errors})
    }

    db[index] = {
        ...db[index],        
        ...req.body          
    };

    res.sendStatus(HttpStatus.NoContent)
});

app.delete(myURL.VIDEOS +'/:id', (req: Request, res: Response) => {
    const idURL = Number(req.params.id);
    const index = db.findIndex(el => el.id === idURL);

    if (index === -1) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    db.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent)
})  

app.delete(myURL.TEST, (req: Request, res: Response) => {
    db.length = 0; 
    res.sendStatus(HttpStatus.NoContent);
});



