var laterne = 'not set';
var schalter= 'not set';

function update_laterne() {
	let pin_id =document.getElementById("text_laterne").innerHTML.substr(13,2)
        $.get("/api?Pin="+pin_id, function(data, status){
		if ((JSON.stringify(data['direction']['pin'+pin_id])) == JSON.stringify("in")) {
			if ((JSON.stringify(data['value']['pin'+pin_id])) == 1) {
				document.getElementById('laterne').src='/images/Laterne1.png';}
			if ((JSON.stringify(data['value']['pin'+pin_id])) == 0) {
				document.getElementById('laterne').src='/images/Laterne2.png';}
			if ((JSON.stringify(data['value']['pin'+pin_id])) == JSON.stringify('not set')) {
				document.getElementById('laterne').src='/images/Laterne.png'};
		} else {
			alert('ERROR:	Pin is not direction in');
			document.getElementById('laterne').src='/images/Laterne.png'};
	});
}


function change_schalter() {
	let pin_id =document.getElementById("text_schalter").innerHTML.substr(13,2)
	$.get("/api?Pin="+pin_id, function(data, status){
		alert(JSON.stringify(data['direction']['pin'+pin_id]));
                if ((JSON.stringify(data['direction']['pin'+pin_id])) == JSON.stringify("out")) {
		        if ((JSON.stringify(data['value']['pin'+pin_id])) == 0) {
				$.ajax({
                        	contentType: 'application/json',
                        	type: 'POST',
                        	url: '/api',
                        	dataType: 'json',
                        	data: JSON.stringify({"value": {[`pin${pin_id}`]:'1'}}),
                        	success: function(datax) {
					document.getElementById('schalter').src='/images/Schalter1.png';
                                	document.getElementById("text_schalter").innerHTML='Schalter GPIO '+pin.id.substr(3,2);},
                        	error: function(){
					alert("Schalter konnte nicht auf 1 gesetzt werden");},
                        	processData: false,
                		});
			}
                        if ((JSON.stringify(data['value']['pin'+pin_id])) == 1) {
				$.ajax({
                                contentType: 'application/json',
                                type: 'POST',
                                url: '/api',
                                dataType: 'json',
                                data: JSON.stringify({"value": {[`pin${pin_id}`]:'0'}}),
                                success: function(datax) {
                                        document.getElementById('schalter').src='/images/Schalter2.png';
                                        document.getElementById("text_schalter").innerHTML='Schalter GPIO '+pin.id.substr(3,2);},
                                error: function(){
					alert("Schalter konnte nicht auf 0 gesetzt werden");},
                                processData: false,
				});
			}
                } else {
                        alert('ERROR:   Pin is not direction out');
                        document.getElementById('schalter').src='/images/Schalter2.png'};
        });
}



function set_Laterne(pin) {
	if (schalter == pin.id) {
		alert('You can not take the same GPIO like Schalter')
	} else {
		$.ajax({
			contentType: 'application/json',
			type: 'POST',
			url: '/api',
			dataType: 'json',
    			data: JSON.stringify({"direction": {[`${pin.id}`]:'in'}}),
			success: function(data) {
				document.getElementById("text_laterne").innerHTML='Laterne GPIO '+pin.id.substr(3,2);
                        	laterne=pin.id;},
			error: function(){alert("Laterne konnte nicht auf "+pin.id+" gesetzt werden");},
    			processData: false,
		});
		document.getElementById('laterne').src='/images/Laterne.png'
	}
}

function set_Schalter(pin) {
	if (laterne == pin.id) {
		alert('You can not take the same GPIO like Laterne')
	} else {
		$.ajax({
                        contentType: 'application/json',
                        type: 'POST',
                        url: '/api',
                        dataType: 'json',
                        data: JSON.stringify({"direction": {[`${pin.id}`]:'out'}}),
                        success: function(data) {
                                document.getElementById("text_schalter").innerHTML='Schalter GPIO '+pin.id.substr(3,2);
                                schalter=pin.id;},
                        error: function(){alert("Schalter konnte nicht auf "+pin.id+"gesetzt werden");},
                        processData: false,
                });
		document.getElementById("schalter").innerHTML='Schalter GPIO '+pin.id.substr(3,2)
		schalter=pin.id}}


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


/*######################################################################################*/
/*######################################################################################*/


