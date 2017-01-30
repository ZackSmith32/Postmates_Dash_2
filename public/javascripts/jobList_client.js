$(function() {

	var maxShift = maxShift(allJobs)
	var collapseData = listMaker(allJobs, maxShift)	
	
	collapseData.forEach(function(jobs) {
		var shiftNumber = jobs[0]['shiftNumber']
		
		$('.panel-group').append(
				
			"<div class='panel panel-default'>"+
				"<div class='panel-heading'>"+
					"<h4 class='panel-title'>"+
						"<a data-toggle='collapse' href='#shift" +shiftNumber+ "'>"+
							"Shift " + shiftNumber +
						"</a>"+
					"</h4>"+
				"</div>"+
			"</div>"+

			"<div id='shift" +shiftNumber+ "' class='panel-collapse collapse'>"+
				"<div class='panel-body'>"+
					"<table class='table table-hover'>"+
					  "<thead class='thead-default'>"+
					    "<tr>"+
					      "<th>Merchant</th>"+
					      "<th>Start Time</th>"+
					      "<th>Total</th>"+
					      "<th>Payout</th>"+
					      "<th>Tip</th>"+
					      "<th>Save</th>"+
					    "</tr>"+
					  "</thead>"+
					  "<tbody>"+
					  "</tbody>"+
					"</table>"+
				"</div>"+
			"</div>"
		)

		jobs.forEach(function(job) {
			$('.panel-group>div:last-child>div>table>tbody').append(

				"<tr id=" + job['_id'] + ">"+
				  "<td>" + job.jobMerchant + "</td>"+
				  "<td>" + moment(job.jobStart).format('MM/DD') + "</td>"+
				  "<td>" + job.jobTotal.toFixed(2) + "</td>"+
				  "<td contenteditable='true'>" + job.jobPayout.toFixed(2) + "</td>"+
				  "<td contenteditable='true'>" + job.jobTip.toFixed(2) + "</td>"+
				  "<td><button type='button' disabled='true'>Save</button></td>"+
				"</tr>"
			)
		})	
	})

	$('#accordion').accordion()

	// enable 'save' button when content is edited
	$('td[contenteditable=true]').blur(function () {
    $(this).parent('tr').find('button').removeAttr('disabled');
  });

  $('button').click(function () {
	  var contents = $(this).parent().parent().find('td[contenteditable=true]');
	  var contentArray = [];
	  for (i = 0; i < contents.length; i++) {
	    contentArray[i] = contents[i].innerHTML;
	  }
	  contentArray.unshift($(this).parent().parent().attr('id'))
	  console.log(contentArray)
	  $.post("/jobList", contentArray);
   });

	// figure out the highest shift number
	function maxShift(data) {
		var shiftNums = []
		for( var i= 0; i<data.length; i++) {
			shiftNums.push(Number(data[i]['shiftNumber']))
		}
		shiftNums.sort(function(a, b) {return a-b})
		return shiftNums[shiftNums.length-1]
	}

})




// make a list where each entry is a list of jobs from
// the same shift
function listMaker(allJobs, n) {
	var listAll=[]
	for (var k = 1; k<=n; k++) {
		var listShift = allJobs
			.filter(function(jobs) {return jobs.shiftNumber == k})
		// maybe try listAll[k] = listShift
		// that would be more reliable
		listAll.push(listShift)
	}
	return listAll
}


// recursive version of putting everything in a list
// still needs a little work
// function listMaker(allJobs, n) {
// 		var listAll=[]
// 		var listShift = allJobs.filter(function(jobs) {
// 			return jobs.shiftNumber == n})
// 		console.log(listShift)
// 		if(listShift.length<1) {return listAll}
// 		listAll.push(listShift)
// 		listMaker(allJobs, n+1)
// }











