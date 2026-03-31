import * as d3 from 'd3';

// Types for our data structure
export type Player = {
    firstName: string;
    surname: string;
    id: string;
}

export type Metric = {
    key: string;
    name: string;
    label: string;
    min?: number;
    max?: number;
    mean: number;
    standardDeviation: number;
}

export type MetricValue = {
    key: string;
    value: number;
}

//@todo define values here instead of using an object literal
export type MetricRawDataset = {
    metricKey: string;
    values: Array<{
        timeInMinutes: number;
        value: number;
    }>;
}

export type MetricRawDatasetsForPlayer = {
    playerId: string;
    metrics: MetricRawDataset[];
}

export type Datapoint = {
    player: Player;
    values?: MetricValue[];
    value?: number;
    timeInMinutes: number;
}

// Define the metrics
const metrics: Metric[] = [
    {
        key: "sucAct",
        name: "Number Of Successful Actions",
        label: "Success Acts",
        min: 0,
        mean: 45,
        standardDeviation: 15
    },
    
    {
        key: "attack",
        name: "Attacking Contribution Score",
        label: "Attack",
        min: 0,
        mean: 18,
        standardDeviation: 12
    },
    {
        key: "hsr",
        name: "High Speed Running",
        label: "HSR (m)",
        min: 0,
        mean: 600,
        standardDeviation: 300
    }
];

// Generate mock players
const mockPlayers: Player[] = [
    { firstName: "John", surname: "Smith", id: "JS001" },
    { firstName: "Emma", surname: "Johnson", id: "EJ002" },
    { firstName: "Michael", surname: "Williams", id: "MW003" },
    { firstName: "Sarah", surname: "Brown", id: "SB004" },
    { firstName: "David", surname: "Jones", id: "DJ005" },
    { firstName: "Lisa", surname: "Davis", id: "LD006" },
    { firstName: "James", surname: "Miller", id: "JM007" },
    { firstName: "Emily", surname: "Wilson", id: "EW008" },
    { firstName: "Daniel", surname: "Taylor", id: "DT009" },
    { firstName: "Sophie", surname: "Anderson", id: "SA010" }
];

// Create normal distributions for each metric
const normalDists = metrics.map(metric => 
    d3.randomNormal(metric.mean, metric.standardDeviation)
);

// Interpolation functions for different curve types
const interpolationFunctions = {
    // Strictly increasing functions
    exponential: (t: number, endValue: number) => {
        const exp = d3.easeExpIn(t);
        return endValue * exp;
    },
    logistic: (t: number, endValue: number) => {
        // S-curve: slow start, rapid middle, slow end
        const k = 12; // Steepness
        const x0 = 0.5; // Midpoint
        const sigmoid = 1 / (1 + Math.exp(-k * (t - x0)));
        return endValue * sigmoid;
    },
    stepwise: (t: number, endValue: number) => {
        // Plateau in the middle
        if (t < 0.3) return endValue * (t * 2);
        if (t > 0.7) return endValue * (0.6 + (t - 0.7) * 1.33);
        return endValue * 0.6;
    },
    lateSpurt: (t: number, endValue: number) => {
        // Slow start, rapid end
        return endValue * Math.pow(t, 3);
    },
    earlySpurt: (t: number, endValue: number) => {
        // Rapid start, slow end
        return endValue * (1 - Math.pow(1 - t, 3));
    }
};

// Generate time-based values with non-linear interpolation
const generateTimeBasedValues = (
    endValue: number,
    metricKey: string,
    playerId: string
): Array<{ timeInMinutes: number; value: number }> => {
    // Assign different interpolation functions based on player and metric
    const playerNum = parseInt(playerId.slice(-1));
    let interpolationFn;
    
    if (playerNum < 3) interpolationFn = interpolationFunctions.exponential;
    else if (playerNum < 5) interpolationFn = interpolationFunctions.logistic;
    else if (playerNum < 7) interpolationFn = interpolationFunctions.stepwise;
    else if (playerNum < 9) interpolationFn = interpolationFunctions.lateSpurt;
    else interpolationFn = interpolationFunctions.earlySpurt;

    return Array.from({ length: 90 }, (_, i) => {
        const t = (i + 1) / 90; // Normalize time to [0,1]
        return {
            timeInMinutes: i + 1,
            value: Math.max(0, Math.round(interpolationFn(t, endValue)))
        };
    });
};

// Generate raw datasets for each player
const generatePlayerDatasets = (player: Player): MetricRawDatasetsForPlayer => {
    const playerMetrics = metrics.map((metric, i) => {
        // Generate end value using normal distribution
        let endValue = Math.round(normalDists[i]());
        if (metric.min !== undefined) {
            endValue = Math.max(metric.min, endValue);
        }
        if (metric.max !== undefined) {
            endValue = Math.min(metric.max, endValue);
        }

        return {
            metricKey: metric.key,
            values: generateTimeBasedValues(endValue, metric.key, player.id)
        };
    });

    return {
        playerId: player.id,
        metrics: playerMetrics
    };
};

// Generate datasets for all players
const metricRawDatasetsForPlayers = mockPlayers.map(player => 
    generatePlayerDatasets(player)
);

// Log datasets
console.log('Raw Datasets:', metricRawDatasetsForPlayers);

// Transform raw datasets into datapoints
const createDatapoints = (rawDatasets: MetricRawDatasetsForPlayer[]): Datapoint[] => {
    return rawDatasets.flatMap(playerData => {
        const player = mockPlayers.find(p => p.id === playerData.playerId)!;
        
        return Array.from({ length: 90 }, (_, i) => {
            const timeInMinutes = i + 1;
            return {
                player,
                timeInMinutes,
                values: playerData.metrics.map(metric => ({
                    key: metric.metricKey,
                    value: metric.values[i].value
                }))
            };
        });
    });
};

const datapoints = createDatapoints(metricRawDatasetsForPlayers);

// Export the data
export const data = {
    key: "race",
    title: "The Race",
    metrics,
    datapoints
}; 