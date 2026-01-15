import { useMemo } from 'react';

type ButtonControlsProps = {
    isPlaying: boolean;
    isPaused: boolean;
    setIsPlaying: (playing: boolean) => void;
    setIsPaused: (paused: boolean) => void;
    setCurrentTime: (time: number) => void;
};

export const useButtonControls = ({
    isPlaying,
    isPaused,
    setIsPlaying,
    setIsPaused,
    setCurrentTime
}: ButtonControlsProps) => {
    const buttonData = useMemo(() => {
        const playPauseButton = {
            id: 'play-pause',
            label: isPlaying && !isPaused ? 'Pause' : 'Play',
            onClick: () => {
                if(!isPlaying){
                    setIsPlaying(true);
                } else {
                    setIsPaused(!isPaused);
                }
            },
            color: '#2196F3'
        };

        const endButton = {
            id: 'end',
            label: 'End',
            onClick: () => {
                setCurrentTime(90);
                setIsPaused(false);
                setIsPlaying(false);
            },
            color: '#E3735E'
        };

        return isPlaying ? [playPauseButton, endButton] : [playPauseButton];
    }, [isPlaying, isPaused, setIsPlaying, setIsPaused, setCurrentTime]);

    return { buttonData };
}; 