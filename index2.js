var express 	= require('express');
var Gpio 	= require('./GPIO.js');
var path 	= require('path');
//var gpio 	= require('rpi-gpio');
var app 	= express();
const LOGGING 	=true;

var status_txt1	="Press Button To change Status of Led ";
var status_txt2	='Led is On';
var status_txt3	="Led is Off";

var LEDs_dict = {
direction:{
pin1:'not set',pin2:'not set',pin3:'not set',pin4:'not set',
pin5:'not set',pin6:'not set',pin7:'not set',pin8:'not set',
pin9:'not set',pin10:'not set',pin11:'not set',pin12:'not set',
pin13:'not set',pin14:'not set',pin15:'not set',pin16:'not set',
pin17:'not set',pin18:'not set',pin19:'not set',pin20:'not set',
pin21:'not set',pin22:'not set',pin23:'not set',pin24:'not set',
pin25:'not set',pin26:'not set'},
value:{
pin1:'not set',pin2:'not set',pin3:'not set',pin4:'not set',
pin5:'not set',pin6:'not set',pin7:'not set',pin8:'not set',
pin9:'not set',pin10:'not set',pin11:'not set',pin12:'not set',
pin13:'not set',pin14:'not set',pin15:'not set',pin16:'not set',
pin17:'not set',pin18:'not set',pin19:'not set',pin20:'not set',
pin21:'not set',pin22:'not set',pin23:'not set',pin24:'not set',
pin25:'not set',pin26:'not set'}

}


/*
const GPIO_dict = {
value1:3,  //GPIO_2
value2:5, //GPIO_3
value3:7, //GPIO_4
value4:29,//GPIO_5
value5:31,//GPIO_6
value6:26,//GPIO_7
value7:24,//GPIO_8
value8:21,//GPIO_9
value9:19,//GPIO_10
value10:23,//GPIO_11
value11:32,//GPIO_12
value12:33,//GPIO_13
value13:8, //GPIO_14
value14:10,//GPIO_15
value15:36,//GPIO_16
value16:11,//GPIO_17
value17:12,//GPIO_18
value18:35,//GPIO_19
value19:38,//GPIO_20
value20:40,//GPIO_21
value21:15,//GPIO_22
value22:16,//GPIO_23
value23:18,//GPIO_24
value24:22,//GPIO_25
value25:37,//GPIO_26
value26:13,//GPIO_27
}
*/

const GPIO_dict = {
value1:1,
value2:2,
value3:3,
value4:4,
value5:5,
value6:6,
value7:7,
value8:8,
value9:9,
value10:10,
value11:11,
value12:12,
value13:13,
value14:14,
value15:15,
value16:16,
value17:17,
value18:18,
value19:19,
value20:20,
value21:21,
value22:22,
value23:23,
value24:24,
value25:25,
value26:26,
}
/*
//export Pins for use purpose
Gpio.setDirection(GPIO_dict['value1'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value2'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value3'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value4'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value5'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value6'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value7'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value8'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value9'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value10'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value11'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value12'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value13'], 'out', function() {});
Gpio.setDirection(GPIO_dict['value14'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value15'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value16'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value17'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value18'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value19'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value20'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value21'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value22'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value23'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value24'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value25'], 'in', function() {});
Gpio.setDirection(GPIO_dict['value26'], 'in', function() {});
*/

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/\*', function(req, res){
 	res.render('index2', LEDs_dict);});


app.post('/led/out/\*', function(req, res){
	tmp = req.url.substr(9, 2);
	if (LEDs_dict['value']['pin'+tmp] == 'not set') LEDs_dict['value']['pin'+tmp]=0;
	LEDs_dict['value']['pin'+tmp] = 1 - LEDs_dict['value']['pin'+tmp];
	Gpio.writeValue(GPIO_dict['value'+tmp], LEDs_dict['value']['pin'+tmp], function(err) {
        	if (err) throw err;
        	if (LOGGING) console.log('Written '+LEDs_dict['value']['pin'+tmp]+' to pin '+ GPIO_dict['value'+tmp]);
		if (LOGGING) console.log(req.ip);
		return res.render('index2', LEDs_dict);
	});});

app.post('/led/in/\*', function(req, res){
        tmp = req.url.substr(8, 2);
	if (LOGGING) console.log(tmp);
        Gpio.readValue(GPIO_dict['value'+tmp], function(data) {
                if (LOGGING) console.log('Read '+data.substr(0, 1) +' from pin '+ GPIO_dict['value'+tmp]);
		LEDs_dict['value']['pin'+tmp]= data.substr(0, 1);
                if (LOGGING) console.log(req.ip);
                return res.render('index2', LEDs_dict);
	});});


app.post('/led/export/\*', function(req, res){
        direction = req.url.substr(12, 3);
	list = req.body
	list.forEach(function(led) {
		//console.log(LEDs_dict['direction']['value'+led.substr(3,2)]);
		Gpio.setDirection(GPIO_dict['value'+led.substr(3,2)], direction, function() {LEDs_dict['direction']['pin'+led.substr(3,2)]=direction});
		LEDs_dict['value']['pin'+led.substr(3,2)]='not set'	});
        return res.render('index2', LEDs_dict);});

/*
app.post('/led/JSON/*', function(req, res) {
        list = req.body
        list.forEach(function(led) {
                //console.log(LEDs_dict['direction']['value'+led.substr(3,2)]);
                Gpio.setDirection(GPIO_dict['value'+led.substr(3,2)], tmp, function() {LEDs_dict['direction']['value'+led.substr(3,2)]=tmp});});
        return res.render('index2', LEDs_dict);});
*/


app.listen(3000, function () {
  console.log('Simple LED Control Server Started on Port: 3000!')});
