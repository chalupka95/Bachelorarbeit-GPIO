var express = require('express');
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

//export Pins for use purpose
gpio.setup(GPIO_dict['value1'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value2'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value3'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value4'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value5'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value6'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value7'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value8'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value9'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value10'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value11'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value12'], gpio.DIR_OUT);
gpio.setup(GPIO_dict['value13'], gpio.DIR_OUT);

gpio.setup(GPIO_dict['value14'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value15'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value16'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value17'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value18'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value19'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value20'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value21'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value22'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value23'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value24'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value25'], gpio.DIR_IN);
gpio.setup(GPIO_dict['value26'], gpio.DIR_IN);



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//console.log(path.join(__dirname, 'public'));

app.get('/\*', function(req, res){
 	res.render('index',LEDs_dict);
});


app.post('/led/out/\*', function(req, res){
	tmp = req.url.substr(9, 2);

	if (LEDs_dict['value'+tmp] == 'not set') LEDs_dict['value'+tmp]=false;
	LEDs_dict['value'+tmp] = !LEDs_dict['value'+tmp];
	gpio.write(GPIO_dict['value'+tmp], LEDs_dict['value'+tmp], function(err) {
        	if (err) throw err;
        	console.log('Written '+LEDs_dict['value'+tmp]+' to pin '+ GPIO_dict['value'+tmp]);
		console.log(req.ip);
		return res.render('index', LEDs_dict);
    });
});

app.post('/led/in/\*', function(req, res){
        tmp = req.url.substr(8, 2);
	console.log(tmp);
        gpio.read(GPIO_dict['value'+tmp], function(err, data) {
                if (err) throw err;
                console.log('Read '+data +' from pin '+ GPIO_dict['value'+tmp]);
		LEDs_dict['value'+tmp]= data;
                console.log(req.ip);
                return res.render('index', LEDs_dict);
    });
});


app.post('/led/export/*', function(req, res){
        tmp = req.url.substr(11, 2);
        console.log(tmp);
	console.log(req);
        return res.render('index', LEDs_dict);});




app.listen(3000, function () {
  console.log('Simple LED Control Server Started on Port: 3000!')
});




