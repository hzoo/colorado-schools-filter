//variables
var d3,
centered,
width        = 540,
height       = 500,
caption      = d3.select('#caption'),

svg          = d3.select('#map')
                .attr('width', width)
                .attr('height', height),

x            = d3.scale.linear()
                .domain([0, width])
                .range([0, width]),

y            = d3.scale.linear()
                .domain([0, height])
                .range([height, 0]),

zoom         = d3.behavior.zoom()
                .x(x)
                .y(y)
                .scaleExtent([1, 10])
                .on("zoom", zoom),

rect         = svg.append('rect')
                .attr('class', 'background')
                .attr('width', width)
                .attr('height', height),

g            = svg
                .append('g')
                  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
                .append('g'),
                  // .call(zoom),

projection   = d3.geo.albersUsa()
                .scale(width)
                .translate([0, 0]),

path         = d3.geo.path()
                .projection(projection),

counties     = g.append('g')
                .attr('id', 'counties')
                .attr('class', 'Blues'),

states       = g.append('g')
                .attr('id', 'states')
                .attr('class', 'Reds'),

statesPath   = drawStates(states),
countiesPath = drawCounties(counties);

//reset if click outside of colorado
rect.on('click', click);

//heading
var table_flight  = d3.select('#flight-list');

var header_flight = table_flight.append('thead').append('tr')
    .attr('class', 'flight');

var body_flight = table_flight.append('tbody').attr('class','list');

var table_headers = [
  'School Name',
  'Population',
  '% Remediation',
  '% Free/Reduced',
  'School Value',
  'Achievement',
  'Growth',
  'Rank'
];

var chart_headers = [
  '% White Students',
  '% Free/Reduced Lunch',
  'School Value',
  'Population',
  'Achievement',
  'Growth'
];

//and student demographics

//'Where are the schools that have the best sub-grades for student growth?',

//'Are there particular schools that have ' +
//'<a href="javascript:filter(null, [0.8,1.0], null, null, null, [7,14])">high % of low income students AND high grades for student growth?</a>',

// 'What percentage of Colorado\’s student\’s are ready for college and career by school or by school district?',
// 'Which districts have the most A schools, F schools, or improving schools?',
// 'Which schools have improved their letter grades the most?',
// 'How do these grades, graduation rates, and college/career readiness metrics compare to labor market and economic data / needs?',

var questions = [
'Where are the A schools primarily located? (' +
  '<a href="javascript:filter([null, null, [11,14], null, null, null])">A</a>' +
  ' vs. ' +
  '<a href="javascript:filter([null, null, [0,4], null, null, null])">D,F</a>)',

'Is there a correlation between A schools and poverty? (' +
'<a href="javascript:filter([null, [0.8,1], null, null, null, null])">High % Reduced Lunch</a>' +
' vs. ' +
'<a href="javascript:filter([null, [0.0,0.2], null, null, null, null])">Low % Reduced Lunch</a>)',

'Do ' +
'<a href="javascript:filter([[0.0,0.2], [0.8,1.0], null, null, null, null])">poor and minority</a>' +
' kids have access to A schools?',

'Where are ' +
'<a href="javascript:filter([null, null, null, [1000,3000], null, null])">highly populated</a>' +
' and ' +
'<a href="javascript:filter([null, null, null, [0,500], null, null])">lowly populated</a>' +
' schools located?'
];

$.each(questions, function(key, value) {
  d3.select('#question_labels')
    .append('button')
    .attr('class','btn btn'+(key+1))
    .text(key+1);
});

var question_num = 0;

$('.btn'+(question_num+1)).addClass('disabled previous-click');
$('#previous').addClass('disabled');

$('button').on('click', function(e) {
  question_num = $(this).text()-1;
  $('#question').html(questions[question_num]);
  $('.previous-click').removeClass('disabled previous-click');
  $(this).addClass('disabled previous-click');

  if (question_num == 0) $('#previous').addClass('disabled');
  else if (question_num == questions.length - 1) $('#next').addClass('disabled');
  else {
    $('#previous').removeClass('disabled');
    $('#next').removeClass('disabled');
  }

});

$('#previous').on('click', function() {
  $('#next').removeClass('disabled')
  if (question_num > 0) {
    question_num -= 1;
  }
  if (question_num == 0) {
    $('#previous').addClass('disabled');
  }
  $('.previous-click').removeClass('disabled previous-click');
  $('.btn'+(question_num+1)).addClass('disabled previous-click');
  $('#question').html(questions[question_num]);
});

$('#next').on('click', function() {
  $('#previous').removeClass('disabled')
  if (question_num < questions.length - 1) {
    question_num += 1;
  }
  if (question_num == questions.length - 1) {
    $('#next').addClass('disabled');
  }
  $('.previous-click').removeClass('disabled previous-click');
  $('.btn'+(question_num+1)).addClass('disabled previous-click');
  $('#question').html(questions[question_num]);
});

var current_question = 0;
d3.select('#question').html(questions[current_question]);

//render header
$.each(table_headers, function(key, value) {
  header_flight.append('th')
    // .attr('class', 'origin')
    .text(function() { return value; });
});

var title_detail = [
  'The x axis shows the <b>% of white students       </b> in a school.',
  'The x axis shows the <b>% of students with either free or reduced lunch</b> in a school.',
  'The x axis shows the <b>grade                     </b> given to a school. (higher is better)',
  'The x axis shows the <b>total number of students  </b> in a school.',
  'The x axis shows the <b>overall achievement number</b> given to a school. (higher is better)',
  'The x axis shows the <b>overall growth number     </b> given to a school. (higher is better)',
];

var histogram_detail = 'A histogram is a graphical representation showing a visual impression of the distribution of data.' +
'<br>' +
'Here, the y axis is the <b>number of schools with a value of the x</b>' +
' and the x axis is the title over the histogram (example: population)';
$('.histogram').popover({
    placement: 'right',
    html: 'true',
    content: histogram_detail,
    trigger: 'hover',
    delay: '500'
});

$.each(chart_headers, function(key, value) {
  d3.select('#charts')
    .append('div')
      .attr('class', 'chart')
    .append('div')
      .attr('class', 'heading')
    .append('div')
      .attr('class', 'title title' + key)
      .text(value);

  $('.title' + key).popover({
    placement: 'right',
    html: 'true',
    content: title_detail[key],
    trigger: 'hover',
    delay: '500'
  });
});

d3.json('/data/schools_3.json', function(data_schools) {
  // Various formatters.
  var formatNumber     = d3.format(',d'),
  formatChange         = d3.format('+,d'),
  formatPercent         = d3.format('.2p'),
  formatDate           = d3.time.format('%B %d, %Y'),
  formatTime           = d3.time.format('%I:%M %p');

  // A nest operator, for grouping the school list.
  // var nestByDate    = d3.nest()
  //     .key(function(d) { return d3.time.day(d.date); });

  var nestByPopulation = d3.nest()
  .key(function(d) { return d.population; });

  var nestByRank = d3.nest()
  .key(function(d) { return d.rank; });

  data_schools.forEach(function(d, i) {
    d.freeLunch     = +d.freeLunch;
    d.percent_white = +d.percent_white;
    d.population    = +d.population;
    d.grad_rate     = +d.grad_rate;
    d.school_grade  = +d.school_grade;
    });

    // Create the crossfilter for the relevant dimensions and groups.
    var school      = crossfilter(data_schools),
    all             = school.groupAll(),
    // latitude     = school.dimension(function(d) { return d.coord[0]; }),
    // latitudes    = latitude.group(),
    // longitude    = school.dimension(function(d) { return d.coord[1]; }),
    // longitudes   = longitude.group()
    coord           = school.dimension(function(d) { return d.coord; }),
    // coords          = coord.group(),
    population      = school.dimension(function(d) { return Math.min(2999, d.population); }),
    populations     = population.group(function(d) { return Math.floor(d / 100) * 100; }),

    freeLunch       = school.dimension(function(d) { return Math.min(0.99,d.pct_free); }),
    freeLunchs      = freeLunch.group(function(d) { return Math.floor(d / .05) * .05; }),

    gradRate        = school.dimension(function(d) { return Math.min(0.99,d.grad_rate); }),
    // gradRates       = gradRate.group(function(d) { return Math.floor(d / .05) * .05; }),

    schoolGrade     = school.dimension(function(d) { return d.school_grade; }),
    schoolGrades    = schoolGrade.group();

    overall_achieve = school.dimension(function(d) { return d.overall_achieve; }),
    overall_achieves= overall_achieve.group();

    overall_growth  = school.dimension(function(d) { return d.overall_growth; }),
    overall_growths = overall_growth.group();

    // remediation  = school.dimension(function(d) { return Math.min(0.999,d.remediation); }),
    // remediations = remediation.group(),
    percent_white   = school.dimension(function(d) { return Math.min(0.99,d.pct_white); }),
    percent_whites  = percent_white.group(function(d) { return Math.floor(d / .05) * .05; });

    // date         = school.dimension(function(d) { return d3.time.day(d.date); }),
    // dates        = date.group(),
    // hour         = school.dimension(function(d) { return d.date.getHours() + d.date.getMinutes() / 60; }),
    // hours        = hour.group(Math.floor),
    // delay        = school.dimension(function(d) { return Math.max(-60, Math.min(149, d.delay)); }),
    // delays       = delay.group(function(d) { return Math.floor(d / 10) * 10; }),
    // distance     = school.dimension(function(d) { return Math.min(1999, d.distance); }),
    // distances    = distance.group(function(d) { return Math.floor(d / 50) * 50; });

  var bar_width = 10 * 20;
  var charts = [
    barChart()
        .dimension(percent_white)
        .group(percent_whites)
      .x(d3.scale.linear()
        .domain([0,1])
        .rangeRound([0, bar_width])),
    barChart()
        .dimension(freeLunch)
        .group(freeLunchs)
      .x(d3.scale.linear()
        .domain([0,1])
        .rangeRound([0, bar_width])),
    barChart()
        .dimension(schoolGrade)
        .group(schoolGrades)
      .x(d3.scale.linear()
        .domain([0,14])
        .rangeRound([0, 10 * 14])),
    barChart()
        .dimension(population)
        .group(populations)
      .x(d3.scale.linear()
        .domain([0, 3000])
        .rangeRound([0, 10 * 34]))
        .filter([1500,3000]),
    barChart()
        .dimension(overall_achieve)
        .group(overall_achieves)
      .x(d3.scale.linear()
        .domain([0, 14])
        .rangeRound([0, 10 * 14])),
    barChart()
        .dimension(overall_growth)
        .group(overall_growths)
      .x(d3.scale.linear()
        .domain([0, 14])
        .rangeRound([0, 10 * 14]))
    ];

  var chart = d3.selectAll('.chart')
    .data(charts)
    .each(function(chart) {
      chart
      .on('brush', renderAll)
      .on('brushend', renderAll);
    });

  // Render the initial lists.
  var list  = d3.selectAll('.list')
    .data([schoolList]);

  // Render the total.
  d3.selectAll('#total')
    .text(formatNumber(school.size()));

  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    list.each(render);
    d3.select('#active_top').text(formatNumber(all.value()));
    d3.select('#active').text(formatNumber(all.value()));
    plotPoints(coord.top(Infinity));
    sorttable.makeSortable(document.getElementById('flight-list'));
  }

  function schoolList(div) {
    // var flightsByDate = nestByDate.entries(date.top(40));
    var schoolsByDate  = nestByRank.entries(population.top(30));

    div.each(function() {
      // var date = d3.select(this).selectAll('.date')
      //     .data(flightsByDate, function(d) { return d.key; });
      // var population = d3.select(this).selectAll('.date')
      //     .data(schoolsByDate, function(d) { return d.key; });


      // // date.enter().append('div')
      // //     .attr('class', 'date')
      // //   .append('div')
      // //     .attr('class', 'day')
      // //     .text(function(d) { return formatDate(d.values[0].date); });

      // population.enter().append('tr')
      //     .attr('class', 'date');
      //   // .append('div')
      //     // .attr('class', 'day')
      //     // .text(function(d) { return d.id; });

      // population.exit().remove();

      var flight = d3.select(this).selectAll('.flight')
          .data(schoolsByDate, function(d) { return d.key; });
          //function(d) { return d.values; }, function(d) { return d.index; });

      var flightEnter = flight.enter()
          .append('tr')
          .attr('class', 'flight');

      // flightEnter.append('td')
      //     .attr('class', 'time')
      //     .text(function(d) { return formatTime(d.date); });

      flightEnter.append('td')
          .attr('class', 'origin')
          .text(function(d) { return d.values[0].name; });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return formatNumber(d.values[0].population); });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return formatPercent(d.values[0].remediation); });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return formatPercent(d.values[0].pct_free); });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return d.values[0].school_grade; });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return d.values[0].overall_achieve; });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return d.values[0].overall_growth; });

      flightEnter.append('td')
          .attr('class', 'destination')
          .text(function(d) { return formatNumber(d.values[0].rank); });

      // flightEnter.append('td')
      //     .attr('class', 'distance')
      //     .text(function(d) { return formatNumber(d.distance) + ' mi.'; });

      // flightEnter.append('td')
      //     .attr('class', 'delay')
      //     .classed('early', function(d) { return d.delay < 0; })
      //     .text(function(d) { return formatChange(d.delay) + ' min.'; });

      flight.exit().remove();

      flight.order();
    });
  }

  // Like d3.time.format, but faster.
  function parseDate(d) {
    return new Date(2001,
        d.substring(0, 2) - 1,
        d.substring(2, 4),
        d.substring(4, 6),
        d.substring(6, 8));
  }

  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };

  //date,delay,distance,origin,destination
  //01010001,14,405,MCI,MDW

});