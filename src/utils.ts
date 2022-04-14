import { Messages, Position, Satellite, Satellites } from "./types";

export const getMessage = (messages: Messages[]): string => {
    let arrMessageFinal: string[] = [];
    let majorLength: number = messages.reduce((a,b) => (a < b.length) ? b.length : a,0)

    for(let i = 0; i < majorLength; i++){
        for (const message of messages) {
            arrMessageFinal[i] = (message[i] && message[i].length > 0) ? message[i] : arrMessageFinal[i];
        }
    }

    return arrMessageFinal.join(' ');
};

export const getLocation = (distances: number[]): Position => {
    /*const kenobi: Coordenadas ={
        x: -500,
        y: -200
    };
    const skywalker: Coordenadas ={
        x: 100,
        y: 100
    };
    const sato: Coordenadas ={
        x: 500,
        y: 100
    };*/

    console.log(distances);
    let resultCoordenadas : Position = {
        position: {
            x: 1,
            y: 2
        }
    };

    return resultCoordenadas;
};

export const validateSatellite = (satellite: Satellites | Satellites[]): boolean => {
    let tmpArray: Satellites[] = [];
    if(Array.isArray(satellite)) tmpArray = tmpArray.concat(satellite);
    else tmpArray.push(satellite);

    for (const objSatellite of tmpArray) {
        if(objSatellite.name && (!isString(objSatellite.name) || !isSatellite(objSatellite.name))) return false;
        if(objSatellite.distance && !isNumber(objSatellite.distance)) return false;
        if(objSatellite.message && !isArrayString(objSatellite.message)) return false;
    }
    return true;
};


export const parseSatelliteName = (satelliteName: any): Satellite => {
    if(!isString(satelliteName) || !isSatellite(satelliteName))throw new Error('Incorrect Satellite');
    return satelliteName;
};

const isSatellite = (satellite:any):boolean => {
    return Object.values(Satellite).includes(satellite);
 }

const isString = (string:string):boolean => {
   return typeof string === 'string';
}

const isNumber = (string:any):boolean => {
    const value = parseFloat(string)
   return !isNaN(value);
}

const isArrayString = (string:string[]):boolean => {
    return string.every( x => typeof x === 'string');
}