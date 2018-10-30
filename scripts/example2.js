//svg version
/*
  Sources:
    Mike Bostock's "Let's make a bar chart" https://bost.ocks.org/mike/bar/
    Tooltips tutorial http://chimera.labs.oreilly.com/books/1230000000345/ch10.html#_hover_to_highlight
    D3 documentation https://github.com/d3/d3/wiki/API-Reference
  Notes:
      I opted to not round bar widths so the bars would be more accurately placed aloing the ticks, sacrificing the prettier solid blue mass.
*/

var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

$.getJSON(url, function(data) {
  var chartData = data.data;
  var source = data.description;
  var chartObj = chartData.map(function(record) {
    var obj = {};
    obj.date = record[0];
    obj.gdp = record[1];
    return obj;
  });

  var startDate = new Date(chartObj[0].date);
  var endDate = new Date(chartObj[chartObj.length - 1].date);

  var max = d3.max(chartObj, function(d) {
      return d.gdp
    }),
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    scaleMax = Math.floor(max / 30),
    height = scaleMax + margin.bottom + margin.top,
    width = (chartObj.length * 4) + margin.left + margin.right,
    barWidth = (width - margin.left) / chartObj.length;


  //used to show "raw" data on the page, add a pre tag to html to view
  var json = d3.select('pre').text(JSON.stringify(chartObj, undefined, 4));

  var x = d3.time.scale()
    .domain([startDate, endDate])
    .range([0, width - margin.left]);

  var y = d3.scale.linear()
    .domain([0, d3.max(chartObj, function(d) {
      return d.gdp;
    })])
    .range([scaleMax, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.years, 5);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "$");

  var chart = d3.select('#myChart')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.bottom + margin.top)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = chart.selectAll('g')
    .data(chartObj)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      var adjustment = d.gdp / 30;
      var difference = scaleMax - adjustment;
      return "translate(" + (chartObj.indexOf(d) * barWidth) + ", " + difference + ")";
    })
    .append('rect')
    .attr('class', 'bar')
    .attr("width", barWidth)
    .attr("height", function(d) {
      return d.gdp / 30;
    })
    .on('mouseover', function(d) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var month = months[+d.date.slice(5, 7)];
      //event.pageX - 117
      var xPos = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0] - 50;
      var yPos = event.pageY - 940;
      var tooltip = d3.select('#tooltip')
        .style('left', xPos + 'px')
        .style('top', yPos + 'px')
        .attr('class', 'tips');

      d3.select('#dollars').text("$" + d.gdp + " Billion");
      d3.select('#quarter').text(d.date.slice(0, 4) + ' - ' + month);
    })
    .on('mouseout', function() {
      d3.select('#tooltip').attr('class', 'hidden');
    });

  chart.append("g")
    .append("text")
    .attr("font-size", "40")
    .attr("text-align", "center")
    .attr("class", "chartHeader")
    .attr("transform", "translate(" + (width / 3 - margin.left) + ", 15)")
    .text("Gross Domestic Product");

  chart.append("g")
    .append("text")
    .attr("font-size", "12")
    .attr("text-align", "center")
    .attr("transform", "translate(0 , " + height + ")")
    .text(source);

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + scaleMax + ")")
    .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("dy", ".9em")
    .style("text-anchor", "end")
    .text("Gross Domestic Product, USA");

});
