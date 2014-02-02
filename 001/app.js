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

child = exec('sudo airodump-ng --band bg mon0 -f 2000 --berlin 10 -t WPA2 -a -u 10 -w ./cap/test -o csv', {
		maxBuffer: 10000 * 1024
	},
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
var arduino = new SerialPort("/dev/ttyUSB0", {
	baudrate: 115200
}, false); // this is the openImmediately flag [default is true]

arduino.open(function() {
	console.log('open');
	arduino.write('@hide yo kids, hide yo wifi#');
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
	write: function(msg) {},
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
		init(corrFilePath);
	} else {
		filePath = './cap/' + filename + '-' + files.length + '.csv';
		// console.log('file path: ' + corrFilePath);
		// if(tmpUser.length > 0) { // start watching when has user register
		app.init(filePath);
	}
});

var app = {
	allDevices: 0,
	activeDevices: 0,
	allRouters: 0,
	defaultMsgPool: ['Hide yo kids, hide yo wifi', 'I saw you coming', 'I see you going', 'BLEEP! BLEEP!'],
	msgPool: [],
	init: function(path) {
		console.log('monitoring: ' + path);
		fs.watchFile(path, function(curr, prev) {
			console.log('Changed!');
			fs.readFile(filePath, function(err, buffer) {
				var data = buffer.toString();
				// try displaying def msg pool when ready is true
				app.display();
				// read csv
				app.countAllRouter(data);
				app.countAllDevice(data);
				app.countActiveDevice(data);
			});
		});
	},
	display: function() {
		setInterval(function() {
			if (ready) {
				// arduino.write('@<><><> ' + app.defaultMsgPool[Math.floor(Math.random() * app.defaultMsgPool.length)] + ' ' + app.allDevices + '! such a mad crowd here' + ' <><><>#');
				// arduino.write('@<><><> ' + app.allDevices + ' devices found and counting' + ' <><><>#');
				arduino.write('@<><><> ' + app.nowDevices + ' visitors' + ' <><><>#');
				ready = false;
			}
		}, 1000 / 10);
	},
	countAllRouter: function(data) {
		data1 = data.substring(data.indexOf('key') + 5, data.indexOf('ESSIDs') - 5);
		app.allRouters = data1.match(/\n/g).length - 2;
		console.log(app.allRouters, 'routers online');
	},
	countAllDevice: function(data) {
		// strip
		data1 = data.substring(data.indexOf('ESSIDs') + 8, data.length);
		// count /n
		app.allDevices = data1.match(/\n/g).length - 1;
		console.log(app.allDevices, 'devices online');
	},
	countActiveDevice: function(data) {
		var currentTime = moment().format('HH:mm');
		console.log(currentTime);
		data1 = data.substring(data.indexOf('ESSIDs') + 8, data.length);
		app.activeDevices = data1.match(currentTime, 'g').length;
		console.log(app.activeDevices);
	}
};

// listen to Arduino
arduino.on('data', function(data) {
	receivedData += data;
	// basically says if there're 'E' and 'B' signals
	if (receivedData.indexOf('#') >= 0 && receivedData.indexOf('@') >= 0) {
		// save the data between 'B' and 'E'
		var msg = receivedData.substring(receivedData.indexOf('@') + 1, receivedData.indexOf('#'));
		if (msg == '^') {
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