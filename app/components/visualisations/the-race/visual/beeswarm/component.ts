import * as d3 from 'd3';
import type { Metric } from '../../mockData';
import type { ChartData, ChartDatapoint, MarginType } from './types';

export interface BeeswarmChart {
    (selection: d3.Selection<any, ChartData, any, any>): void;
    width(): number;
    width(value: number): this;
    height(): number;
    height(value: number): this;
    margin(): MarginType;
    margin(value: MarginType): this;
    metrics(): Metric[];
    metrics(value: Metric[]): this;
    transitionDuration(): number;
    transitionDuration(value: number): this;
}

export const beeswarmComponent = (): BeeswarmChart => {
    // Configuration parameters with defaults
    let width = 600;
    let height = 400;
    let margin: MarginType = { top: 75, right: 100, bottom: 120, left: 60 }; // Increased bottom margin for leaderboard
    let metrics: Metric[] = [];
    let transitionDuration = 500;
    const ENTER_EXIT_DURATION = 200;
    const LEADERBOARD_HEIGHT = 80; // Height allocated for leaderboard

    function initializeChart(svg: d3.Selection<any, any, any, any>, data: ChartData) {
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        const dataHeight = chartHeight - LEADERBOARD_HEIGHT; // Actual height for data points

        // Add background rectangle
        svg.append("rect")
            .attr("class", "chart-background")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", chartWidth)
            .attr("height", dataHeight)
            .attr("fill", "transparent")
            .attr("stroke", "none")
            .attr("pointer-events", "none");

        // Create y-axis group
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left},0)`);

        // Add title
        svg.append("text")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", margin.top * 0.25)
            .attr("text-anchor", "middle")
            .style("font-size", "16px");

        // Create dots container
        svg.append<SVGGElement>("g")
            .attr("class", "dots-container");

        // Create leaderboard container
        svg.append("g")
            .attr("class", "leaderboard")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 20})`);
    }

    function updateLeaderboard(svg: d3.Selection<any, any, any, any>, data: ChartDatapoint[]) {
        const leaderboard = svg.select(".leaderboard");
        
        // Get top 3 players
        const topPlayers = data
            .filter(d => d.value !== undefined)
            .sort((a, b) => (b.value as number) - (a.value as number))
            .slice(0, 3);

        // Create position groups
        const positions = leaderboard.selectAll("g.position")
            .data(topPlayers)
            .join(
                enter => {
                    const g = enter.append("g")
                        .attr("class", "position")
                        .attr("transform", (d, i) => `translate(0, ${i * 25})`);
                    
                    // Add rank number
                    g.append("text")
                        .attr("class", "rank")
                        .attr("x", 0)
                        .attr("y", 0)
                        .style("font-size", "14px")
                        .style("fill", "#EDEDED")
                        .text((d, i) => `${i + 1}.`);
                    
                    // Add player name
                    g.append("text")
                        .attr("class", "player-name")
                        .attr("x", 25)
                        .attr("y", 0)
                        .style("font-size", "14px")
                        .style("fill", "#EDEDED");
                    
                    // Add score
                    g.append("text")
                        .attr("class", "score")
                        .attr("x", 150)
                        .attr("y", 0)
                        .style("font-size", "14px")
                        .style("fill", "#EDEDED")
                        .style("text-anchor", "end");
                    
                    return g;
                }
            );

        // Update player names and scores
        positions.select(".player-name")
            .text(d => `${d.player.firstName} ${d.player.surname}`);
        
        positions.select(".score")
            .text(d => d.value?.toString() ?? 'No value');
    }

    function chart(selection: d3.Selection<any, ChartData, any, any>) {
        selection.each(function(data,i) {
            const svg = d3.select(this);

            // Initialize if empty
            if (svg.selectAll("*").empty()) {
                initializeChart(svg, data);
            }

            const metric = metrics.find(m => m.key === data.key);
            const chartWidth = width - margin.left - margin.right;
            const chartHeight = height - margin.top - margin.bottom;
            const dataHeight = chartHeight - LEADERBOARD_HEIGHT; // Actual height for data points

            // Separate defined and undefined values
            const definedData = data.datapoints.filter(d => d.value !== undefined);
            const undefinedData = data.datapoints.filter(d => d.value === undefined);

            // Calculate optimal circle radius
            const totalPoints = definedData.length;
            const areaPerPoint = (chartWidth * dataHeight) / totalPoints;
            const maxRadius = Math.min(chartWidth, dataHeight) * 0.08;
            const minRadius = 3;
            const baseRadius = Math.sqrt(areaPerPoint) * 0.15;
            const circleRadius = Math.min(Math.max(baseRadius, minRadius), maxRadius);

            // Update scale for defined values using the provided bounds
            const yScale = d3.scaleLinear()
                .domain([
                    data.bounds?.min ?? (metric?.min ?? 0),
                    data.bounds?.max ?? (metric?.max ?? d3.max(definedData, d => d.value) ?? 0)
                ])
                .range([height - margin.bottom - LEADERBOARD_HEIGHT, margin.top]); // Adjust range for leaderboard

            // Create color scale for players
            const colorScale = d3.scaleOrdinal<string, string>()
                .domain(data.datapoints.map(d => d.player.id))
                .range([
                    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00',
                    '#ffff33', '#a65628', '#f781bf', '#1b9e77', '#d95f02',
                    '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'
                ]);

            // Run simulation
            const simulation = d3.forceSimulation<ChartDatapoint>(definedData)
                .force("y", d3.forceY<ChartDatapoint>(d => yScale(d.value as number)).strength(1))
                .force("x", d3.forceX<ChartDatapoint>(width / 2))
                .force("collision", d3.forceCollide<ChartDatapoint>(circleRadius * 1.1))
                .stop();

            for (let i = 0; i < 120; ++i) simulation.tick();

            // Update y-axis
            const yAxis = d3.axisLeft(yScale);
            svg.select<SVGGElement>(".y-axis")
                .transition()
                .duration(transitionDuration)
                .call(yAxis);

            // Update title
            const titleColor = "#EDEDED";
            svg.select(".title")
                .style("fill", titleColor)
                .text(data.name);

            const dotsContainer = svg.select<SVGGElement>("g.dots-container");

            // Update defined dots with improved transitions
            const dots = dotsContainer.selectAll<SVGCircleElement, ChartDatapoint>("circle.defined")
                .data(definedData, d => d.key);

            // Handle exit with short duration
            dots.exit()
                .transition()
                .duration(ENTER_EXIT_DURATION)
                .style("opacity", 0)
                .remove();

            // Handle enter with short duration
            const dotsEnter = dots.enter()
                .append("circle")
                .attr("class", d => `defined player-${d.player.id}`)
                .attr("cx", d => d.x || width / 2)
                .attr("cy", d => yScale(d.value as number))
                .attr("r", circleRadius)
                .style("fill", d => colorScale(d.player.id))
                .style("stroke", "white")
                .style("stroke-width", "1px");

            // Immediate enter transition with short duration
            dotsEnter.style("opacity", 0)
                .transition()
                .duration(ENTER_EXIT_DURATION)
                .style("opacity", 1);

            // Update existing dots with position transition
            dots
                .attr("cx", d => d.x || width / 2)
                .attr("cy", d => yScale(d.value as number));

            const allDots = dots.merge(dotsEnter);
            allDots.selectAll("title").remove();
            allDots.append("title")
                .attr("class", d => `tooltip-${d.player.id}`)
                .text(d => `${d.player.firstName} ${d.player.surname}: ${d.value}`);

            // Handle undefined values
            const undefinedDots = dotsContainer.selectAll<SVGCircleElement, ChartDatapoint>("circle.undefined")
                .data(undefinedData, d => d.key);

            undefinedDots.exit()
                .transition()
                .duration(ENTER_EXIT_DURATION)
                .style("opacity", 0)
                .remove();

            const undefinedDotsEnter = undefinedDots.enter()
                .append("circle")
                .attr("class", d => `undefined player-${d.player.id}`)
                .attr("cx", (d, i) => {
                    const rightEdge = margin.left + chartWidth;
                    return rightEdge - ((i + 1) * (circleRadius * 2.2));
                })
                .attr("cy", height - margin.bottom - LEADERBOARD_HEIGHT)
                .attr("r", circleRadius)
                .style("fill", d => colorScale(d.player.id))
                .style("stroke", "white")
                .style("stroke-width", "1px")
                .style("opacity", 0);

            undefinedDotsEnter.transition()
                .duration(ENTER_EXIT_DURATION)
                .style("opacity", 0.5);

            const allUndefinedDots = undefinedDots.merge(undefinedDotsEnter);
            allUndefinedDots.selectAll("title").remove();
            allUndefinedDots.append("title")
                .attr("class", d => `tooltip-${d.player.id}`)
                .text(d => `${d.player.firstName} ${d.player.surname}: No value`);

            // Update leaderboard
            updateLeaderboard(svg, data.datapoints);
        });
    }

    // Getter/setter methods
    chart.width = function(value?: number) {
        if (!arguments.length) return width;
        width = value!;
        return this;
    };

    chart.height = function(value?: number) {
        if (!arguments.length) return height;
        height = value!;
        return this;
    };

    chart.margin = function(value?: MarginType) {
        if (!arguments.length) return margin;
        margin = value!;
        return this;
    };

    chart.metrics = function(value?: Metric[]) {
        if (!arguments.length) return metrics;
        metrics = value!;
        return this;
    };

    chart.transitionDuration = function(value?: number) {
        if (!arguments.length) return transitionDuration;
        transitionDuration = value!;
        return this;
    };

    return chart as BeeswarmChart;
}; 