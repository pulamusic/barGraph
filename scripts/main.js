const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

// ***********************JSON CALL**********************

$.getJSON(url, function(data) {
  let chartData = data.data

  let source = data.description

  let chartObj = chartData.map(function(record) {
    let obj = {}
    obj.date = record[0]
    obj.GDP = record[1]
    return obj
  })

  let startDate = new Date(chartObj[0].date)

  let endDate = new Date(chartObj[chartObj.length - 1].date)

  let max = d3.max(chartObj, function(d) {
      return d.GDP
    })

  let margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  }

  let scaleMax = Math.floor(max / 30)

  let height = scaleMax + margin.bottom + margin.top

  let width = (chartObj.length * 4) + margin.left + margin.right

  let barWidth = (width - margin.left) / chartObj.length

  let json = d3.select("pre").text(JSON.stringify(chartObj, undefined, 4))

  let x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width - margin.left])

  let y = d3.scaleLinear()
    .domain([0, d3.max(chartObj, function(d) {
      return d.GDP
    })])
    .range([scaleMax, 0])

  let xAxis = d3.axisBottom(x)
    .scale(x)

  let yAxis = d3.axisLeft(y)
    .scale(y)

  let chart = d3.select("#chart")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

  let bar = chart.selectAll("g")
    .data(chartObj)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      let adjustment = d.GDP / 30
      let difference = scaleMax - adjustment
      return "translate(" + (chartObj.indexOf(d) * barWidth) + ", " + difference + ")"
    })
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("height", function(d) {
      return d.GDP / 30
    })
    .attr('data-date', function (d, i) {
      return data.data[i][0];
    })
    .attr('data-gdp', function (d, i) {
      return data.data[i][1];
    })
    .on("mouseover", function(d) {
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let month = months[+d.date.slice(5, 7)]
      let xPosition = d3.select(this.parentNode).attr("transform", "translate(0, 50)")
      let yPosition = event.pageY - 940
      let tooltip = d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .attr("class", "tips")
        .attr("id", "tooltip")
        .attr('data-date', data.data[i][0])

      

      d3.select("#dollars").text("$" + d.GDP + " Billion")
      d3.select("#quarter").text(d.date.slice(0, 4) + " - " + month)
    })
    .on("mouseout", function() {
      d3.select("#tooltip").attr("class", "hidden")
    })

  chart.append("g")
    .append("text")
    .attr("font-size", "30")
    .attr("text-align", "center")
    .attr("class", "chartHeader")
    .attr("transform", "translate(" + (width / 3 - margin.left) + ", 15)")
    .text("U.S. Gross Domestic Product (in $Billion)")

  chart.append("g")
    .append("text")
    .attr("font-size", "12")
    .attr("text-align", "center")
    .attr("transform", "translate(0, " + scaleMax + ")")
    .text(source)

  chart.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + scaleMax + ")")
    .call(xAxis)

  chart.append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("dy", "0.9em")
    .style("text-anchor", "end")
    .text("Gross Domestic Product, U.S.")

}) // end of $.getJSON
