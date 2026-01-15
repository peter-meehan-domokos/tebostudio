import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { beeswarmLayout } from './beeswarm/layout';
import { beeswarmComponent } from './beeswarm/component';
import { useCircleInteraction } from './hooks/useCircleInteraction';
import { useAnimation } from './hooks/useAnimation';
import { useButtonControls } from './hooks/useButtonControls';
import { renderButtons } from './helpers/renderButtons';
import type { Metric, Datapoint, MetricValue } from '../mockData';
import type { ChartData } from './beeswarm/types';

type Props = {
    data: {
        key: string;
        title: string;
        metrics: Metric[];
        datapoints: Datapoint[];
    };
};

export const Visual: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(90); // Start at final position

    const beeswarm = useMemo(() => beeswarmComponent(), []);
    // Use custom hooks
    const { setupCircleInteractions } = useCircleInteraction();
    const { stopAnimation, stepDuration } = useAnimation(isPlaying, setIsPlaying, setCurrentTime, isPaused);
    const { buttonData } = useButtonControls({
        isPlaying,
        isPaused,
        setIsPlaying,
        setIsPaused,
        setCurrentTime
    });
    
    // Calculate min/max values for each metric across all time points
    const metricBounds = useMemo(() => {
        return data.metrics.reduce((acc, metric) => {
            const allValues = data.datapoints.flatMap(d => {
                const value = d.values?.find(v => v.key === metric.key)?.value;
                return value !== undefined ? [value] : [];
            });
            
            acc[metric.key] = {
                min: Math.min(...allValues),
                max: Math.max(...allValues)
            };
            return acc;
        }, {} as Record<string, { min: number; max: number }>);
    }, [data.metrics, data.datapoints]);
    
    // Process the data through beeswarm layout for current time
    const chartsData: ChartData[] = useMemo(() => {
        const valueAccessor = (metric: Metric) => (d: Datapoint) => 
            d.values?.find((v: MetricValue) => v.key === metric.key)?.value;
        const keyAccessor = (metric: Metric) => (d: Datapoint) => 
            `${metric.key}-${d.player.id}`;
        
        // Filter datapoints for current time
        const timeFilteredDatapoints = data.datapoints.filter(d => d.timeInMinutes === currentTime);
        
        return data.metrics.map(metric => ({
            key: metric.key,
            name: metric.name,
            bounds: metricBounds[metric.key],
            datapoints: beeswarmLayout(timeFilteredDatapoints, valueAccessor(metric), keyAccessor(metric))
        }));
    }, [data, currentTime, metricBounds]);

    useEffect(() => {
        if (!svgRef.current) return;

        const PARENT_PADDING_PC = 0.05;
        const containerWidth = window.innerWidth * (1 - (PARENT_PADDING_PC * 2));
        const containerHeight = window.innerHeight * (1 - (PARENT_PADDING_PC * 2));

        // Use the full viewport width and height minus page margins and padding
        const pageMargin = { left: 20, right: 20, top: 20, bottom: 20 };
        const totalWidth = containerWidth - pageMargin.left - pageMargin.right;
        const totalHeight = containerHeight - pageMargin.top - pageMargin.bottom;
        const margin = { top: 80, right: 40, bottom: 80, left: 60 };
        
        const availableWidth = totalWidth - margin.left - margin.right;
        const chartSpacing = 40;
        const chartWidth = (availableWidth - (chartSpacing * 2)) / 3;
        const chartHeight = totalHeight - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", totalWidth)
            .attr("height", totalHeight);

        // Add full SVG background rect for click handling
        svg.selectAll('rect.svg-background')
            .data([null])
            .join('rect')
            .attr('class', 'svg-background')
            .attr('width', totalWidth)
            .attr('height', totalHeight)
            .attr('fill', 'transparent')
            .style('cursor', 'pointer');

        // Render buttons
        renderButtons(svg, buttonData, containerWidth);

        // Create a beeswarm chart instance
        beeswarm
            .width(chartWidth)
            .height(chartHeight)
            .margin(margin)
            .metrics(data.metrics)
            .transitionDuration(isPlaying ? stepDuration : 500);

        // Create three separate g elements for each chart
        svg.selectAll<SVGGElement, ChartData>('g.chart')
            .data(chartsData)
            .join('g')
            .attr('class', d => `chart ${d.key}`)
            .attr('transform', (d, i) => {
                const xPos = margin.left + (i * (chartWidth + chartSpacing));
                const yPos = margin.top;
                return `translate(${xPos}, ${yPos})`;
            })
            .call(beeswarm);

        // Setup circle interactions
        setupCircleInteractions(svg);

    }, [chartsData, data.metrics, isPlaying, isPaused, setupCircleInteractions, stopAnimation, stepDuration, currentTime, buttonData]);

    return (
        <div style={{
            padding: '0px',
            width: '100%',
            height: '85vh',
            boxSizing: 'border-box'
        }}>
            <svg 
                ref={svgRef}
                style={{ 
                    width: '100%',
                    height: '100%',
                    border: '1px solid #ccc'
                }}
            />
            {/* Time counter */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '12px',
                color: '#EDEDED',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}>
                <span>Number of Minutes:</span>
                <span style={{ fontWeight: 'bold' }}>{currentTime}</span>
            </div>
        </div>
    );
}; 