var util = require('util'),
	fs = require('fs'),
	moment = require('moment'),
	date;

var version = '1.0';
log(version);


function log(x) {
	util.log(x);
}

var exec = require('child_process').exec,
	child;

child = exec('sudo airodump-ng --band bg mon0 -f 2000 --berlin 10 -t WPA2 -a -u 10 -w ./cap/test -o csv',
	function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});

// ====================== T E S T ================================

// console.log(moment([2007]).fromNow());
// fs.watch('cap', function(event, filename) {
// 	console.log('event is: ' + event);
// 	if (filename) {
// 		console.log('filename provided: ' + filename);
// 	} else {
// 		console.log('filename not provided');
// 	}
// });

// var baudio = require('baudio');
// var n = 0;
// var b = baudio(function (t) {
//     var x = Math.sin(t * 262 + Math.sin(n));
//     n += Math.sin(t);
//     return x;
// });
// b.play();

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyUSB0", {
	baudrate: 9600
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function() {
	console.log('open');
	serialPort.write('@this is raspberry pi speaking#');
});

// ============================================================

// var trackingArray = {
// 	name: 'Fei',
// 	mac: 'CC:78:5F:6B:45:5F',
// 	firstSeen: null,
// 	lastSeen: null
// };

var trackingArray = {
	name: 'Apon',
	mac: 'e8:99:c4:94:96:a4',
	firstSeen: null,
	lastSeen: null
};

// var trackingArray = {
// 		name: 'Albert',
// 		mac: '00:88:65:61:50:F7',
// 		firstSeen: null,
// 		lastSeen: null
// 	};

var helper = {
	rand: function(x) {
		Math.floor(Math.random() * x);
	},
	displayer: function(number) {
		if (number == 1) {
			serialPort.write('@<><><> I think I saw ' + trackingArray.name + ' ' + now_lastSeen + ' <><><>#', function(err, results) {
				console.log('result ' + results);
			});
		} else if (number == 2) {
			serialPort.write('@<><><> ' + trackingArray.name + ' was last seen ' + now_lastSeen + ' <><><>#', function(err, results) {
				console.log('result ' + results);
			});
		} else if (number == 3) {
			serialPort.write('@<><><> hide yo kids, hide yo wifi <><><>#', function(err, results) {
				console.log('result ' + results);
			});
		} else if (number == 4) {
			serialPort.write('@<><><> #whereisapon <><><>#', function(err, results) {
				console.log('result ' + results);
			});
		} else if (number == 5) {
			serialPort.write('@<><><> No doubt this is for mfadt14 thesis. <><><>#', function(err, results) {
				console.log('result ' + results);
			});
		}
	},
	findAllDevices: function() {
		//
	}
};

var prevTime, ready = true,
	receivedData, filePath, filename = 'test';
// generate filePath from latest filename
fs.readdir('./cap', function(err, files) {
	if (err) throw err;
	if (files.length <= 9) {
		filePath = './cap/' + filename + '-0' + files.length + '.csv';
		// console.log('file path: ' + corrFilePath);
		init(filePath);
	} else {
		filePath = './cap/' + filename + '-' + files.length + '.csv';
		// console.log('file path: ' + corrFilePath);
		// if(tmpUser.length > 0) { // start watching when has user register
		init(filePath);
	}
});
var number;

function init(path) {
	console.log('monitoring: ' + path);
	fs.watchFile(path, function(curr, prev) {
		console.log('Changed!');
		number = Math.floor((Math.random() * 5) + 1); // random 1-5
		util.log(number);
		if (ready == true) {
			fs.readFile(filePath, function(err, buffer) {
					if (err) throw err;
					var data = buffer.toString();
					var i_mac = data.indexOf(trackingArray.mac.toUpperCase());
					if (i_mac > 0) {
						date = new Date();
						trackingArray.firstSeen = data.substring(i_mac + 19, i_mac + 19 + 19);
						trackingArray.lastSeen = data.substring(i_mac + 19 + 19 + 2, i_mac + 19 + 19 + 19 + 2);
						now_firstSeen = moment(trackingArray.firstSeen).fromNow();
						now_lastSeen = moment(trackingArray.lastSeen).fromNow();
						log(now_firstSeen);
						log(now_lastSeen);
						// getting last seen and compare
						// log(date.getTime());
						// util.log('ready: ' + ready);
						// random number

						util.log(number);
						helper.displayer(number);
					}
			});
			}
	});
}

// listen to Arduino
serialPort.on('data', function(data) {
	util.log('receiving ' + data + ' from arduino');
	receivedData += data;
	// basically says if there're 'E' and 'B' signals
	if (receivedData.indexOf('#') >= 0 && receivedData.indexOf('@') >= 0) {
		// save the data between 'B' and 'E'
		var msg = receivedData.substring(receivedData.indexOf('@') + 1, receivedData.indexOf('#'));
		if (msg == 'R') {
			ready = true;
			util.log('ready: ' + ready);
		}
		receivedData = '';
		// util.log(sendData);
		// parse data to browser
		// io.sockets.emit('pot', sendData);
		// socket.io
		// emit, on, broadcast.emit, io.sockets.emit

	}
});

var checkUser = function(userarray) {
	return true;
};