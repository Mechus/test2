//Tipo para conjunto de mensajes de satelites
export type Messages = string[];

//Interface para response de calculos
export interface PositionMessage {
    position: {
        x: number,
        y: number
    },
    message: string
};

//Interface para request de satelites
export interface Satellites {
    name: string,
    distance: number,
    message: Messages
};

export type SatellitesSecret = Omit<Satellites, 'name'>;
export type Position = Omit<PositionMessage, 'message'>;