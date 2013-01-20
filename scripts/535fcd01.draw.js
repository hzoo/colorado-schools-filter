//draw.js
  //caption
  //states
  //counties
  //schools
  //school points

function showCaption(d, i, num) {
  var name;
  // var name = [d.properties.name, d.properties.state].join(', ');
  if (num === -1) { name = 'Hover over a county:'; }
  else if (num === 1) { name = d.properties.name;}
  else if (num === 2) { name = d.name;}

  if (caption.html() !== name) { caption.html(name); }
}

var colorado_x,
    colorado_y,
    colorado_k;

//draw colorado (and center it)
function drawStates(states) {
  var statesPath;
  d3.json('/data/colorado_and_borders.json', function(json) {
    'use strict';
     statesPath = states.selectAll('path')
        .data(json.features)
      .enter().append('path')
        .attr('d',function(d) {
          var centroid = path.centroid(d);
          // console.log(centroid);
          colorado_x = -centroid[0];
          colorado_y = -centroid[1];
          colorado_k = 9.5;
          if (d.properties.name === "Colorado") {
            g
              // .transition()
              // .duration(500)
              .attr('transform', 'scale(' + colorado_k + ')translate(' + colorado_x + ',' + colorado_y + ')')
              .style('stroke-width', 1.5 / colorado_k + 'px');
          }
          return path(d);
        });

  });
  return statesPath;
}

//draw counties
//showCaption()
function drawCounties(counties) {
  var countiesPath;
  d3.json('/data/colorado_counties.json', function(json) {
    'use strict';
    countiesPath = counties.selectAll('path')
        .data(json.features)
      .enter().append('path')
        // .attr('class', data ? quantize : null)
        .attr('d', path);
      countiesPath.on('mouseover', function(d,i) {
        if (d3.event.target.tagName === 'path') {
          showCaption(d,i,1);
        }
      })
      .on('mouseout', function() {
        if (d3.event.target.tagName !== 'path') {
          showCaption(d,i,-1);
        }
      })
      .on('click', click);
  });
  return countiesPath;
}


//
//schools zoom
function zoom() {
  g.selectAll('circle').attr("transform", transform);
}

function transform(d) {
  return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
}

//plot schools on map
//g, centered, projection,showCaption()
function plotPoints(data) {
    'use strict';
    var text = g.selectAll('circle')
      .data(data, function(d) { return d.id; });

    text.enter().insert('svg:circle')
      .attr('r', 0.2)
      .attr('cx', function(d) { return projection([d.coord[0],d.coord[1]])[0]; })
      .attr('cy', function(d) { return projection([d.coord[0],d.coord[1]])[1]; })
      .style('opacity', 0.6)
      .style('fill', function(d,i) {
        if (d.name.indexOf('ELEMENTARY') !== -1) return '#C47627';
        else if (d.name.indexOf('MIDDLE') !== -1) return '#27C476';
        else if (d.name.indexOf('HIGH') !== -1) return '#7627C4';
        else return 'gray';
      });

    text.on('mouseover',function(d,i) {
      if (d3.event.target.tagName === 'circle') {
        d3.select(this).transition()
        .duration(500)
        .attr('r',1)
        .style('fill', 'yellow');
        showCaption(d,i,2);
      }
    })
    .on('mouseout',function(d,i) {
      if (d3.event.target.tagName === 'circle') {
        d3.select(this).transition()
        .duration(500)
        .attr('r', function() {
          if (centered === null) { return 0.2; }
          else { return 0.1; }
        })
        .style('fill', function() {
          if (d.name.indexOf('ELEMENTARY') !== -1) return '#C47627'; //orange
          else if (d.name.indexOf('MIDDLE') !== -1) return '#27C476'; //green
          else if (d.name.indexOf('HIGH') !== -1) return '#7627C4'; //purple
          else return 'gray';
        });
        showCaption(d,i,-1);
      }
    });

  text.exit()
    // .transition()
    //   .duration(500)
    //   .style('opacity', 0)
    .remove();
}