import * as d3 from 'd3';
import type { Selection } from 'd3';

type ButtonDatum = {
    id: string;
    label: string;
    onClick: () => void;
    color: string;
};

export const renderButtons = (
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    buttonData: ButtonDatum[],
    containerWidth: number,
    buttonWidth: number = 72,
    buttonHeight: number = 30,
    buttonMargin: number = 10
) => {
    // Add buttons
    const buttonGroup = svg.selectAll<SVGGElement, ButtonDatum>('g.control-button')
        //@ts-ignore
        .data(buttonData, d => d.id)
        .join('g')
        .attr('class', d => `control-button ${d.id}`)
        .attr('transform', (d,i) => `translate(${containerWidth - (i + 1) * (buttonWidth + buttonMargin)}, ${buttonMargin})`);

    buttonGroup.selectAll('rect')
        .data(d => [d])
        .join('rect')
        .attr('width', buttonWidth)
        .attr('height', buttonHeight)
        .attr('rx', 5)
        .style('fill', 'transparent')
        .style('stroke', '#1B2A49')
        .style('stroke-width', '1px')
        .style('cursor', 'pointer');

    buttonGroup.selectAll('text')
        .data(d => [d])
        .join('text')
        .attr('x', buttonWidth/2)
        .attr('y', buttonHeight/2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('fill', '#1B2A49')
        .style('font-weight', '400')
        .style('font-size', '14px')
        .style('font-family', 'sans-serif')
        .style('cursor', 'pointer')
        .text(d => d.label);

    // Add click handlers to buttons
    buttonGroup
        .style('cursor', 'pointer')
        .on('click', (event, d) => d.onClick());
}; 