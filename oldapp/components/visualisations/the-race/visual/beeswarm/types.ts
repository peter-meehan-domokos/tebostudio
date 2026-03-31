import type { Player } from '../../mockData';

export type ChartDatapoint = {
    player: Player;
    value: number | undefined;
    key: string;
    x?: number;
    y?: number;
    vy?: number;
    vx?: number;
    index?: number;
};

export type ChartData = {
    key: string;
    name: string;
    bounds?: {
        min: number;
        max: number;
    };
    datapoints: Array<ChartDatapoint>;
};

export type MarginType = { 
    top: number; 
    right: number; 
    bottom: number; 
    left: number; 
}; 