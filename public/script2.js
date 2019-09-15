//Nötige Variablen werden initialisert
var laterne = 'not set';
var schalter= 'not set';

//Funktion um mithilfe der gesetzten GPIO Nummer den Wert des Pins bei der API abzurufen
//Mit dem JSON-Response wird entschieden welche Farbe die Laterne haben soll Rot/Grün/Weiß
function update_laterne() {
	let pin_id =document.getElementById("text_laterne").innerHTML.substr(13,2).trim()
        $.get("/api?Pin="+pin_id, function(data, status){					//api/?Pin=1
		if ((JSON.stringify(data['direction']['pin'+pin_id])) == JSON.stringify("in")) {
			if ((JSON.stringify(data['value']['pin'+pin_id])) == 1) {
				document.getElementById('laterne').src='/images/Laterne1.png';}	//Grün
			if ((JSON.stringify(data['value']['pin'+pin_id])) == 0) {
				document.getElementById('laterne').src='/images/Laterne2.png';}	//Rot
			if ((JSON.stringify(data['value']['pin'+pin_id])) == JSON.stringify('not set')) {
				document.getElementById('laterne').src='/images/Laterne.png'};	//Weiß
		} else {
			alert('ERROR:	Pin is not direction in');
			document.getElementById('laterne').src='/images/Laterne.png'};		//Weiß
	});
}

//Funktion um die Funktion update_laterne() repetitiv alle 3 Sekunden aufzurufen
function repeat_update_laterne() {
	update_laterne()
	setTimeout(repeat_update_laterne(), 3000);}


//Funktion um eine GET Request an die API zu schicken um zu erfahren welchen Wert der gewählte PIN hat
//Mit diesem Wert, kann dann über eine POST Request der Wert auf sein inverses gesetzt werden.
// >>> EIN/AUS Schalter				('not set'==0) != 1
function change_schalter() {
	let pin_id =document.getElementById("text_schalter").innerHTML.substr(13,2).trim()
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
                                	document.getElementById("text_schalter").innerHTML='Schalter GPIO '+pin_id;},
                        	error: function(){
					alert("Schalter konnte nicht auf 1 gesetzt werden");},
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
                                        document.getElementById("text_schalter").innerHTML='Schalter GPIO '+pin_id;},
                                error: function(){
                                        alert("Schalter konnte nicht auf 1 gesetzt werden");},
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
                                        document.getElementById("text_schalter").innerHTML='Schalter GPIO '+pin_id;;},
                                error: function(){
					alert("Schalter konnte nicht auf 0 gesetzt werden");},
                                processData: false,
				});
			}else {alert(JSON.stringify(data))}
                } else {
                        alert('ERROR:   Pin is not direction out');
                        document.getElementById('schalter').src='/images/Schalter.png'};
        });
}


//Setzt die Laterne auf einen Wert i zwischen 1 und 26 und schickt eine JSON POST Request an die API 
//um die Pin_i auf direction 'in' zu setzen
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
	repeat_update_laterne()
}

//Setzt den Schlater auf einen Wert i zwischen 1 und 26 und schickt eine JSON POST Request an die API
//um die Pin_i auf direction 'out' zu setzen
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

/*######################################################################################*/
/*######################################################################################*/

/* Klasse für Wecker */
/* Quelle: javascriptkit.com script script2 alarm.shtml */
var jsalarm={
	padfield:function(f){
		return (f<10)? "0"+f : f
	},
	showcurrenttime:function(){
		var dateobj=new Date()
		var ct=this.padfield(dateobj.getHours())+":"+this.padfield(dateobj.getMinutes())+":"+this.padfield(dateobj.getSeconds())
		this.ctref.innerHTML=ct
		this.ctref.setAttribute("title", ct)
		if (typeof this.hourwake!="undefined"){ //if alarm is set
			if (this.ctref.title==(this.hourwake+":"+this.minutewake+":"+this.secondwake)){
				//Hier kommt das hin was beim ALARM ausgeführt werden soll

                                //clearInterval(jsalarm.timer)
                                //window.location=document.getElementById("musicloc").value
                                //change_schalter()
				$.ajax({
                                	contentType: 'application/json',
                                	type: 'POST',
                                	url: '/api',
                                	dataType: 'json',
                                	data: document.getElementById("musicloc").value,
                                	success: function(data) {
                                	        alert(JSON.stringify(data));},
                                	error: function(){
                                	        alert("Da ging was schief");},
                                	processData: false,
                                	});
			}
		}
	},
	init:function(){
		var dateobj=new Date()
		this.ctref=document.getElementById("jsalarm_ct")
		this.submitref=document.getElementById("submitbutton")
		this.submitref.onclick=function(){
			jsalarm.setalarm()
			this.value="Alarm Set"
			this.disabled=true
			return false
		}
		this.resetref=document.getElementById("resetbutton")
		this.resetref.onclick=function(){
			jsalarm.submitref.disabled=false
			jsalarm.hourwake=undefined
			jsalarm.hourselect.disabled=false
			jsalarm.minuteselect.disabled=false
			jsalarm.secondselect.disabled=false
			return false
		}
		var selections=document.getElementsByTagName("select")
		this.hourselect=selections[0]
		this.minuteselect=selections[1]
		this.secondselect=selections[2]
		for (var i=0; i<60; i++){
			if (i<24) //If still within range of hours field: 0-23
			this.hourselect[i]=new Option(this.padfield(i), this.padfield(i), false, dateobj.getHours()==i)
			this.minuteselect[i]=new Option(this.padfield(i), this.padfield(i), false, dateobj.getMinutes()==i)
			this.secondselect[i]=new Option(this.padfield(i), this.padfield(i), false, dateobj.getSeconds()==i)

		}
		jsalarm.showcurrenttime()
		jsalarm.timer=setInterval(function(){jsalarm.showcurrenttime()}, 1000)
	},
	setalarm:function(){
		this.hourwake=this.hourselect.options[this.hourselect.selectedIndex].value
		this.minutewake=this.minuteselect.options[this.minuteselect.selectedIndex].value
		this.secondwake=this.secondselect.options[this.secondselect.selectedIndex].value
		this.hourselect.disabled=true
		this.minuteselect.disabled=true
		this.secondselect.disabled=true
	}
}

