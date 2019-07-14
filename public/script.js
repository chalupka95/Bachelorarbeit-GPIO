var DIRECTION_list = [];
var COLOR_dict = {
        '0':'/images/LED.png',
        '1':'/images/LED2.png',
        'not set':'/images/LED3.png'};

function change(led) {
        if (led.style.backgroundColor =='lightgrey') {
                led.style.backgroundColor ='transparent';
                var position = DIRECTION_list.findIndex(function(wanted) {return led.id == wanted});
                DIRECTION_list.splice(position, 1);
        } else {led.style.backgroundColor ='lightgrey';
                if (!DIRECTION_list.includes(led.id)) DIRECTION_list.push(led.id)};}

function make_direction(direction) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/led/export/"+direction, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(DIRECTION_list));
        while(DIRECTION_list.length > 0) {
                var x = DIRECTION_list.pop();
                document.getElementById(x).style.backgroundColor = "transparent";
                if (direction == 'out') document.getElementById('border1'+x).style.display='initial';
                if (direction == 'in')  document.getElementById('border2'+x).style.display='initial';}};

function website_dynamic(led, border, direction, value) {
        document.getElementById('image'+border+'LED'+led).src = COLOR_dict[value];
        if ((direction == 'out') && (border == 1)) document.getElementById('border'+border+'led'+led).style.display='initial';
        if ((direction == 'in')  && (border == 2)) document.getElementById('border'+border+'led'+led).style.display='initial';};
