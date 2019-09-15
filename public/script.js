//Nötige Variablen werden initialisert
var Reload = false;
var DIRECTION_list = [];
var COLOR_dict = {
        '0':'/images/LED.png',
        '1':'/images/LED2.png',
        'not set':'/images/LED3.png'};

//Funktion um die LED im oberen Rahmen zu makieren und deren Hintergrundfarbe zu wechseln.
//>>> Makierte LED kommen in eine Liste 'DIRECTION_list'
function change(led) {
        if (led.style.backgroundColor =='lightgrey') {
                led.style.backgroundColor ='transparent';
                var position = DIRECTION_list.findIndex(function(wanted_led_id) {return led.id == wanted_led_id});
                DIRECTION_list.splice(position, 1);
        } else {led.style.backgroundColor ='lightgrey';
                if (!DIRECTION_list.includes(led.id)) DIRECTION_list.push(led.id)};}


//Funktion um die makierten PIN zu exportieren und auf die gewählte direction in/out zu setzen
//Die Liste DIRECTION_list wird geleert und mithilfe der Elemente die LEDs angezeigt
function make_direction(direction) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/led/export/"+direction, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(DIRECTION_list));
        while(DIRECTION_list.length > 0) {
                var x = DIRECTION_list.pop();
                document.getElementById(x).style.backgroundColor = "transparent";
                if (direction == 'out') {document.getElementById('border1'+x).style.display='initial';
			document.getElementById('border2'+x).style.display='none';
			document.getElementById('image1'+ x.toUpperCase()).src='/images/LED3.png';
			document.getElementById('status1P'+ x.substr(3, 5)).innerHTML = '"not set"'; }
                if (direction == 'in')  {document.getElementById('border2'+x).style.display='initial';
			document.getElementById('border1'+x).style.display='none';
			document.getElementById('image2'+ x.toUpperCase()).src='/images/LED3.png';
			document.getElementById('status2P'+ x.substr(3, 5)).innerHTML='"not set"'; }}};


//Hilfsfunktion um die Pins beim laden der Seite anzuzeigen oder auszublenden.
//Das wird nach dem Status der LED im Dictionary 'LED_dict' entschieden.
function website_dynamic(led, border, direction, value) {
        document.getElementById('image'+border+'LED'+led).src = COLOR_dict[value];
        if ((direction == 'out') && (border == 1)) document.getElementById('border'+border+'led'+led).style.display='initial';
        if ((direction == 'in')  && (border == 2)) {
		document.getElementById('border'+border+'led'+led).style.display='initial';
		Reload=true;
	}
};

//Läd die Seite alle paar Sekunden neu
function reload_page() {
	if (DIRECTION_list.length==0 && Reload==true) {
		window.location.replace(window.location.href);;
	};
}
