// Befehle, die gleich zu Beginn ausgeführt werden sollen
$(function(){
	
	const JsonUrlJobs = "http://sandbox.gibm.ch/berufe.php";
	const JsonUrlClasses = "http://sandbox.gibm.ch/klassen.php?beruf_id=";
	const JsonUrlTable = "http://sandbox.gibm.ch/tafel.php?klasse_id=";
	
	// verstecke zu Beginn die Klassenauswahl-Select-Box
	$('#idTitleClass').hide();
	$('#idSelectClass').hide();
	
	// Füge der Berufsauswahl eine "onchange"-Funktion hinzu
	$('#idSelectJob').change(function(){
		
		//leere zuerst die bestehenden Optionen des Select-Elements
		$('#idSelectClass').empty();
		
		// füge zuerst die Standardoption hinzu, die aber nicht mehr ausgewählt werden kann
		$('#idSelectClass').append('<option selected="true" disabled>Klasse auswählen ...</option>');
		
		// befülle dann das Select-Element mit Daten aus der JSON-Schnittstelle
		$.getJSON(JsonUrlClasses + $('#idSelectJob').val(), function (data){
			$.each(data, function (key, entry){
				$('#idSelectClass').append($('<option></option>').attr('value', entry.klasse_id).text(entry.klasse_longname));
			});
		});
		
		// Bewertung_C.1
		// mache nach Befüllung die Klassenauswahl-Select-Box wieder sichtbar
		$('#idTitleClass').fadeIn();
		$('#idSelectClass').fadeIn();
		
	});
	
	$.getJSON(JsonUrlJobs, function (data){
		$.each(data, function (key, entry){
			$('#idSelectJob').append($('<option></option>').attr('value', entry.beruf_id).text(entry.beruf_name));
		});
	});
});