$(function(){
	
	$('#idTitleClass').fadeOut();
	$('#idSelectClass').fadeOut();
	
	$.getJSON('http://sandbox.gibm.ch/berufe.php', function (data){
		$.each(data, function (key, entry){
			$('#idSelectJob').append($('<option></option>').attr('value', entry.beruf_id).text(entry.beruf_name));
		});
	});
	
});