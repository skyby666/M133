$(function(){
	alert('hallo');
	$.getJSON('http://sandbox.gibm.ch/berufe.php', function (data){
		$.each(data, function (key, entry){
			$.('#IdSelectJob').append($('<option></option>').attr('value', entry.beruf_id).text(entry.beruf_name));
		});
	});
});


/*
$.getJSON('http://sandbox.gibm.ch/berufe.php', function (data){
		//iterate through each entry in data
		$.each(data, function (key, entry){
			//add every entry to dropdown
			$.('#IdSelectJob').append($('<option></option>').attr('value', entry.beruf_id).text(entry.beruf_name));
		})
	})
*/