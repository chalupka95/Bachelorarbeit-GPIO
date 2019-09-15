// Author Stefan Chalupka
// Matr. Nr 6037666
// Thema: Entwicklung eines NodeJS basierten IOT Development-Kit für Raspberry Pi mit Anwenungsbeispiel


//####################___Initialisierung von Klassen und Variablen__##############################################
var express 	= require('express');
var Gpio 	= require('./GPIO.js');
var path 	= require('path');
//var gpio 	= require('rpi-gpio');
var app 	= express();
const LOGGING 	=true;

//>>>Dieses Dictionary im JSON-Format ist die Datenstrucktur für die Software 
//>>>und der Kommunikation Zwischen Server und Clients
var LEDs_dict = {
"direction":{
"pin1":"not set","pin2":"not set","pin3":"not set","pin4":"not set","pin5":"not set","pin6":"not set","pin7":"not set","pin8":"not set",
"pin9":"not set","pin10":"not set","pin11":"not set","pin12":"not set","pin13":"not set","pin14":"not set","pin15":"not set","pin16":"not set",
"pin17":"not set","pin18":"not set","pin19":"not set","pin20":"not set","pin21":"not set","pin22":"not set","pin23":"not set","pin24":"not set",
"pin25":"not set","pin26":"not set"}, "value":{
"pin1":"not set","pin2":"not set","pin3":"not set","pin4":"not set","pin5":"not set","pin6":"not set","pin7":"not set","pin8":"not set",
"pin9":"not set","pin10":"not set","pin11":"not set","pin12":"not set","pin13":"not set","pin14":"not set","pin15":"not set","pin16":"not set",
"pin17":"not set","pin18":"not set","pin19":"not set","pin20":"not set","pin21":"not set","pin22":"not set","pin23":"not set","pin24":"not set",
"pin25":"not set","pin26":"not set"},"hinweise":{}}

const GPIO_dict = {
value1:27,	//13	//1 doesnt exist
value2:2,	//3
value3:3,	//5
value4:4,	//7
value5:5,	//29
value6:6,	//31
value7:7,	//26
value8:8,	//24
value9:9,	//21
value10:10,	//19
value11:11,	//23
value12:12,	//32
value13:13,	//33
value14:14,	//8
value15:15,	//10
value16:16,	//36
value17:17,	//11
value18:18,	//12
value19:19,	//35
value20:20,	//38
value21:21,	//40
value22:22,	//15
value23:23,	//16
value24:24,	//18
value25:25,	//22
value26:26,	//37
}

//>>> Settings for ExpressServer
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


//############################___*_API_*___##################################################################

//>>> Berechnet JSON-Response für Get-Requests an /api
//>>> Optional: /api?Pin=<int>
app.get('/api*', function(req, res){
	console.log('API Get Anfrage von IP:'+req.ip)
	var newDict = {};
	LEDs_dict['hinweise']=''
	let zähler = 1
	if ('Pin' in req.query) {
		newDict["direction"]={}
		newDict["value"]={}
		console.log(req.query)
		console.log(req.query.Pin)
		for (i in req.query.Pin) {
			if (req.query.Pin[i] < 27) {
				if (LEDs_dict['direction']['pin'+req.query.Pin[i]]=='in'){
					Gpio.readValue(GPIO_dict['value'+req.query.Pin[i]], function(data) {
                                        	LEDs_dict['value']['pin'+req.query.Pin[i]]= Number(data.substr(0, 1));
						Object.assign(newDict["direction"], {[`pin${req.query.Pin[i]}`]:LEDs_dict['direction']['pin'+req.query.Pin[i]]});
						Object.assign(newDict["value"], {[`pin${req.query.Pin[i]}`]:LEDs_dict['value']['pin'+req.query.Pin[i]]});
					});
				}else{
					Object.assign(newDict["direction"], {[`pin${req.query.Pin[i]}`]:LEDs_dict['direction']['pin'+req.query.Pin[i]]});
                                        Object.assign(newDict["value"], {[`pin${req.query.Pin[i]}`]:LEDs_dict['value']['pin'+req.query.Pin[i]]});
				}
			} else {
				newDict["Hinweis"]	={[`Status${zähler}`]:"Es gibt kein GPIO "+req.query.Pin[i]};
				zähler=zähler+1
			}
		};
		setTimeout(function() {res.json(newDict)}, 100)
	} else {
        	LEDs_dict['hinweise']='Eingabe ungültig (/api?Pin=1&Pin=2)'
        	for (let pin in LEDs_dict['direction']) {
                	if (LEDs_dict['direction'][pin]=='in') {
                        	Gpio.readValue(GPIO_dict['value'+pin.substr(3,2)], function(data) {
                                	LEDs_dict['value'][pin]= Number(data.substr(0, 1));
                        	});
                	};
        	};
        	setTimeout(function() {res.json(LEDs_dict)}, 100)
	};
});

//>>> Berechnet JSON-Response und reagiert auf JSON-POST-Requests
//>>> Setzt directions und values der GPIO-Pins
app.post('/api', function(req, res) {
        console.log('API Post Anfrage von IP:'+req.ip)
        let directions=      req.body['direction'];
        let values=          req.body['value'];
        LEDs_dict['hinweise']=''
	console.log(req.body)
	console.log(directions)
	console.log(values)
        for (let direction in directions) {
		console.log(direction);
                if ((directions[direction] == LEDs_dict['direction'][direction])) {
                        console.log('Nothing to do...direction up to date');
                } else {
                        if (directions[direction] != 'not set') {
                                LEDs_dict['direction'][direction]=directions[direction];
                                LEDs_dict['value'][direction]='not set';
                                Gpio.setDirection(GPIO_dict['value'+direction.substr(3,2)], directions[direction], function() {
                                        console.log('Pin'+direction.substr(3,2)+' direction is '+directions[direction]);
                                });
                        }else{
                                Gpio.close(direction.substr(3,2), function() {
                                        console.log('Pin'+direction.substr(3,2)+' unexported');
                                        LEDs_dict['direction'][direction]='not set';
                                        LEDs_dict['value'][direction] = 'not set'
                                })
                        }
                }
        }
        for (let value in values) {
                let before=LEDs_dict['value'][value]
                if ((values[value] == LEDs_dict['value'][value])) {
                        console.log('Nothing to do...value up to date');
                } else {
                        if (LEDs_dict['direction'][value] == 'out') {
                                LEDs_dict['value'][value]=values[value];
                                Gpio.writeValue(GPIO_dict['value'+value.substr(3,2)], values[value], function(err) {
                                        if (err) {
                                                throw err
                                                LEDs_dict['hinweise']+=LEDs_dict['hinweise']+err+'\n'
                                                LEDs_dict['value'][value]=before}
                                })
                        }else{
                                LEDs_dict['hinweise']+=LEDs_dict['hinweise']+'The direction of Pin '+value.substr(3,2)+" is not out";
                        }
                }
        }
        res.json(LEDs_dict)
});

//#################################___*_MONITORING-WEBSITE_*___###########################################

//sendet die Seite 'Anwendung'
app.get('/Anwendungsbeispiel/\*', function(req, res){
        res.render('Anwendung', LEDs_dict);});

//sendet die Seite 'index' für all mögliche URLs (gut wegen vertippen)
app.get('/\*', function(req, res){
 	res.render('index', LEDs_dict);});


//Funktion für die Pins die auf der Seite 'index' (Monitoring) auf direction out gesetzt sind.
// >>> schaltet die jeweiligen Pins aus/ein  und updatet das Dictionary
app.post('/led/out/\*', function(req, res){
	tmp = req.url.substr(9, 2);
	if (LEDs_dict['value']['pin'+tmp] == 'not set') LEDs_dict['value']['pin'+tmp]=0;
	LEDs_dict['value']['pin'+tmp] = 1 - LEDs_dict['value']['pin'+tmp];
	Gpio.writeValue(GPIO_dict['value'+tmp], LEDs_dict['value']['pin'+tmp], function(err) {
        	if (err) throw err;
        	if (LOGGING) console.log('Written '+LEDs_dict['value']['pin'+tmp]+' to pin '+ GPIO_dict['value'+tmp]);
		if (LOGGING) console.log(req.ip);
		return res.render('index', LEDs_dict);
	});});

//Funktion für die Pins die auf der Seite 'index' (Monitoring) auf direction in gesetzt sind.
// >>> ließt die aktuellen Werte der Pins im System und updatet die jeweiligen Pins im Dictionary
app.post('/led/in/\*', function(req, res){
        tmp = req.url.substr(8, 2);
        Gpio.readValue(GPIO_dict['value'+tmp], function(data) {
                if (LOGGING) console.log('Read '+data.substr(0, 1) +' from pin '+ GPIO_dict['value'+tmp]);
		LEDs_dict['value']['pin'+tmp]= Number(data.substr(0, 1));
                if (LOGGING) console.log(req.ip);
                return res.render('index', LEDs_dict);
	});});

//Funktion damit die Pins auf der Seite 'index' (Monitoring) auf direction in/out gesetzt werden kann.
// >>> schaltet die jeweiligen Pins nach dem export auf ihre Funktion (Lesend/Schreibend)*
app.post('/led/export/\*', function(req, res){
        direction = req.url.substr(12, 3);
	list = req.body
	list.forEach(function(led) {
		Gpio.setDirection(GPIO_dict['value'+led.substr(3,2)], direction, function() {LEDs_dict['direction']['pin'+led.substr(3,2)]=direction});
		LEDs_dict['value']['pin'+led.substr(3,2)]='not set'	});
	return res.render('index', LEDs_dict);});


//Funktion um alle Pins auf der Seite 'index' (Monitoring) zurücksetzen zu können (Unexport).
// >>> schaltet die jeweiligen Pins komplett aus.
app.post('/unexport/\*', function(req, res){
	LEDs_dict = {
	"direction":{
		"pin1":"not set","pin2":"not set","pin3":"not set","pin4":"not set",
		"pin5":"not set","pin6":"not set","pin7":"not set","pin8":"not set",
		"pin9":"not set","pin10":"not set","pin11":"not set","pin12":"not set",
		"pin13":"not set","pin14":"not set","pin15":"not set","pin16":"not set",
		"pin17":"not set","pin18":"not set","pin19":"not set","pin20":"not set",
		"pin21":"not set","pin22":"not set","pin23":"not set","pin24":"not set",
		"pin25":"not set","pin26":"not set"},
	"value":{
		"pin1":"not set","pin2":"not set","pin3":"not set","pin4":"not set",
		"pin5":"not set","pin6":"not set","pin7":"not set","pin8":"not set",
		"pin9":"not set","pin10":"not set","pin11":"not set","pin12":"not set",
		"pin13":"not set","pin14":"not set","pin15":"not set","pin16":"not set",
		"pin17":"not set","pin18":"not set","pin19":"not set","pin20":"not set",
		"pin21":"not set","pin22":"not set","pin23":"not set","pin24":"not set",
		"pin25":"not set","pin26":"not set"},
	}
        for (let pin in LEDs_dict['direction']) {
               Gpio.close(GPIO_dict['value'+pin.substr(3,2)], function() {});}
        return res.render('index', LEDs_dict);});

//######################################___*_PORT und START_*___#################################################
app.listen(3000, function () {
  console.log('Simple LED Control Server Started on Port: 3000!')});
