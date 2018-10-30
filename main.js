const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

$.getJSON(url, function(data) {
  let chartData = data.data

  let source = data.description

  let chartObj = chartData.map(function(record) {
    let obj = {}
    obj.date = record[0]
    obj.GDP = record[1]
    return obj
  })

  let GDP = chartObj.GDP

  let date = chartObj.date

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

  let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0)

  let scaleMax = Math.floor(max / 30)

  let height = scaleMax + margin.bottom + margin.top

  let width = (chartObj.length * 4) + margin.left + margin.right

  let barWidth = (width - margin.left) / chartObj.length

  // let json = d3.select("pre").text(JSON.stringify(chartObj, undefined, 4))

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

  let years = chartData.map(function(item) {
    let quarter
    let temp = item[0].substring(5, 7)

    if (temp === '01') {
      quarter = 'Q1'
    } else
    if (temp === '04') {
      quarter = 'Q2'
    } else
    if (temp === '07') {
      quarter = 'Q3'
    } else
    if (temp === '10') {
      quarter = 'Q4'
    }
    return item[0].substring(0, 4) + ' ' + quarter
  })

  // let year = years.map(function() {
  //   for (let i = 0; i < years.length; i++) {
  //     return years[i]
  //   }
  // })

  // create chart bars
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
    .attr("fill", "#847043")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("height", function(d) {
      return d.GDP / 30
    })
    .attr('data-date', function (d, i) {
      return chartData[i][0];
    })
    .attr('data-gdp', function (d, i) {
      return chartData[i][1];
    })
    // add tooltip on mouseover
    .on("mouseover", function(data) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0.9)
      // tooltip
      //   .data(chartObj)
      //   .enter()
      //   .append("g")
      tooltip
        .html("<strong>Year &amp; Quarter</strong>: " + years + "<br><strong>GDP</strong>: $" + GDP)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + 20 + "px")
      tooltip
        .attr('data-date', function (d, i) {
          return chartData[i][0];
        })
        .attr('data-gdp', function (d, i) {
          return chartData[i][1];
        })
    })
    // remove tooltip on mouseout
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .duration(400)
        .style("opacity", 0)
    })

  // chart header
  chart.append("g")
    .append("text")
    .attr("font-size", "30")
    .attr("text-align", "center")
    .attr("class", "chartHeader")
    .attr("transform", "translate(" + (width / 3 - margin.left) + ", 15)")
    .text("U.S. Gross Domestic Product (in $Billions)")

  // X-axis scale
  chart.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + scaleMax + ")")
    .call(xAxis)

  // // source info
  // chart.append("g")
  //   .append("text")
  //   .attr("font-size", "12")
  //   .attr("text-align", "right")
  //   .attr("transform", "translate(0, " + scaleMax + ")")
  //   .text(source)

  // Y-axis scale
  chart.append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .attr("y", 20)
    .attr("dy", "0.9em")
    .append("text")
    .text("Gross Domestic Product, U.S.")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")




    // let year = function() {
    //   if (years.hasOwnProperty(key)) {
    //     return years[key]
    //   }
    // }

    // console.log(year)

    // for (let key in years) {
    //   if (years.hasOwnProperty(key)) {
    //       console.log(key + " -> " + years[key])
    //   }
    // }
    // console.log(year)

    // console.log(years[0])


      // for (let i = 0; i < years.length; i++) {
      //   console.log(years[i])
      // }


}) // end of $.getJSON
