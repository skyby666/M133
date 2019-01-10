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
	
	// Verstecke zu Beginn die Buttons zum Navigieren der Wochen
	$('#idWeekButtons').hide();
	
	// Bewertung_6.6
	// Setze den Titel des Stundenplans, inklusive Wochen- und Jahresangabe.
	updateDateTitle();
	
	// Bewertung_2.1
	// Befülle das Drop-Down für die Berufsauswahl von der JSON-Schnittstelle.
	$.getJSON(JsonUrlJobs, function (data){
		
		// Füge die Optionen hinzu PRO zurückerhaltenem Datenpaar
		$.each(data, function (key, entry){
			
			// Hinzufügen einer "option" zu meinem "select"-Element
			$('#idSelectJob').append($('<option></option>').attr('value', entry.beruf_id).text(entry.beruf_name));
			
		});
		
	});
	
	// Bewertung_4.2
	// Bewertung_5.1
	// Füge der Berufsauswahl eine "onchange"-Funktion hinzu.
	$('#idSelectJob').change(function(){
		
		// Bewertung_4.3
		// Beim Wechsel den Stunenplan und seinen Titel ausblenden, wenn dies nicht schon so ist.
		$('#idTableTitle').hide();
		$('#idTable').hide();
		$('#idWeekButtons').hide();
		
		// Leere zunächst die bestehenden Optionen des Select-Elements.
		$('#idSelectClass').empty();
		
		// Füge zuerst die Standardoption hinzu, die aber nicht mehr ausgewählt werden könne soll.
		$('#idSelectClass').append('<option selected="true" disabled>Klasse auswählen ...</option>');
		
		// Bewertung_5.2
		// Befülle das Drop-Down für die Klassenauswahl von der JSON-Schnittstelle.
		$.getJSON(JsonUrlClasses + $('#idSelectJob').val(), function (data){
			
			// Füge die Optionen hinzu PRO zurückerhaltenem Datenpaar
			$.each(data, function (key, entry){
				
				// Hinzufügen einer "option" zu meinem "select"-Element
				$('#idSelectClass').append($('<option></option>').attr('value', entry.klasse_id).text(entry.klasse_longname));
				
			});
			
		});
		
		// Bewertung_C.1
		// mache nach Befüllung die Klassenauswahl-Select-Box und deren Titel wieder sichtbar
		$('#idTitleClass').fadeIn();
		$('#idSelectClass').fadeIn();
		
	});
	
	// Bewertung_5.3
	// Füge der Berufsauswahl eine "onchange"-Funktion hinzu
	$('#idSelectClass').change(function(){
		$('#idTableTitle').fadeOut();
		$('#idTable').fadeOut(function(){
			fillTable();
		});
		
		
	});
	
	function fillTable(){
			//leere zuerst die bestehenden Optionen des Select-Elements
		$('#idTableBody').html("");
		
		$.getJSON(JsonUrlTable + $('#idSelectClass').val() + "&woche=" + selectedWeek + "-" + selectedYear, function(data, status, xhr) {
			//HTTP Status überprüfen (200 = OK)
			if (xhr.status == 200) {
				
				var items = [];
				if (data.length == 0) {
					
					// Bewertung_A.5
					$('#idTableBody').append("<tr><td colspan='7'> In dieser Woche wurden keine Daten gefunden. </br>Eventuell findet in dieser Woche kein Unterricht statt, oder es wurden für diesen Zeitraum noch keine Daten eingegeben. </td></tr>");
					
				}
				
				else {
					
					$.each(data, function(key, val) {
						
						// Bewertung_6.1
						// Bewertung_6.4
						// Bewertung_6.5
						$('#idTableBody').append("<tr><td>" + moment(val.tafel_datum).format("DD-MM-YYYY") + "</td>" + "<td>" + weekday[val.tafel_wochentag] + "</td>" + "<td>" + moment(val.tafel_von, "HH:mm:ss").format("HH:mm") + "</td>" + "<td>" + moment(val.tafel_bis, "HH:mm:ss").format("HH:mm") + "</td>" + "<td>" + val.tafel_longfach + "</td>" + "<td>" + val.tafel_lehrer + "</td>" + "<td>" + val.tafel_raum + "</td>");
						
					});
					
				}
				
				$('#idTableTitle').fadeIn();
				$('#idTable').fadeIn();
				$('#idWeekButtons').fadeIn();
				
			}
			
			// Bewertung_2.2
			else {
				
				alert(xhr.status);
				alert(xhr.response);
				alert(xhr.responseText)
				alert(xhr.statusText);
			}
			
		});
	}
	
	$('#idButtonBack').click(function(){
		date.subtract(1, 'week');
		
		$('#idTableTitle').fadeOut();
		$('#idTable').fadeOut(function(){
			updateSelectedWeekYear();
			fillTable();
		});	
	});
	
	$('#idButtonHome').click(function(){
		date = moment();
		
		$('#idTableTitle').fadeOut();
		$('#idTable').fadeOut(function(){
			updateSelectedWeekYear();
			fillTable();
		});
	});
	
	$('#idButtonForward').click(function(){
		date.add(1, 'week');
		
		$('#idTableTitle').fadeOut();
		$('#idTable').fadeOut(function(){
			updateSelectedWeekYear();
			fillTable();
		});
	});
		
	function updateSelectedWeekYear(){
		selectedWeek = date.week();
		selectedYear = date.year();
		updateDateTitle();
	}
	
	function updateDateTitle(){
		$('#idTableTitle').empty();
		$('#idTableTitle').append('Stundenplan der ' + selectedWeek + '. Woche des Schuljahres ' + selectedYear);
	}
	
});