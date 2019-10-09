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
const PORT	=3000;

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
"pin25":"not set","pin26":"not set"},"hinweise":{}};

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
app.get('/api*', function(req, res) {
	if (LOGGING) console.log('API Get:'+req.ip)
	var newDict = {};
	LEDs_dict['hinweise']=''
	let zähler = 1
	if ('Pin' in req.query) {
		newDict["direction"]={};
		newDict["value"]={};
		newDict["Hinweis"]={};
		if (typeof(req.query.Pin)=='object') {
			for (i in req.query.Pin) {
				if ((req.query.Pin[i] < 27) && (req.query.Pin[i] > 0)){
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
					if (zähler==1) Object.assign(newDict["Hinweis"],{"Status0":"Es sind nur Werte zwischen 1 und 26 erlaubt"});
					Object.assign(newDict["Hinweis"],{[`Status${zähler}`]:"Es gibt kein GPIO "+req.query.Pin[i]});
					zähler=zähler+1
				}
			};
			setTimeout(function() {res.json(newDict)}, 100)
		} else { //if typeof(req.query.Pin)=='string'
			if ((req.query.Pin < 27) && (req.query.Pin > 0)){
                        	if (LEDs_dict['direction']['pin'+req.query.Pin]=='in'){
                                	Gpio.readValue(GPIO_dict['value'+req.query.Pin], function(data) {
                                        	LEDs_dict['value']['pin'+req.query.Pin]= Number(data.substr(0, 1));
                                                Object.assign(newDict["direction"], {[`pin${req.query.Pin}`]:LEDs_dict['direction']['pin'+req.query.Pin]});
                                                Object.assign(newDict["value"], {[`pin${req.query.Pin}`]:LEDs_dict['value']['pin'+req.query.Pin]});
                                        });
                                }else{
                                        Object.assign(newDict["direction"], {[`pin${req.query.Pin}`]:LEDs_dict['direction']['pin'+req.query.Pin]});
                                        Object.assign(newDict["value"], {[`pin${req.query.Pin}`]:LEDs_dict['value']['pin'+req.query.Pin]});
                                };
                        } else {
                         	Object.assign(newDict["Hinweis"],{"Status0":"Es sind nur Werte zwischen 1 und 26 erlaubt"});
                         	Object.assign(newDict["Hinweis"],{[`Status${zähler}`]:"Es gibt kein GPIO "+req.query.Pin});
				zähler=zähler+1
                	};
			setTimeout(function() {res.json(newDict)}, 100);
		}
	} else {
		Object.assign(LEDs_dict["Hinweis"],{"Status0":'Eingabe syntax (/api?Pin=1&Pin=2)'});
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
        if (LOGGING) console.log('API Post:'+req.ip)
        let directions=      req.body['direction'];
        let values=          req.body['value'];
	let zähler=1;
        LEDs_dict['Hinweis']={}
        for (let direction in directions) {
		if ((directions[direction] =='in') || (directions[direction] == 'out') || (directions[direction] == 'not set')) {
			if ((direction.substr(3,2) < 27) && (direction.substr(3,2) > 0) && direction.substr(3,2) !="") {
                		if ((directions[direction] == LEDs_dict['direction'][direction])) {
                	        	if (LOGGING) console.log('API: '+'Nothing to do...direction up to date');
                		} else {
                	        	if (directions[direction] != 'not set') {
                	        	        LEDs_dict['direction'][direction]=directions[direction];
                	        	        LEDs_dict['value'][direction]='not set';
                	        	        Gpio.setDirection(GPIO_dict['value'+direction.substr(3,2)], directions[direction], function() {
                	        	                if (LOGGING) console.log('API: '+'Pin'+direction.substr(3,2)+' direction is '+directions[direction]);
                	        	        });
                	        	}else{
                	        	        Gpio.close(direction.substr(3,2), function() {
                	        	                if (LOGGING) console.log('API: '+'Pin'+direction.substr(3,2)+' unexported');
                	        	                LEDs_dict['direction'][direction]='not set';
                	        	                LEDs_dict['value'][direction] = 'not set';
                	        	        })
                	        	}
                		}
			} else {
				if (zähler == 1) Object.assign(LEDs_dict["Hinweis"],{"Status0":"Es sind nur Value: 0/1 und Direction: 'in'/'out' für Pins zwischen 1 und 26 erlaubt"});
                        	Object.assign(LEDs_dict["Hinweis"],{[`Status${zähler}`]:"Es gibt kein "+direction});
                        	zähler=zähler+1;
			}
		} else {
			if (zähler == 1) Object.assign(LEDs_dict["Hinweis"],{"Status0":"Es sind nur Value: 0/1 und Direction: 'in'/'out' für Pins zwischen 1 und 26 erlaubt"});
			Object.assign(LEDs_dict["Hinweis"],{[`Status${zähler}`]:"Es gibt keine direction "+directions[direction]})
			zähler=zähler+1
		}
        }
        for (let value in values) {
                //let before=LEDs_dict['value'][value]
                if (((values[value] ==1) || (values[value] ==0) || (values[value] == 'not set')) && !(values[value] ==="")) {
                        if ((value.substr(3,2) < 27) && (value.substr(3,2) > 0) && value.substr(3,2) !="") {
                		if ((values[value] == LEDs_dict['value'][value])) {
                        		if (LOGGING) console.log('API: '+'Nothing to do...value up to date');
                		} else {
                        		if (LEDs_dict['direction'][value] == 'out') {
                                		//LEDs_dict['value'][value]=values[value];
                                		Gpio.writeValue(GPIO_dict['value'+value.substr(3,2)], values[value], function(err) {
                                        		if (err) {
                                                		throw err
                                                		//LEDs_dict['value'][value]=before
								if (zähler == 1) Object.assign(LEDs_dict["Hinweis"],{"Status0":"Es sind nur Value: 0/1 und Direction: 'in'/'out' für Pins zwischen 1 und 26 erlaubt"});
                                                		Object.assign(LEDs_dict["Hinweis"],{[`Status${zähler}`]:err})
                                                		zähler=zähler+1
							}else { if (LOGGING) console.log('API: '+'written '+values[value]+' to '+value);
								LEDs_dict['value'][value]=values[value].toString();
}
                                		})
                        		}else{
						if (zähler == 1) Object.assign(LEDs_dict["Hinweis"],{"Status0":"Es sind nur Value: 0/1 und Direction: 'in'/'out' für Pins zwischen 1 und 26 erlaubt"});
                                		Object.assign(LEDs_dict["Hinweis"],{[`Status${zähler}`]:'The direction of Pin '+value.substr(3,2)+" is not out"})
                                		zähler=zähler+1
                        		}
                		}
                        } else {
                                if (zähler == 1) Object.assign(LEDs_dict["Hinweis"],{"Status0":"Es sind nur Value: 0/1 und Direction: 'in'/'out' für Pins zwischen 1 und 26 erlaubt"});
                                Object.assign(LEDs_dict["Hinweis"],{[`Status${zähler}`]:"Es gibt kein "+value})
                                zähler=zähler+1
			}
                } else {
                        if (zähler == 1) Object.assign(LEDs_dict["Hinweis"],{"Status0":"Es sind nur Value: 0/1 und Direction: 'in'/'out' für Pins zwischen 1 und 26 erlaubt"});
                        Object.assign(LEDs_dict["Hinweis"],{[`Status${zähler}`]:"Es gibt keine value "+values[value]})
                        zähler=zähler+1
		}
	}
        res.json(LEDs_dict);
});

//#################################___*_MONITORING-WEBSITE_*___###########################################

//sendet die Seite 'Anwendung'
app.get('/Anwendungsbeispiel/\*', function(req, res){
        res.render('Anwendung', LEDs_dict);});

//sendet die Seite 'Anwendung'
app.get('/Anwendungsbeispiel2/\*', function(req, res){
        res.render('Anwendung2', LEDs_dict);});


//sendet die Seite 'index' für all mögliche URLs (gut wegen vertippen)
app.get('/\*', function(req, res){
 	res.render('index', LEDs_dict);});


//Funktion für die Pins die auf der Seite 'index' (Monitoring) auf direction out gesetzt sind.
// >>> schaltet die jeweiligen Pins aus/ein  und updatet das Dictionary
app.post('/led/out/\*', function(req, res){
	if (LOGGING) console.log('Webseite_LED_OUT: '+req.ip);
	tmp = req.url.substr(9, 2);
	if (LEDs_dict['value']['pin'+tmp] == 'not set') LEDs_dict['value']['pin'+tmp]=0;
	LEDs_dict['value']['pin'+tmp] = 1 - LEDs_dict['value']['pin'+tmp];
	Gpio.writeValue(GPIO_dict['value'+tmp], LEDs_dict['value']['pin'+tmp], function(err) {
        	if (err) throw err;
        	if (LOGGING) console.log('Webseite: '+'Written '+LEDs_dict['value']['pin'+tmp]+' to pin '+ GPIO_dict['value'+tmp]);
		return res.render('index', LEDs_dict);
	});});

//Funktion für die Pins die auf der Seite 'index' (Monitoring) auf direction in gesetzt sind.
// >>> ließt die aktuellen Werte der Pins im System und updatet die jeweiligen Pins im Dictionary
app.post('/led/in/\*', function(req, res){
	if (LOGGING) console.log('Webseite_LED_IN: '+req.ip);
        tmp = req.url.substr(8, 2);
        Gpio.readValue(GPIO_dict['value'+tmp], function(data) {
                if (LOGGING) console.log('Webseite: '+'Read '+data.substr(0, 1) +' from pin '+ GPIO_dict['value'+tmp]);
		LEDs_dict['value']['pin'+tmp]= Number(data.substr(0, 1));
                return res.render('index', LEDs_dict);
	});});

//Funktion damit die Pins auf der Seite 'index' (Monitoring) auf direction in/out gesetzt werden kann.
// >>> schaltet die jeweiligen Pins nach dem export auf ihre Funktion (Lesend/Schreibend)*
app.post('/led/export/\*', function(req, res){
        direction = req.url.substr(12, 3);
	if (LOGGING) console.log('Webseite_EXPORT: '+req.ip);
	list = req.body
	list.forEach(function(led) {
		Gpio.setDirection(GPIO_dict['value'+led.substr(3,2)], direction, function() {LEDs_dict['direction']['pin'+led.substr(3,2)]=direction});
		LEDs_dict['value']['pin'+led.substr(3,2)]='not set'});
	return res.render('index', LEDs_dict);});


//Funktion um alle Pins auf der Seite 'index' (Monitoring) zurücksetzen zu können (Unexport).
// >>> schaltet die jeweiligen Pins komplett aus.
app.post('/unexport/\*', function(req, res){
	if (LOGGING) console.log('Webseite_UNEXPORT_ALL: '+req.ip);
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
app.listen(PORT, function () {
  console.log('Simple LED Control Server Started on Port: '+PORT+'!')});
