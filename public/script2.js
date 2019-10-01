//Nötige Variablen werden initialisert
var laterne = 'not set';
var schalter= 'not set';

//Funktion um mithilfe der gesetzten GPIO Nummer den Wert des Pins bei der API abzurufen
//Mit dem JSON-Response wird entschieden welche Farbe die Laterne haben soll Rot/Grün/Weiß
function update_laterne() {
	let pin_id =document.getElementById("text_laterne").innerHTML.substr(18,2).trim()
        $.get("/api?Pin="+pin_id, function(data, status){					//api/?Pin=1
		if ((JSON.stringify(data['direction']['pin'+pin_id])) == JSON.stringify("in")) {
			if ((JSON.stringify(data['value']['pin'+pin_id])) == 1) {
				document.getElementById('laterne').src='/images/Laterne1.png';}	//Grün
			if ((JSON.stringify(data['value']['pin'+pin_id])) == 0) {
				document.getElementById('laterne').src='/images/Laterne2.png';}	//Rot
			if ((JSON.stringify(data['value']['pin'+pin_id])) == JSON.stringify('not set')) {
				document.getElementById('laterne').src='/images/Laterne.png'};	//Weiß
		} else {
			alert('ERROR:	Pin is not direction in'+'\n'+'Tipp:	'+'Set Street light first!');
			document.getElementById('laterne').src='/images/Laterne.png'};		//Weiß
	});
}

//Funktion um die Funktion update_laterne() repetitiv alle 3 Sekunden aufzurufen
function repeat_update_laterne() {
	update_laterne();
	if (schalter != 'not set') setTimeout(repeat_update_laterne, 500);}


//Funktion um eine GET Request an die API zu schicken um zu erfahren welchen Wert der gewählte PIN hat
//Mit diesem Wert, kann dann über eine POST Request der Wert auf sein inverses gesetzt werden.
// >>> EIN/AUS Schalter				('not set'==0) != 1
function change_schalter() {
	let pin_id =document.getElementById("text_schalter").innerHTML.substr(16,2).trim();
	$.get("/api?Pin="+pin_id, function(data, status){
		if ((JSON.stringify(data['direction']['pin'+pin_id])) == JSON.stringify("out")) {
			if ((JSON.stringify(data['value']['pin'+pin_id])) == JSON.stringify("0")) {
				$.ajax({
                        	contentType: 'application/json',
                        	type: 'POST',
                        	url: '/api',
                        	dataType: 'json',
                        	data: JSON.stringify({"value": {[`pin${pin_id}`]:'1'}}),
                        	success: function(datax) {
					document.getElementById('schalter').src='/images/Schalter2.png';
                                	document.getElementById("text_schalter").innerHTML='Controller GPIO '+pin_id;},
                        	error: function(){
					alert("couldn't set controller to 1");},
                        	processData: false,
                		});
			}else if ((JSON.stringify(data['value']['pin'+pin_id])) == JSON.stringify('not set')) {
                                $.ajax({
                                contentType: 'application/json',
                                type: 'POST',
                                url: '/api',
                                dataType: 'json',
                                data: JSON.stringify({"value": {[`pin${pin_id}`]:'1'}}),
                                success: function(datax) {
                                        document.getElementById('schalter').src='/images/Schalter2.png';
                                        document.getElementById("text_schalter").innerHTML='Controller GPIO '+pin_id;},
                                error: function(){
                                        alert("couldn't set controller to 1");},
                                processData: false,
                                });
                        }else if ((JSON.stringify(data['value']['pin'+pin_id])) == JSON.stringify("1")) {
				$.ajax({
                                contentType: 'application/json',
                                type: 'POST',
                                url: '/api',
                                dataType: 'json',
                                data: JSON.stringify({"value": {[`pin${pin_id}`]:'0'}}),
                                success: function(datax) {
                                        document.getElementById('schalter').src='/images/Schalter.png';
                                        document.getElementById("text_schalter").innerHTML='Controller GPIO '+pin_id;;},
                                error: function(){
					alert("couldn't set controller to 0");},
                                processData: false,
				});
			}else {alert(JSON.stringify(data))}
                } else {
                        alert('ERROR:   Pin is not direction out'+'\n'+'Tipp:    '+'Set Controller first!');
                        document.getElementById('schalter').src='/images/Schalter.png'};
        });
}


//Setzt die Laterne auf einen Wert i zwischen 1 und 26 und schickt eine JSON POST Request an die API 
//um die Pin_i auf direction 'in' zu setzen
function set_Laterne(pin) {
	if (schalter == pin.id) {
		alert('You can not take the same GPIO like Controller')
	} else {
		$.ajax({
			contentType: 'application/json',
			type: 'POST',
			url: '/api',
			dataType: 'json',
    			data: JSON.stringify({"direction": {[`${pin.id}`]:'in'}}),
			success: function(data) {
				document.getElementById("text_laterne").innerHTML='Street light GPIO '+pin.id.substr(3,2);
                        	laterne=pin.id;},
			error: function(){alert("couldn't set Street light to "+pin.id);},
    			processData: false,
		});
		document.getElementById('laterne').src='/images/Laterne.png'
	}
}

//Setzt den Schlater auf einen Wert i zwischen 1 und 26 und schickt eine JSON POST Request an die API
//um die Pin_i auf direction 'out' zu setzen
function set_Schalter(pin) {
	if (laterne == pin.id) {
		alert('You can not take the same GPIO like Street light')
	} else {
		$.ajax({
                        contentType: 'application/json',
                        type: 'POST',
                        url: '/api',
                        dataType: 'json',
                        data: JSON.stringify({"direction": {[`${pin.id}`]:'out'}}),
                        success: function(data) {
                                document.getElementById("text_schalter").innerHTML='Controller GPIO '+pin.id.substr(3,2);
                                schalter=pin.id;},
                        error: function(){alert("couldn't set Controller to "+pin.id);},
                        processData: false,
                });
		document.getElementById('schalter').src='/images/Schalter.png'
	}
}


/*######################################################################################*/
/*######################################################################################*/


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggle_selection1() {
  document.getElementById("myDropdown1").classList.toggle("show");}
function toggle_selection2() {
  document.getElementById("myDropdown2").classList.toggle("show");}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

