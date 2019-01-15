//calcula el promedio de kms diarios


postSignUp = function(userId, info) {
    console.log('SIGN UP');
    // FlowRouter.go('exit');
};

lineGraph = function(canvasId) {
  //The data for our line
var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                            { "x": 80,  "y": 5},
                             { "x": 100, "y": 60}];

//This is the accessor function we talked about above
var lineFunction = d3.svg.line()
                     .x(function(d) { return d.x; })                         .y(function(d) { return d.y; })
                         .interpolate("linear");

//The SVG Container
// var svgContainer = d3.select(canvasId).append("svg")
//                                     .attr("width", 200)
//                                     .attr("height", 200);

//The line SVG Path we draw
var lineGraph = d3.select(canvasId).append("svg").append("path")
                            .attr("d", lineFunction(lineData))
                            .attr("stroke", "red")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
},

lineChart = function(canvasId, chartdata) {

/* implementation heavily influenced by http://bl.ocks.org/1166403 */

// define dimensions of graph
var m = [80, 80, 80, 80]; // margins
var w = 600 - m[1] - m[3]; // width
var h = 400 - m[0] - m[2]; // height

// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
var data = [-3, 6, -1, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];

// X scale will fit all values from data[] within pixels 0-w
var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
  // automatically determining max range can work something like this
  // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

// create a line function that can convert data[] into x and y points
var line = d3.svg.line()
  // assign the X function to plot our line as we wish
  .x(function(d,i) {
    // verbose logging to show what's actually being done
    // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
    // return the X coordinate where we want to plot this datapoint
    return x(i);
  })
  .y(function(d) {
    // verbose logging to show what's actually being done
    // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
    // return the Y coordinate where we want to plot this datapoint
    return y(d);
  })

  // Add an SVG element with the desired dimensions and margin.
  var graph = d3.select(canvasId).append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  // create yAxis
  var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
  // Add the x-axis.
  graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);


  // create left yAxis
  var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
  // Add the y-axis to the left
  graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);

    // Add the line by appending an svg:path element with the data line we created above
  // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr("d", line(data));
};

dayOfMonthOptions = function() {
    let optionsArray = [];
    optionsArray.push({
        text: "-",
        value: 0
    });
    for (i = 1; i < 32; i++) {
        //var str = 'Num ' + i;
        optionsArray.push({
            text: i,
            value: i
        })
    }
    return optionsArray;
};

monthOptions = function() {
    let optionsArray = [];
    optionsArray.push({
        text: '-',
        value: 12
    })
    for (i = 0; i < 12; i++) {
        //var str = 'Num ' + i;
        optionsArray.push({
            text: moment()
                .month(i)
                .format('MMMM'),
            value: i
        })
    }
    return optionsArray;
};

bYearOptions = function() {
    let optionsArray = [];
    let thisYear = moment()
        .format('YYYY');
    let beginYear = thisYear - 125;
    optionsArray.push({
        text: '-',
        value: 5000
    });
    for (i = thisYear; i > beginYear; i--) {
        //var str = 'Num ' + i;
        optionsArray.push({
            text: i,
            value: i
        })
    }


    return optionsArray;
};

workfor = function(caller) {
      return {
        _id:Meteor.userId(),
      name: '',
      logo: false
    }
};
wf = function(caller) {
  let index = Session.get('job');
  if (Meteor.user()) {
    let jobs = Meteor.user().jobs;
    if (index === undefined || jobs === undefined || jobs.length === 0 ) {
    //   console.log('NO JOBS FOUND');
      return {
        _id: Meteor.userId(),
        name: '',
        logo: false
      };
    }else{
      console.log('JOBS FOUND');
      return {
        _id:jobs[index].companyId,
      name:jobs[index].companyName,
      logo: jobs[index].companyLogo};
    }
  }else{
    console.log('still no user data!, user is', Meteor.user());
    // Meteor.logout();
    // return {
    //   _id: 1,
    //   name: 'NO USER',
    //   logo:false
    // }
  }
};

// workfor = function() {
//   let index = Session.get('job');
//   if (Meteor.user()) {
//     let jobs = Meteor.user().jobs;
//     if (index === undefined || jobs === undefined || jobs.length === 0 ) {
//       console.log('NO JOBS FOUND, RETURNING FREELANCE OBJECT');
//       return {
//         _id: Meteor.userId(),
//         name:'Freelance',
//         logo: false
//       };
//     }else{
//       console.log('JOBS FOUND, RETURNING OBJECT');
//       return {
//         _id:jobs[index].companyId,
//       name:jobs[index].companyName,
//       logo: jobs[index].companyLogo};
//     }
//   }
// };

// Animate panel function
$.fn['animatePanel'] = function() {

    var element = $(this);
    var effect = $(this).data('effect');
    var delay = $(this).data('delay');
    var child = $(this).data('child');

    // Set default values for attrs
    if(!effect) { effect = 'zoomIn'}
    if(!delay) { delay = 0.02 } else { delay = delay / 10 }
    if(!child) { child = '.row > div'} else {child = "." + child}

    //Set defaul values for start animation and delay
    var startAnimation = 0;
    var start = Math.abs(delay) + startAnimation;

    // Get all visible element and set opacity to 0
    var panel = element.find(child);
    panel.addClass('opacity-0');

    // Get all elements and add effect class
    panel = element.find(child);
    panel.addClass('stagger').addClass('animated-panel').addClass(effect);

    var panelsCount = panel.length + 40;
    var animateTime = (panelsCount * delay * 10000) / 10;

    // Add delay for each child elements
    panel.each(function (i, elm) {
        start += delay;
        var rounded = Math.round(start * 10) / 10;
        $(elm).css('animation-delay', rounded + 's');
        // Remove opacity 0 after finish
        $(elm).removeClass('opacity-0');
    });

    // Clear animation after finish
    setTimeout(function(){
        $('.stagger').css('animation', '');
        $('.stagger').removeClass(effect).removeClass('animated-panel').removeClass('stagger');
    }, animateTime)
};
