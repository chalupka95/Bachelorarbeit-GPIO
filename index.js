var express 	= require('express');
var Gpio 	= require('./GPIO.js');
var path 	= require('path');
//var gpio 	= require('rpi-gpio');
var app 	= express();
var router 	= express.Router();
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
pin25:'not set',pin26:'not set'},
hinweise:''
}


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


function update_in_pins(_callback){
	let dict = LEDs_dict;
        for (let pin in LEDs_dict['direction']) {
                if (LEDs_dict['direction'][pin]=='in') {
                        Gpio.readValue(GPIO_dict['value'+pin.substr(3,2)], function(data) {
                                dict['value'][pin]= Number(data.substr(0, 1));
                        });
                };
	};
	_callback(dict);
}

router.get('/', function(req, res) {
	update_in_pins(function () {setTimeout(res.json(JSON.stringify(LEDs_dict)), 100)});
});



router.post('/', function(req, res) {
        let directions=      req.body['direction'];
        let values=          req.body['value'];
	LEDs_dict['hinweise']=''
        for (let direction in directions) {
		if ((directions[direction] == LEDs_dict['direction'][direction])) {
			console.log('1Nothing to do');
		} else {
	                if (directions[direction] != 'not set') {
				if ((directions[direction]=="in") && ([2,3,4,5,6,7,8,14,15].includes(Number(direction.substr(3,2))))) {
					console.log('Direction IN doesnt work for Pin'+direction.substr(3,2));
				} else {
					LEDs_dict['direction'][direction]=directions[direction];
					LEDs_dict['value'][direction]='not set';
	                        	Gpio.setDirection(GPIO_dict['value'+direction.substr(3,2)], directions[direction], function() {
						console.log('Pin'+direction.substr(3,2)+' direction is '+directions[direction]);
					});
				}
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
			console.log('2Nothing to do');
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
	res.json(JSON.stringify(LEDs_dict))
});





app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api', router);

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

app.post('/led/_in/\*', function(req, res){
        tmp = req.url.substr(8, 2);
        Gpio.readValue(GPIO_dict['value'+tmp], function(data) {
                if (LOGGING) console.log('Read '+data.substr(0, 1) +' from pin '+ GPIO_dict['value'+tmp]);
		LEDs_dict['value']['pin'+tmp]= Number(data.substr(0, 1));
                if (LOGGING) console.log(req.ip);
                return res.render('index2', LEDs_dict);
	});});

app.post('/led/in/\*', function(req, res){
	update_in_pins(function (LED_dict) {return res.render('index2', LED_dict);});
});

app.post('/led/export/\*', function(req, res){
        direction = req.url.substr(12, 3);
	list = req.body
	list.forEach(function(led) {
		Gpio.setDirection(GPIO_dict['value'+led.substr(3,2)], direction, function() {LEDs_dict['direction']['pin'+led.substr(3,2)]=direction});
		LEDs_dict['value']['pin'+led.substr(3,2)]='not set'	});
        return res.render('index2', LEDs_dict);});


app.listen(3000, function () {
  console.log('Simple LED Control Server Started on Port: 3000!')});
