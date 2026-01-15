import type { Datapoint } from '../../mockData';
import type { ChartDatapoint } from './types';

export const beeswarmLayout = (
    datapoints: Datapoint[], 
    valueAccessor: (d: Datapoint) => number | undefined = (d) => d.value,
    keyAccessor: (d: Datapoint) => string = (d) => d.player.id
    ): ChartDatapoint[] => {
    return datapoints
        .map(d => {
            const value = valueAccessor(d);
            return {
                player: d.player,
                value: typeof value === 'number' && !isNaN(value) ? Math.round(value) : undefined,
                key: keyAccessor(d)
            };
        });
}; 