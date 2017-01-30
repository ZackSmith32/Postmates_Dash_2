// Not working


//container

// var margin = {top:20, right:20, bottom:20, left:60},
// 	width = 960 - margin.left - margin.right,
// 	height = 500 - margin.top - margin.bottom;



// var svg = d3.select('body').append('svg')
// 		.attr( 'width', width + margin.left + margin.right)
// 		.attr( 'height', height + margin.top + margin.bottom)
// 	.append('g')
// 		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// load data
d3.json(allJobs, render)

// render
function render (data) {
	
	data.map(function(data) {
		console.log(data.jobTotal)
	})


	// var xScale = d3.scale.ordinal()
	// 	.domain(data.map(function(d) {return d.jobDay})) 
	// 	.rangeRoundBands([ 0, width], .2)

	// var yScale = d3.scale.linear()
	// 	.domain([ 0, d3.max(data, function(d) {return d.jobTotal})])
	// 	.range([height, 0])

	// var xAxis = d3.svg.axis()
	// 	.scale(xScale)
	// 	.orient('bottom')

	// var yAxis = d3.svg.axis()
	//     .scale(yScale)
	//     .orient("left")
	//     .ticks(10);

	// console.log(yScale.domain())
	// console.log(yScale.range())

	// svg.append('g')
	// 	.attr('class', 'x axis')
	// 	.attr('transform', 'translate(0,' + height + ')')
	// 	.call(xAxis)

	//  svg.append("g")
 //      .attr("class", "y axis")
 //      .call(yAxis)
 //    .append("text")
 //      .attr("transform", "rotate(-90)")
 //      .attr("y", 6)
 //      .attr("dy", ".71em")
 //      .style("text-anchor", "end")
 //      .text("Earnings");


	// var rects = svg.selectAll('rect').data(data);

	// rects.append('g')

	// rects.enter()
	// 	.append('rect')
	// 	.attr('class', 'bar')
	// 	.attr('x', function(d) {return xScale(d.day)})
	// 	.attr('y', function(d) {return yScale(d.payout)})
	// 	.attr('width', xScale.rangeBand())
	// 	.attr('height', function(d) { return height - yScale(d.payout)})



}

// function type(d) {
// 	d.payout = +d.payout;
// 	console.log(d.payout);
// 	return d
// }


