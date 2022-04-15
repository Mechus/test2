import { Messages, Position, Satellites } from "./types";
import { Satellite } from "./enum";
import config from 'config';
var nerdamer = require('nerdamer/all.min'); 

//Metodo para obtener el mensaje decifrado de los statelites
export const getMessage = (messages: Messages[]): string => {
    try {
        //Se crean variables y se obtiene el string mas largo para recorrer los mensajes
        let arrMessageFinal: string[] = [];
        let majorLength: number = messages.reduce((a,b) => (a < b.length) ? b.length : a,0)
    
        //Se recorren cada posicion de los mensajes obtenidos en cada mensaje y se van comparando para interpretar el mensaje completo
        for(let i = 0; i < majorLength; i++){
            for (const message of messages) {
                arrMessageFinal[i] = (message[i] && message[i].length > 0) ? message[i] : arrMessageFinal[i];
            }
        }
    
        return arrMessageFinal.join(' ');
    } catch (error) {
        console.log(error)
        return "";
    }
};

//Metodo para obtener las coordenadas (x,y) del mensaje de los satelites
export const getLocation = (distances: number[]): Position | undefined => {
    try {
        //Se hacen los reemplazos de las variables y constantes en al formula de distancia (d)^2 = sqrt((x1 -x2)^2+(y1 -y2)^2) 
        const equationKenobi = '('+distances[0]+')^2 = (x-('+config.get<string>('satellites.kenobi.x')+'))^2 + (y-('+config.get<string>('satellites.kenobi.y')+'))^2';
        const equationSkywalker = '('+distances[1]+')^2 = (x-('+config.get<string>('satellites.skywalker.x')+'))^2 + (y-('+config.get<string>('satellites.skywalker.y')+'))^2';
        const equationSato= '('+distances[2]+')^2 = (x-('+config.get<string>('satellites.sato.x')+'))^2 + (y-('+config.get<string>('satellites.sato.y')+'))^2';

        //Se despeja X en el primer satelite
        let solXKenobi = nerdamer.solveEquations(equationKenobi,'x');
    
        //Se despeja Y en el segundo satelite
        let solYSkywalker = nerdamer.solveEquations(equationSkywalker,'y');
    
        //Se reemplaza x en la formula de y, se obtiene la coordenada de Y
        let solYKenobiSkywalker = 'y = ' + solYSkywalker[0].toString().replace(/x/g,'('+solXKenobi[0].toString()+')')
        const solYFinalKS = nerdamer.solveEquations(solYKenobiSkywalker,'y');

        //Se valida si la coordenada es valida
        if(isValidNumber(solYFinalKS[0])){
            //Se reemplaza y en la formula de x, se obtiene la coordenada de Y
            let solXKenobiSkywalker = solXKenobi[0].toString().replace(/y/g,'('+solYFinalKS[0].toString()+')')
            const solXFinalKS = nerdamer.solveEquations(solXKenobiSkywalker,'x');
            
            //Se valida si la coordenada es valida
            if(isValidNumber(solXFinalKS[0])){
                return {
                    position: {
                    x: nerdamer(solXFinalKS[0].toString()).evaluate().text(),
                    y: nerdamer(solYFinalKS[0].toString()).evaluate().text()
                }};
            }
        }
    
        //Se despeja Y en el tercer satelite
        let solYSato = nerdamer.solveEquations(equationSato,'y');
    
        //Se reemplaza x en la formula de y, se obtiene la coordenada de Y
        let solYKenobiSato = solYSkywalker[0].toString().replace(/x/g,'('+solXKenobi[0].toString()+')')
        const solYFinalKSa = nerdamer.solveEquations(solYKenobiSato,'y');

        //Se valida si la coordenada es valida
        if(isValidNumber(solYFinalKSa[0])){
            let solXKenobiSato = solYSato[0].toString().replace(/y/g,'('+solYFinalKSa[0].toString()+')')
            const solXFinalKSa = nerdamer.solveEquations(solXKenobiSato,'x');
            
            //Se valida si la coordenada es valida
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
        console.log(error)
        return undefined;
    }
};

//Metodo para valodar que la entrada de un satelite esta correctamente construida
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
        console.log(error)
        return false;
    }
};

//Metodo para verificar que el nombre del satelite sea valido
export const parseSatelliteName = (satelliteName: any): Satellite => {
    if(!isString(satelliteName) || !isSatellite(satelliteName))throw new Error('Incorrect Satellite');
    return satelliteName;
};

//Metodo para verificar que el satelite existe en el domino de nombres
const isSatellite = (satellite:any):boolean => {
    return Object.values(Satellite).includes(satellite);
 }

 //Metodo para verificar si es un string
const isString = (string:string):boolean => {
   return typeof string === 'string';
}

//Metodo para verificar si es un number
const isNumber = (string:any):boolean => {
    const value = parseFloat(string)
   return !isNaN(value);
}

//Metodo para verificar si es un array de strings
const isArrayString = (string:string[]):boolean => {
    return string.every( x => typeof x === 'string');
}

//Metodo para verificar si es una coordenada valida
const isValidNumber = (equation:any):boolean => {
    return !(equation.imaginary || equation.isInfinity || equation.value.includes('i'))
}