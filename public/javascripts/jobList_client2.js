$(function() {

	var gridData = JSON.stringify(dataprep(allJobs))
	console.log(gridData)
	$('#grid').w2grid({ 
	  name: 'myGrid',
	  //recid: '_id',
	  columns: [                
	      { field: 'recid', caption: 'ID', size: '50px' },
	      { field: 'jobMerchant', caption: 'Merchant', size: '30%' },
	      { field: 'jobCategory', caption: 'Category', size: '30%' },
	      { field: 'jobTotal', caption: 'Total', size: '40%' },
	      { field: 'jobStart', caption: 'Start Date', size: '120px' }
	  ],
	  records: gridData
	});


})


function dataprep(json) {
	for( var i = 0; i< json.length-1; i++) {
		json[i]['recid'] = Number(i)
	}
	return json
}
