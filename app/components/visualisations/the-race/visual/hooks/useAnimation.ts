import { useEffect, useRef } from 'react';

type AnimationConfig = {
    duration: number;
    startValue: number;
    endValue: number;
};

export const useAnimation = (
    isPlaying: boolean,
    setIsPlaying: (playing: boolean) => void,
    setCurrentValue: (value: number) => void,
    isPaused: boolean,
    config: AnimationConfig = { duration: 15000, startValue: 1, endValue: 90 }
) => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);
    const configRef = useRef(config);
    const setCurrentValueRef = useRef(setCurrentValue);
    const setIsPlayingRef = useRef(setIsPlaying);
    const nrUpdatesRef = useRef(0);

    // Calculate step duration once
    const totalSteps = configRef.current.endValue - configRef.current.startValue + 1;
    const stepDuration = configRef.current.duration / totalSteps;

    // Update refs when dependencies change
    useEffect(() => {
        configRef.current = config;
        setCurrentValueRef.current = setCurrentValue;
        setIsPlayingRef.current = setIsPlaying;
    }, [config, setCurrentValue, setIsPlaying]);

    useEffect(() => {
        if (!isPlaying) {
            startTimeRef.current = 0;
            pausedTimeRef.current = 0;
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
            }
            return;
        }

        if (isPaused) {
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
            }
            if (pausedTimeRef.current === 0) {
                pausedTimeRef.current = Date.now();
            }
            return;
        }

        // Initialize start time and position or adjust for pause
        if (startTimeRef.current === 0) {
            startTimeRef.current = Date.now();
            nrUpdatesRef.current = 0;
        } else if (pausedTimeRef.current > 0) {
            // Adjust start time by the pause duration
            const pauseDuration = Date.now() - pausedTimeRef.current;
            startTimeRef.current += pauseDuration;
            pausedTimeRef.current = 0;
        }

        const animate = () => {
            nrUpdatesRef.current++;
            const currentStep = nrUpdatesRef.current;
            
            // Calculate the new value based on the current step
            const newValue = configRef.current.startValue + currentStep - 1;
            setCurrentValueRef.current(newValue);

            if (currentStep < totalSteps) {
                // Schedule next update exactly one step duration from the start
                const nextUpdateTime = startTimeRef.current + (currentStep * stepDuration);
                const now = Date.now();
                const delay = Math.max(0, nextUpdateTime - now);
                
                timeoutRef.current = setTimeout(animate, delay);
            } else {
                setCurrentValueRef.current(configRef.current.endValue);
                setIsPlayingRef.current(false);
                timeoutRef.current = undefined;
                console.log("nrUpdatesRef.current", nrUpdatesRef.current);
            }
        };

        // Start with the initial value if not resuming from pause
        if (nrUpdatesRef.current === 0) {
            setCurrentValueRef.current(configRef.current.startValue);
        }
        timeoutRef.current = setTimeout(animate, stepDuration);

        return () => {
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
            }
        };
    }, [isPlaying, isPaused, stepDuration, totalSteps]);

    return {
        stopAnimation: () => {
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
            }
            startTimeRef.current = 0;
            pausedTimeRef.current = 0;
            setIsPlayingRef.current(false);
        },
        stepDuration // Expose the step duration
    };
}; 