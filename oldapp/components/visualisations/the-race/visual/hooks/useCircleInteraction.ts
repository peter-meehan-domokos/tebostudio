import { useCallback } from 'react';
import { Selection, select } from 'd3';

export const useCircleInteraction = () => {
    const handleCircleHover = useCallback((svg: Selection<SVGSVGElement, unknown, null, undefined>, playerId: string | null) => {
        if (!playerId) {
            // Reset if no player ID (mouseout)
            svg.selectAll("circle")
                .style("filter", null)
                .style("stroke-width", "1px")
                .style("opacity", function(d: any) {
                    return d.value === undefined ? "0.5" : "1";
                });
            
            // Hide all tooltips
            svg.selectAll("title").style("visibility", "hidden");
            return;
        }

        // Highlight all circles for this player across all charts
        svg.selectAll(`.player-${playerId}`)
            .style("filter", "drop-shadow(0 0 3px rgba(0,0,0,0.4))")
            .style("stroke-width", "2px");

        // Show all tooltips for this player
        svg.selectAll(`.tooltip-${playerId}`)
            .style("visibility", "visible");

        // Dim all other circles
        svg.selectAll("circle")
            .filter(function() {
                return !select(this).classed(`player-${playerId}`);
            })
            .style("opacity", "0.3");

        // Hide tooltips for other players
        svg.selectAll("title")
            .filter(function() {
                return !select(this).classed(`tooltip-${playerId}`);
            })
            .style("visibility", "hidden");
    }, []);

    const handleCircleClick = useCallback((svg: Selection<SVGSVGElement, unknown, null, undefined>, playerId: string | null) => {
        // Remove existing selections
        svg.selectAll(".selected").classed("selected", false);

        if (!playerId) {
            // Reset all circles if no player ID (background click)
            svg.selectAll("circle")
                .style("filter", null)
                .style("stroke-width", "1px")
                .style("opacity", function(d: any) {
                    return d.value === undefined ? "0.5" : "1";
                });
            
            // Hide all tooltips
            svg.selectAll("title").style("visibility", "hidden");
            return;
        }

        // Select all circles for this player across all charts
        const playerCircles = svg.selectAll(`.player-${playerId}`);
        playerCircles
            .classed("selected", true)
            .style("filter", "drop-shadow(0 0 3px rgba(0,0,0,0.4))")
            .style("stroke-width", "2px");

        // Show all tooltips for this player
        svg.selectAll(`.tooltip-${playerId}`)
            .style("visibility", "visible");

        // Dim all other circles
        svg.selectAll("circle")
            .filter(function() {
                return !select(this).classed(`player-${playerId}`);
            })
            .style("opacity", "0.3");

        // Hide tooltips for other players
        svg.selectAll("title")
            .filter(function() {
                return !select(this).classed(`tooltip-${playerId}`);
            })
            .style("visibility", "hidden");
    }, []);

    const setupCircleInteractions = useCallback((svg: Selection<SVGSVGElement, unknown, null, undefined>) => {
        // Add click handler to SVG background to clear selection
        svg.select("rect.svg-background")
            .on("click", () => handleCircleClick(svg, null));

        // Add handlers to all circles
        svg.selectAll("circle")
            .style("cursor", "pointer")
            .style("transition", "all 0.2s ease-in-out")
            .on("mouseover", function(event: MouseEvent, d: any) {
                if (!select(this).classed("selected")) {
                    handleCircleHover(svg, d.player.id);
                }
            })
            .on("mouseout", function() {
                if (!select(this).classed("selected")) {
                    handleCircleHover(svg, null);
                }
            })
            .on("click", function(event: MouseEvent, d: any) {
                event.stopPropagation();
                handleCircleClick(svg, d.player.id);
            });

        // Initially hide all tooltips
        svg.selectAll("title").style("visibility", "hidden");
    }, [handleCircleHover, handleCircleClick]);

    return { setupCircleInteractions };
}; 