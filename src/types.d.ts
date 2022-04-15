export type Messages = string[];

export interface PositionMessage {
    position: {
        x: number,
        y: number
    },
    message: string
};

export interface Satellites {
    name: string,
    distance: number,
    message: Messages
};

export type SatellitesSecret = Omit<Satellites, 'name'>;
export type Position = Omit<PositionMessage, 'message'>;