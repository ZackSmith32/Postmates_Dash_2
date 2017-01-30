
// ___________ data parsing ____________

var firstDay = allJobs[0]['jobStart'];
var allJobsLen = allJobs.length;
var lastDay = allJobs[allJobsLen - 1]['jobStart'];

// parse JSON data for chart
var dateArray = assessDates(allJobs)
console.log('date array', dateArray);
var jobsByDay = dateArray.map(filterJobs)
console.log('jobsByDay', jobsByDay);
var totalByDay = jobsByDay.map(sumJobs)
var chartData = addDate(dateArray, totalByDay)
chartData.unshift(['Date', 'Payout', 'Tips'])
console.log(chartData[0]);
console.log( 'char data', chartData);

// functions for parsing data for chart

function assessDates(allJobs) {
  	var activeDate = []
  	var uniqueActiveDate = []
  	for(var i = 0; i < allJobs.length; i++) {
  		activeDate.push(moment(allJobs[i]['jobStart'], 'YYYY-MM-DD'))
  	}
    console.log('assess dates: activeDate:', activeDate);

  	for(var j = 0; j < activeDate.length; j++) {
  		if(+activeDate[j] !== +activeDate[j - 1]) {
  		    uniqueActiveDate.push(activeDate[j])
  		}
  	}
  	// console.log('active date ' + uniqueActiveDate)
  	return uniqueActiveDate
}

function filterJobs(day) {
	return allJobs.filter(function(job) {
		if(day.isSame(job.jobStart, 'day')){
			return job
		}
	})
}

function sumJobs(jobs) {
	var payoutTotal = 0
	var tipTotal = 0
	if(jobs.length > 0) {	
		for (var i = 0; i < jobs.length; i++) {
			payoutTotal += jobs[i]['jobPayout']
			tipTotal += jobs[i]['jobTip']
		}
	}
	else {tipTotal = 0; payoutTotal = 0}
	rPay = Math.round(payoutTotal * 100) / 100;
	rTip = Math.round(tipTotal * 100) / 100;
	return [rPay, rTip]
}

function addDate(dateArray, dataArray) {
	var makeReady = []

	for (var i = 0; i < dataArray.length; i++) {
		makeReady.push([new Date(dateArray[i].format('YYYY,MM,DD')), 
										dataArray[i][0], 
										dataArray[i][1]])
	}
	return makeReady
}

// ___________ card calculation ___________

// Hrly rt
$(function() {
    console.log(allJobs);
    var earnings = 0
    var workTime = 0
    var jobCount;
    var hrlyRt;

    for (var i=0; i < allJobs.length; i++) {
        earnings += allJobs[i]['jobTotal']
        // console.log(allJobs[i]['jobLengthHours'] + ' and ' + allJobs[i]['jobMerchant'] + '   ' +allJobs[i]['_id'])
        workTime += allJobs[i]['jobLengthHours']
    }
    // console.log('worktime:', workTime, ', earnings:', earnings);
    hrlyRt = earnings/workTime;
    jobCount = allJobs.length;
    $(function() {
        $(".hrlyRt").append(
            "<h1 style='text-align:center'>$" + hrlyRt.toFixed(2) +
            "<span style='font-size:16px'> /hour</span>" +
            "</h1>")
            })
    $(function() {
        $(".jobCount").append(
            "<h1 style='text-align:center'>" + jobCount +
            "</h1>")
        })
    $(function() {
        $(".totalEarnings").append(
            "<h1 style='text-align:center'>$" + earnings.toFixed(2) +
            "</h1>")
    })
}())

// ______________ load earnings chart __________________

google.charts.load('current', {'packages':['corechart', 'table']});
google.charts.setOnLoadCallback(drawStuff);
google.charts.setOnLoadCallback(drawMerchantChart);

function drawStuff() {
  var data = google.visualization.arrayToDataTable(chartData);
  var earnings_view = new google.visualization.DataView(data);
  var options = {
    'width': '90%',
    'height': 325,
    'isStacked': true,
    'legend' : {position: 'bottom'},
    'hAxis': {
      'format': 'M/d',
      'girdLines': {'count': 20}
    },
    'vAxis': {
      count: 10
    },
    'animation': {
      'duration': 750,
      'startup': true
    },
    'chartArea': {'left': 30, 'top': 25, 'right': 30, 'bottom':50},
    'series': { 0: {color: 'green'}, 1: {color: '#32CD32'}}
  };
  var earnings_chart = new google.visualization.ColumnChart(
    document.getElementById('chart_div'));
  var numRows = earnings_view.getNumberOfRows();
  earnings_view.setColumns([0, 1, 2]);
  earnings_view.setRows(
      earnings_view.getFilteredRows([{column: 0, minValue: moment(lastDay).subtract(7, 'days')}])
  ) 
  earnings_chart.draw(earnings_view, options);

  // console.log("numRows = ", numRows);
  var earnings_button = $('.earnings');
  earnings_button.on('click', function() {
    // console.log("this " + this.value);
    // console.log(numRows);
    earnings_view.setRows(0, (numRows - 1));
    earnings_view.setRows(
      earnings_view.getFilteredRows([{column: 0, minValue: moment(lastDay).subtract(this.value, 'days')}])
    ) 
    earnings_chart.draw(earnings_view, options);
  });

  $(window).on('throttledresize', function(event) {
    earnings_chart.draw(earnings_view, options)
  });
}


// ___________ merchant chart data ____________


function merchantData(allJobs) {
	var merchantData = []
	for (var i = 0; i < allJobs.length; i++) {
		merchantData.push([
			allJobs[i]['jobMerchant'],
			allJobs[i]['jobTotal'],
			allJobs[i]['jobPayout'],
			allJobs[i]['jobTip'],
		])	
	}
	merchantData.unshift(['Merchant', 'Total', 'Payout', 'Tips'])
	return merchantData
}


var merchantData = merchantData(allJobs)


// ___________ load merchant chart ___________

// google.charts.load('current', {'packages':['corechart', 'controls']});
// google.charts.setOnLoadCallback(drawStuff);

function drawMerchantChart() {
	
  var merchantTable = new google.visualization.Table(
    document.getElementById('merchantTable'));

  //We omit "var" so that programmaticSlider is visible to changeRange.
 //  merchantSelect = new google.visualization.ControlWrapper({
 //    'controlType': 'CategoryFilter',
 //    'containerId': 'merchant_control',
 //    'options': {
 //      'filterColumnLabel': 'Merchant',
 //      'ui': {'labelStacking': 'vertical'}
 //    }
 //  });

 //  merchantChart  = new google.visualization.ChartWrapper({
 //    'chartType': 'BarChart',
 //    'containerId': 'merchant_chart',
 //    'options': {
 //      'width': '90%',
 //      'height': 300,
 //      //'isStacked': true,
 //      },
 //    'chartArea': {'left': 50, 'top': 15, 'right': 125, 'bottom': 25}
  // });
  var options = {
      'width': '80%',
      'height': 380,
      'animation': {
        'duration': 750,
        'startup': true
      },
      'chartArea': {'left': 50, 'top': 100, 'right': 50, 'bottom': 45},
      'cssClassNames': {headerCell: 'googleHeaderCell'}
    };

  var data = google.visualization.arrayToDataTable(merchantData);
  data.addColumn('number', 'Count')
  var groupedData = google.visualization.data.group(data, [0], 
    [
      {'column': 1,
      'aggregation': google.visualization.data.avg,
      'type': 'number',
      'label': 'Average Earnings'},
      {'column': 2,
      'aggregation': google.visualization.data.avg,
      'type': 'number',
      'label': 'Average Payout'},
      {'column': 3,
      'aggregation': google.visualization.data.avg,
      'type': 'number',
      'label': 'Average Tips'},
      {'column': 4,
      'aggregation': google.visualization.data.count,
      'type': 'number',
      'label': 'Number of Jobs'},
    ])
  groupedData.sort({column: 1, desc: true})
  var merchantView = new google.visualization.DataView(groupedData);
  // merchant_view.setColumns([0, 1])
  // merchant_view.setRows(0, 10)

  // merchantTable.bind(merchantSelect, merchantChart);
  merchantTable.draw(merchantView, options);

  // this redraws chart on window resize function is defined @ bottom
  $(window).on('throttledresize', function(event) {
    merchantTable.draw(merchantView, options);
  });
}




// __________ function for reloading when page is resized __________
// from https://github.com/louisremi/jquery-smartresize

(function($) {

var $event = $.event,
  $special,
  dummy = {_:0},
  frame = 0,
  wasResized, animRunning;

$special = $event.special.throttledresize = {
  setup: function() {
    $(this).on( "resize", $special.handler );
  },
  teardown: function() {
    $( this ).off( "resize", $special.handler );
  },
  handler: function( event, execAsap ) {
    // Save the context
    var context = this,
      args = arguments;

    wasResized = true;

    if ( !animRunning ) {
      setInterval(function(){
        frame++;

        if ( frame > $special.threshold && wasResized || execAsap ) {
          // set correct event type
          event.type = "throttledresize";
          $event.dispatch.apply( context, args );
          wasResized = false;
          frame = 0;
        }
        if ( frame > 9 ) {
          $(dummy).stop();
          animRunning = false;
          frame = 0;
        }
      }, 30);
      animRunning = true;
    }
  },
  threshold: 0
};

})(jQuery);






















































// ___________ old functions ____________

// function getDates (firstDay) {
// 	var endDay = moment()
// 	var startDay = moment(firstDay)
// 	var dateArray = []
	
// 	// need to add a filter for if first shift is in this day, then all
// 	// jobs from that shift are on this day... maybee
// 	while (startDay < endDay) {
// 		dateArray.push(moment(startDay))
// 		startDay = startDay.add(1, 'd')
// 	}
// 	return dateArray
// }






