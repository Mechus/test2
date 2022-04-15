import { Position, PositionMessage, Satellites, SatellitesSecret } from "../types";
import { Satellite } from "../enum";
import { getLocation, getMessage } from "../utils";
import satelittesData from './satellites.json';

const satellitesDinamic: Satellites[] = satelittesData as Satellites[];

//Metodo para obtener coordenadas y mensaje de los satelites y construccion de respuesta
export const getTopSecret = (satellites: Satellites[]): PositionMessage | undefined => {
    try {
        const position: Position | undefined = getLocation(satellites.map(x => x.distance));
        const message: string = getMessage(satellites.map(x => x.message));
    
        if(!(message && position))return undefined;
    
        const resultPositionMessage: PositionMessage = {
            ...position,
            message
        }
    
        return resultPositionMessage;
    } catch (error) {
        console.log(error)
        return undefined;
    }
};

//Metodo para guardar informacion de satelites en objeto en memoria
export const postTopSecretSplit = (satellite: SatellitesSecret, name: Satellite): boolean => {
    try {
        let actualSatellite = satellitesDinamic.find(x => x.name === name);
    
        if (actualSatellite){
            actualSatellite.distance = satellite.distance;
            actualSatellite.message = satellite.message;
        }else{
            const newSatellite: Satellites = {
                ...satellite,
                name
            };
            satellitesDinamic.push(newSatellite);
        }
        
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
};

//Metodo para obtener coordenadas y mensaje de los objeto de satelites en memoria y construccion de respuesta
export const getTopSecretSplit = (): PositionMessage | undefined => {
    try {
        if(satellitesDinamic.length < 2) return undefined;
    
        const position: Position | undefined = getLocation(satellitesDinamic.map(x => x.distance));
        const message: string = getMessage(satellitesDinamic.map(x => x.message));
    
        if(!(message && position))return undefined;
        
        const resultPositionMessage: PositionMessage = {
            ...position,
            message
        }
    
        return resultPositionMessage;
    } catch (error) {
        console.log(error)
        return undefined;
    }
};