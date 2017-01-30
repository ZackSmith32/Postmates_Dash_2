$(function() {
	console.log("js loaded");
	$('form').submit( function(event) {
		event.preventDefault();
		console.log("submit button pressed");
		var reg = {
			'email': $('input[name=email]').val(),
			'password': $('input[name=password]').val()
		}
		$.ajax({
			type: 'POST',
			url: '/signup/reg',
			data: reg,
			dataType: 'json',
			encode: true,
			success: function(res) {
				console.log(res);
				if (res.success == true) {
					console.log('great success');
					window.location.replace('/dashboard');
				} 
			}
		})

	});
});