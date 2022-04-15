import { Messages, Position, Satellites } from "./types";
import { Satellite } from "./enum";
import config from 'config';
var nerdamer = require('nerdamer/all.min'); 

export const getMessage = (messages: Messages[]): string => {
    try {
        let arrMessageFinal: string[] = [];
        let majorLength: number = messages.reduce((a,b) => (a < b.length) ? b.length : a,0)
    
        for(let i = 0; i < majorLength; i++){
            for (const message of messages) {
                arrMessageFinal[i] = (message[i] && message[i].length > 0) ? message[i] : arrMessageFinal[i];
            }
        }
    
        return arrMessageFinal.join(' ');
    } catch (error) {
        return "";
    }
};

export const getLocation = (distances: number[]): Position | undefined => {
    try {
        const equationKenobi = '('+distances[0]+')^2 = (x-('+config.get<string>('satellites.kenobi.x')+'))^2 + (y-('+config.get<string>('satellites.kenobi.y')+'))^2';
        const equationSkywalker = '('+distances[1]+')^2 = (x-('+config.get<string>('satellites.skywalker.x')+'))^2 + (y-('+config.get<string>('satellites.skywalker.y')+'))^2';
        const equationSato= '('+distances[2]+')^2 = (x-('+config.get<string>('satellites.sato.x')+'))^2 + (y-('+config.get<string>('satellites.sato.y')+'))^2';

        let solXKenobi = nerdamer.solveEquations(equationKenobi,'x');
    
        let solYSkywalker = nerdamer.solveEquations(equationSkywalker,'y');
    
        let solYKenobiSkywalker = 'y = ' + solYSkywalker[0].toString().replace(/x/g,'('+solXKenobi[0].toString()+')')
        const solYFinalKS = nerdamer.solveEquations(solYKenobiSkywalker,'y');

        if(isValidNumber(solYFinalKS[0])){
            let solXKenobiSkywalker = solXKenobi[0].toString().replace(/y/g,'('+solYFinalKS[0].toString()+')')
            const solXFinalKS = nerdamer.solveEquations(solXKenobiSkywalker,'x');
            
            if(isValidNumber(solXFinalKS[0])){
                return {
                    position: {
                    x: nerdamer(solXFinalKS[0].toString()).evaluate().text(),
                    y: nerdamer(solYFinalKS[0].toString()).evaluate().text()
                }};
            }
        }
    
        let solYSato = nerdamer.solveEquations(equationSato,'y');
    
        let solYKenobiSato = solYSkywalker[0].toString().replace(/x/g,'('+solXKenobi[0].toString()+')')
        const solYFinalKSa = nerdamer.solveEquations(solYKenobiSato,'y');

        if(isValidNumber(solYFinalKSa[0])){
            let solXKenobiSato = solYSato[0].toString().replace(/y/g,'('+solYFinalKSa[0].toString()+')')
            const solXFinalKSa = nerdamer.solveEquations(solXKenobiSato,'x');
            
            if(isValidNumber(solXFinalKSa[0])){
                return {
                    position: {
                    x: nerdamer(solXFinalKSa[0].toString()).evaluate().text(),
                    y: nerdamer(solYFinalKSa[0].toString()).evaluate().text()
                }};
            }
        }
    
        return undefined;
    } catch (error) {
        return undefined;
    }
};

export const validateSatellite = (satellite: Satellites | Satellites[]): boolean => {
    try {
        let tmpArray: Satellites[] = [];
        if(Array.isArray(satellite)) tmpArray = tmpArray.concat(satellite);
        else tmpArray.push(satellite);
    
        for (const objSatellite of tmpArray) {
            if(objSatellite.name && (!isString(objSatellite.name) || !isSatellite(objSatellite.name))) return false;
            if(objSatellite.distance && !isNumber(objSatellite.distance)) return false;
            if(objSatellite.message && !isArrayString(objSatellite.message)) return false;
        }
        return true;
    } catch (error) {
        return false;
    }
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

const isValidNumber = (equation:any):boolean => {
    return !(equation.imaginary || equation.isInfinity || equation.value.includes('i'))
}