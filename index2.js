var express = require('express');
var Gpio = require('./GPIO.js');
var app = express();
var path = require('path');
var gpio = require('rpi-gpio');
var status_txt1="Press Button To change Status of Led ";
var status_txt2='Led is On';
var status_txt3="Led is Off";


var LEDs_dict = {
value1:'not set',
value2:'not set',
value3:'not set',
value4:'not set',
value5:'not set',
value6:'not set',
value7:'not set',
value8:'not set',
value9:'not set',
value10:'not set',
value11:'not set',
value12:'not set',
value13:'not set',
value14:'not set',
value15:'not set',
value16:'not set',
value17:'not set',
value18:'not set',
value19:'not set',
value20:'not set',
value21:'not set',
value22:'not set',
value23:'not set',
value24:'not set',
value25:'not set',
value26:'not set',
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


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/\*', function(req, res){
 	res.render('index2',LEDs_dict);});


app.post('/led/out/\*', function(req, res){
	tmp = req.url.substr(9, 2);

	if (LEDs_dict['value'+tmp] == 'not set') LEDs_dict['value'+tmp]=1;
	LEDs_dict['value'+tmp] = 1 - LEDs_dict['value'+tmp];
	Gpio.writeValue(GPIO_dict['value'+tmp], LEDs_dict['value'+tmp], function(err) {
        	if (err) throw err;
        	console.log('Written '+LEDs_dict['value'+tmp]+' to pin '+ GPIO_dict['value'+tmp]);
		console.log(req.ip);
		return res.render('index2', LEDs_dict);
    });
});

app.post('/led/in/\*', function(req, res){
        tmp = req.url.substr(8, 2);
	console.log(tmp);
        Gpio.readValue(GPIO_dict['value'+tmp], function(data) {
                console.log('Read '+data.substr(0, 1) +' from pin '+ GPIO_dict['value'+tmp]);
		LEDs_dict['value'+tmp]= data.substr(0, 1);
                console.log(req.ip);
                return res.render('index2', LEDs_dict);
    });
});


app.post('/led/export/*', function(req, res){
        tmp = req.url.substr(11, 2);
        console.log(tmp);
	console.log(req);
        return res.render('index2', LEDs_dict);});


app.listen(3000, function () {
  console.log('Simple LED Control Server Started on Port: 3000!')
});
