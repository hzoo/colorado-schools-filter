//reset view or zoom
//g, centered
function click(d) {
  'use strict';
  var x = colorado_x,
      y = colorado_y,
      k = colorado_k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    k = 20;
    centered = d;
  } else {
    centered = null;
  }

  g.selectAll('path')
      .classed('active', centered && function(d) { return d === centered; });

  g.transition()
      .duration(500)
      .attr('transform', 'scale(' + k + ')translate(' + x + ',' + y + ')')
      .style('stroke-width', 1.5 / k + 'px');

  g.selectAll('circle')
  .transition()
    .duration(500)
    .attr('r', function() {
      if (centered === null) { return 0.2; }
      else { return 0.1; }
    });
}