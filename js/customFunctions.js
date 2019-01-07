// Befehle, die ausgeführt werden sollen, sobald die Seite bereit ist.
$(function(){
	
	// Definiere constants für die nicht-variablen Teile der JSON-URL.
	const JsonUrlJobs = "http://sandbox.gibm.ch/berufe.php";
	const JsonUrlClasses = "http://sandbox.gibm.ch/klassen.php?beruf_id=";
	const JsonUrlTable = "http://sandbox.gibm.ch/tafel.php?klasse_id=";
	
	// Definiere ein constant-Array, um die Wochentage schön anzuzeigen (anstatt 0-6).
	const 	weekday = new Array(7);
			weekday[0] = "Sonntag";
			weekday[1] = "Montag";
			weekday[2] = "Dienstag";
			weekday[3] = "Mittwoch";
			weekday[4] = "Donnerstag";
			weekday[5] = "Freitag";
			weekday[6] = "Samstag";
			
	// Definiere Variablen zur Zwischenspeicherung des aktuellen Jahres bzw. der aktuellen Woche.
	var date = moment();
	var currentYear = date.year();
	var currentWeek = date.week();
	
	// Definiere Variablen zur Zwischenspeicherung des ausgewählten Jahres bzw. der ausgewählten Woche.
	var selectedYear = currentYear;
	var selectedWeek = currentWeek;
	
	// Verstecke zu Beginn die Stunenplan-Tabelle und deren Überschrift.
	$('#idTableTitle').hide();
	$('#idTable').hide();
	
	// Verstecke zu Beginn die Klassenauswahl-Select-Box und deren Überschrift.
	$('#idTitleClass').hide();
	$('#idSelectClass').hide();
	
	// Setze den Titel des Stundenplans, inklusive Wochen- und Jahresangabe.
	$('#idTableTitle').append('Stundenplan der ' + selectedWeek + '. Woche des Schuljahres ' + selectedYear);
	
	// Befülle das Drop-Down für die Berufsauswahl von der JSON-Schnittstelle.
	$.getJSON(JsonUrlJobs, function (data){
		$.each(data, function (key, entry){
			$('#idSelectJob').append($('<option></option>').attr('value', entry.beruf_id).text(entry.beruf_name));
		});
	});
	
	// Füge der Berufsauswahl eine "onchange"-Funktion hinzu.
	$('#idSelectJob').change(function(){
		
		// Leere zunächst die bestehenden Optionen des Select-Elements.
		$('#idSelectClass').empty();
		
		// Füge zuerst die Standardoption hinzu, die aber nicht mehr ausgewählt werden könne soll.
		$('#idSelectClass').append('<option selected="true" disabled>Klasse auswählen ...</option>');
		
		// Befülle das Drop-Down für die Klassenauswahl von der JSON-Schnittstelle.
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
	
	// Füge der Berufsauswahl eine "onchange"-Funktion hinzu
	$('#idSelectClass').change(function(){
		
		//leere zuerst die bestehenden Optionen des Select-Elements
		$('#idTableBody').html("");
		
		$.getJSON(JsonUrlTable + $('#idSelectClass').val() + "&woche=" + selectedWeek + "-" + selectedYear, function(data, status, xhr) {
			//HTTP Status überprüfen (200 = OK)
			if (xhr.status == 200) {
				$('#idTableTitle').fadeOut();
				$('#idTable').fadeOut();
				console.log("Tafel konnte erfolgreich geladen werden");
				var items = [];
				if (data.length == 0) {
					$('#idTableBody').append("<tr><td colspan='7'> In dieser Woche wurden keine Daten gefunden. </br>Eventuell findet in dieser woche kein Unterricht statt, oder es wurden für diesen Zeitraum noch keine Daten eingegeben. </td></tr>");
				}
				else {
					$.each(data, function(key, val) {
						// 6.1 Datum, Wochentag, von, bis, Lehrer, Fach, Zimmer vorhanden
						// 6.6 Jahr und Wochennummer wird ausgegeben
						$('#idTableBody').append("<tr><td>" + moment(val.tafel_datum).format("DD-MM-YYYY") + "</td>" + "<td>" + weekday[val.tafel_wochentag] + "</td>" + "<td>" + moment(val.tafel_von, "HH:mm:ss").format("HH:mm") + "</td>" + "<td>" + moment(val.tafel_bis, "HH:mm:ss").format("HH:mm") + "</td>" + "<td>" + val.tafel_longfach + "</td>" + "<td>" + val.tafel_lehrer + "</td>" + "<td>" + val.tafel_raum + "</td>");
					});
				}
				$('#idTableTitle').fadeIn();
				$('#idTable').fadeIn();
			}
			// Falls nicht ok, Error Meldungen in die Konsole
			// 2.2 Fehlermeldung, wenn AJAX-Request nicht funktioniert.
			else {
				alert(xhr.status);
				alert(xhr.response);
				alert(xhr.responseText)
				alert(xhr.statusText);
			}
		});
		
		// Bewertung_C.1
		// mache nach Befüllung die Klassenauswahl-Select-Box wieder sichtbar
		$('#idTitleClass').fadeIn();
		$('#idSelectClass').fadeIn();
		
	});
});