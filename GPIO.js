/*
Author:		Stefan Chalupka
Version:	0.5
last_update:	24.05.19
Forum:		Creating my own GPIO-Pin HardwareAccess

expected functions:	GPIO.open
			GPIO.close
			GPIO.setDirection
			GPIO.getDirection
			GPIO.writeValue
			GPIO.readValue
check input:		isValidNumber
			isValidDirection
*/
var fs		= require('fs');
var path	= '/sys/class/gpio/';

exports.open = function (Pin, callback) {
	if (fs.existsSync(path+ 'gpio'+Pin)) console.log('Pin '+ Pin+ ' allready open')
	else fs.writeFile(path+ 'export', Pin, function (err) {
		if (err) console.log(err);
		else {console.log('Pin '+ Pin+ ' opened');
			setTimeout(callback, 50);};});}


exports.close = function (Pin, callback) {
	if (fs.existsSync(path+ 'gpio'+Pin)) {
        	fs.writeFile(path+ 'unexport', Pin, function (err) {
			if (err) console.log(err);
			else console.log('Pin '+ Pin+ ' closed');callback();
			});}
	else callback();};


exports.setDirection = function (Pin, direction, callback) {
       	if (fs.existsSync(path+ 'gpio'+Pin+ '/direction')) {
		fs.writeFile(path+ 'gpio'+Pin+'/direction', direction, function (err) {
                        if (err) console.log(err);
                        else console.log('Direction of Pin '+ Pin+ ' is '+ direction);callback()});}
	else {
		console.log('Direction does not exist');
		exports.open(Pin, function() {
			fs.writeFile(path+ 'gpio'+Pin+'/direction', direction, function (err) {
                        	if (err) console.log(err);
                        	else console.log('Direction of Pin '+ Pin+ ' is '+ direction);callback()});});};};


exports.getDirection = function (Pin, callback) {
        if (fs.existsSync(path+ 'gpio'+Pin+ '/direction')) {
		fs.readFile(path+ 'gpio' + Pin + '/direction', 'utf-8', function(err, data) {
                        if (err) console.log(err);
                        else console.log('..Value is: '+data);callback(data);});}
	else {
		console.log('Pin propably not exported');
		callback('not set');}};


exports.writeValue = function (Pin, value, callback) {
        if(fs.existsSync(path+ 'gpio'+Pin+ '/direction')) {
                if(fs.readFileSync(path + 'gpio' + Pin + '/direction').toString('utf8').substr(0, 3) == 'out') {
                        fs.writeFile(path+ 'gpio'+Pin+'/value', value, function (err) {
                                if (err) console.log(err);
                                else console.log('Pin '+Pin+ ' set to '+value); callback();})}
                else {
                        exports.setDirection(Pin, 'out', function() {
                        fs.writeFile(path+ 'gpio'+Pin+'/value', value, function (err) {
                                if (err) console.log(err);
                                else console.log('Pin '+Pin+ ' set to '+value); callback();});});}}
        else {
                exports.setDirection(Pin, 'out', function() {
                        fs.writeFile(path+ 'gpio'+Pin+'/value', value, function (err) {
                                if (err) console.log(err);
                                else console.log('Pin '+Pin+ ' set to '+value); callback();});})}}


exports.readValue = function (Pin, callback) {
	if(fs.existsSync(path+ 'gpio'+Pin+ '/value')) {
		if(fs.readFileSync(path + 'gpio' + Pin + '/direction').toString('utf8').substr(0, 3) == 'in') {
	        	fs.readFile(path+ 'gpio' + Pin + '/value', 'utf-8', function(err, data) {
				if (err) console.log(err);
				else { console.log('Value of Pin '+Pin +' is '+data); callback(data);}
        			});}
		else {
			exports.setDirection(Pin, 'in', function() {
                        fs.readFile(path+ 'gpio' + Pin + '/value', 'utf-8', function(err, data) {
                                if (err) console.log(err);
                                else { console.log('Value of Pin '+Pin +' is '+data); callback(data);}
                                });})}}
	else {
                exports.setDirection(Pin, 'in', function() {
			fs.readFile(path+ 'gpio' + Pin + '/value', 'utf-8', function(err, data) {
                        	if (err) console.log(err);
                        	else { console.log('Value of Pin '+Pin +' is '+data); callback(data);}
                        	});})}};

/*
setTimeout(function(){exports.close(25, function() {console.log('0_CLOSE')});}, 1000);
setTimeout(function(){exports.setDirection(25, 'out', function() {console.log('1')});}, 2000);
setTimeout(function(){exports.close(25, function() {console.log('2_CLOSE')});}, 3000);
setTimeout(function(){exports.setDirection(25, 'in', function() {console.log('3')});}, 4000);
setTimeout(function(){exports.close(25, function() {console.log('4_CLOSE')});}, 5000);
setTimeout(function(){exports.writeValue(25, 1, function() {console.log('5')});}, 6000);
setTimeout(function(){exports.readValue(25, function(x) {console.log('6_VALUE: '+x)});}, 7000);
setTimeout(function(){exports.close(25, function() {console.log('7_CLOSE')});}, 8000);
setTimeout(function(){exports.writeValue(26, 1, function() {console.log('8')});}, 9000);
setTimeout(function(){exports.readValue(6, function(x) {console.log('9_VALUE: '+x)});}, 10000);
setTimeout(function(){exports.writeValue(26, 0, function() {console.log('10')});}, 11000);
setTimeout(function(){exports.readValue(6, function(x) {console.log('11_VALUE: '+x)});}, 12000);

setTimeout(function(){exports.writeValue(25, 1, function() {
	setTimeout(function(){exports.writeValue(25, 0, function() {
		setTimeout(function(){exports.writeValue(25, 1, function() {
			setTimeout(function(){exports.writeValue(25, 0, function() {
				setTimeout(function(){exports.writeValue(25, 1, function() {
					setTimeout(function(){exports.writeValue(25, 0, function() {console.log('4')});}, 1000);});}, 2000);});}, 1000);});}, 2000);});}, 1000);});}, 2000);

*/
