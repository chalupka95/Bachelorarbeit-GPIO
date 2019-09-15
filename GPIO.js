/*
Author:		Stefan Chalupka
Version:	1
last_update:	24.08.19
Forum:		Creating my own GPIO-Pin HardwareAccess

functions:		GPIO.open
			GPIO.close
			GPIO.setDirection
			GPIO.getDirection
			GPIO.writeValue
			GPIO.readValue*/
var fs		= require('fs');

var path	= '/sys/class/gpio/';
//var path	= '/sys/devices/virtual/gpio';


//Prüft ob Pin exportiert ist, und exportiert ihn gegebenenfalls
exports.open = function (Pin, callback) {
	if (fs.existsSync(path+ 'gpio'+Pin)) console.log('Pin '+ Pin+ ' allready open')
	else fs.writeFile(path+ 'export', Pin, function (err) {
		if (err) console.log(err);
		else {console.log('Pin '+ Pin+ ' opened');
			setTimeout(callback, 100);};});}

//Prüft ob ein Pin exportiert ist, und schließt ihn gegebenenfalls
exports.close = function (Pin, callback) {
	if (fs.existsSync(path+ 'gpio'+Pin)) {
        	fs.writeFile(path+ 'unexport', Pin, function (err) {
			if (err) console.log('GPIO: '+err);
			else console.log('GPIO: '+ 'Pin '+ Pin+ ' closed');callback();
			});}
	else callback();};

//Prüft ob ein Pin exportiert ist und setzt gegebenenfalls die direction auf 'in' oder 'out'
exports.setDirection = function (Pin, direction, callback) {
       	if (fs.existsSync(path+ 'gpio'+Pin+ '/direction')) {
		fs.writeFile(path+ 'gpio'+Pin+'/direction', direction, function (err) {
                        if (err) console.log('GPIO: '+err);
                        else console.log('GPIO: '+'Direction of Pin '+ Pin+ ' is '+ direction);callback()});}
	else {
		exports.open(Pin, function() {
			fs.writeFile(path+ 'gpio'+Pin+'/direction', direction, function (err) {
                        	if (err) console.log('GPIO: '+err);
                        	else console.log('GPIO: '+'Direction of Pin '+ Pin+ ' is '+ direction);callback()});});};};

//Prüft ob ein Pin exportiert ist und ließt gegebenenfalls die direction  'in'/'out'
exports.getDirection = function (Pin, callback) {
        if (fs.existsSync(path+ 'gpio'+Pin+ '/direction')) {
		fs.readFile(path+ 'gpio' + Pin + '/direction', 'utf-8', function(err, data) {
                        if (err) console.log(err);
                        else console.log('GPIO: '+'..Value is: '+data);callback(data);});}
	else {
		console.log('GPIO: '+'Pin propably not exported');callback('');
	}};

//Prüft ob ein Pin exportiert und auf direction 'out' gesetzt ist,
//gegebenenfalls kann die value 1/0 geschrieben werden
exports.writeValue = function (Pin, value, callback) {
        if(fs.existsSync(path+ 'gpio'+Pin+ '/direction')) {
                if(fs.readFileSync(path + 'gpio' + Pin + '/direction').toString('utf8').substr(0, 3) == 'out') {
                        fs.writeFile(path+ 'gpio'+Pin+'/value', value, function (err) {
                                if (err) console.log('GPIO: '+err);
                                else console.log('GPIO: '+ 'Pin '+Pin+ ' set to '+value); callback();})}
                else {
                        exports.setDirection(Pin, 'out', function() {
                        fs.writeFile(path+ 'gpio'+Pin+'/value', value, function (err) {
                                if (err) console.log('GPIO: '+ err);
                                else console.log('GPIO: '+ 'Pin '+Pin+ ' set to '+value); callback();});});}}
        else {
                exports.setDirection(Pin, 'out', function() {
                        fs.writeFile(path+ 'gpio'+Pin+'/value', value, function (err) {
                                if (err) console.log('GPIO: '+ err);
                                else console.log('GPIO: '+ 'Pin '+Pin+ ' set to '+value); callback();});})}}

//Prüft ob ein Pin exportiert und auf direction 'in' gesetzt ist,
//gegebenenfalls kann die value 1/0 gelesen werden
exports.readValue = function (Pin, callback) {
	if(fs.existsSync(path+ 'gpio'+Pin+ '/value')) {
		if(fs.readFileSync(path + 'gpio' + Pin + '/direction').toString('utf8').substr(0, 3) == 'in') {
	        	fs.readFile(path+ 'gpio' + Pin + '/value', 'utf-8', function(err, data) {
				if (err) console.log('GPIO: '+err);
				else { console.log('GPIO: '+ 'Value of Pin '+Pin +' is '+data); callback(data);}
        			});}
		else {
			exports.setDirection(Pin, 'in', function() {
                        fs.readFile(path+ 'gpio' + Pin + '/value', 'utf-8', function(err, data) {
                                if (err) console.log('GPIO: '+ err);
                                else { console.log('GPIO: '+ 'Value of Pin '+Pin +' is '+data); callback(data);}
                                });})}}
	else {
                exports.setDirection(Pin, 'in', function() {
			fs.readFile(path+ 'gpio' + Pin + '/value', 'utf-8', function(err, data) {
                        	if (err) console.log('GPIO: '+ err);
                        	else { console.log('GPIO: '+ 'Value of Pin '+Pin +' is '+data); callback(data);}
                        	});})}};


