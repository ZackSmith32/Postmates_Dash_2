$(function() {

	// funciton for loading list of bars
	var listPopulate = function(list) {
		for (var i = 0; i < list.length; i++) {
			barForIndex = list[i]
			//console.log(barForIndex)
			
			$('.barListExp').append(
				"<li><h3><a href = '/barDetails/" +barForIndex['barLink']+ "'>" +barForIndex['barName']+ "</h3></li>",
					"<ul>",
						"<li>" +barForIndex['barDay']+ "</li>",
						"<li>" +barForIndex['barArea']+ "</li>",
						"<li>" +barForIndex['barHHStart']+ "</li>",
						"<li>" +barForIndex['barHHEnd']+ "</li>",
						
					"</ul>"
		)}
	}

	listPopulate(bars);


	// filter bar list
	$('#subButton').on('click', function(event) {
		event.preventDefault();
		var dayFilterHolder = $('.barDay').map(function() {
				if (this.checked) {
					return $(this).val()}
		}).get();

		if (dayFilterHolder.length === 0) {
			dayFilterHolder = ['mon', 'tues', 'wed', 'thrs', 'fri', 'sat', 'sun', '']
		}
		// this is here because mongo is not recognizing a single element in an array as an array
		if (dayFilterHolder.length === 1) {
			dayFilterHolder.push('xxxx')
		}

		var areaFilterHolder = $('.barArea').map(function() {
				if (this.checked) {
					return $(this).val()}
		}).get();

		if (areaFilterHolder.length === 0) {
			areaFilterHolder = ['DTLA', 'SM', 'HW', 'CC', '']
		}
		
		var filters = {
			barDayFilters: dayFilterHolder,
			barAreaFilters: areaFilterHolder,
		}
		console.log(filters)
		$.ajax({
			type: 'POST',
			url: '/',
			data: filters,
			traditional: 'true',
			success: function(res){
				// the response is a list of objects, so you need to go through the list

				$('.barListExp > li').remove();
				
				var bar = res;
				
				listPopulate(bar);

			},
			
		})
		
	})
})




// need to figure out how to pass all options when nothing
// is selected.  Tried adding a callback to .get(), but it wasn't 
// working.

// futur option would be to create a global object of filters
// then referrence that when necessary


