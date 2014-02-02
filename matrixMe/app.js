// we need 
// WEATHER
// TWITTER HASHTAG
// SERIALPORT

// REQUIRES
var util = require('util'),
	fs = require('fs'),
	moment = require('moment'),
	$ = require('jquery'),
	serialPort = require("serialport").SerialPort,
	arduino = new serialPort("/dev/ttyUSB0", {
		baudrate: 115200
	}, false),
	twitter = require('ntwitter'),
	twit = new twitter({
		consumer_key: 'gagZjEZdXYV6zhSQSlPz4A',
		consumer_secret: 'HLRm7d1FsT55x94Oy9sQE00EXMFvRDcyOfh1i98sA',
		access_token_key: '898894117-LkF81Lq3OXy23Uf7qabS81gw0HkbhxWwHh3kpPcB',
		access_token_secret: 'YcT7VrVdglZbnUWCfOYQNOViO6cKChaKs8GkUCFgkbUH3'
	});

// HELPERS
var m = Math;

function u(x) {
	util.log(x);
}

function rand(x) {
	return m.floor(m.random() * x);
}

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
  };
}

//====================================

var app = {
	tweetPool: [],
	wInfo: ['ea440feaab5a84e7', 'NY', 'New_York'], // wunderground info
	init: function() {
		u('INIT, today is ' + moment().format('MMMM Do YYYY h:mm a'));
		this.getWeather(app.wInfo[0], app.wInfo[1], app.wInfo[2]);
		this.initArduino();
		this.listenToArduino();
	},
	readyToSend: false,
	initArduino: function() {
		arduino.open(function() {
			u('opening serial port');
			app.write('why so boringzzzz');
		});
	},
	write: function(msg) {
		app.readyToSend = false;
		arduino.write(app.formatMsg(msg));
	},
	listenToArduino: function() {
		var seq = 0;
		arduino.on('data', function(data) {
			// u('listening to arduino');
			var receivedData;
			receivedData += data;
			// basically says if there're 'E' and 'B' signals
			if (receivedData.indexOf('#') >= 0 && receivedData.indexOf('@') >= 0) {
				// save the data between 'B' and 'E'
				var msg = receivedData.substring(receivedData.indexOf('@') + 1, receivedData.indexOf('#'));
				if (msg == '^') {
					app.readyToSend = true;
					u('displaying seq: ' + seq);
					if(app.tweetPool.length > 0) {
						var tweet = app.tweetPool[seq];
						app.write(tweet);
						if(seq < app.tweetPool.length-1) {
							seq++;
						} else {
							seq = 0;
						}
					}
				}
				receivedData = '';
			}
		});
	},
	formatMsg: function(msg) {
		return '|' + msg + '`';
	},
	weather: {
		weather: null,
		temp_c: null,
		temp_f: null
	},
	getWeather: function(api, state, city) { // NY, New_York
		$.ajax({
			dataType: 'jsonp',
			url: 'http://api.wunderground.com/api/' + api + '/conditions/q/' + state + '/' + city + '.json',
			success: function(data) {
				app.weather = {
					weather: data.current_observation.weather,
					temp_c: data.current_observation.feelslike_c,
					temp_f: data.current_observation.feelslike_f
				};
				return true;
			},
			error: function() {
				return false;
			}
		});
	},
	repeatGetWeather: function() {
		setInterval(function() {
			if (app.getWeather(app.wInfo[0], app.wInfo[1], app.wInfo[2])) {
				// if true
				u('weather updated');
			}
		}, 1000 * 60 * 60);
	},
	pullTweet: function(hash) {
		u('PULLING ' + hash);
		twit.stream('statuses/filter', {
			'track': [hash]
		}, function(stream) {
			stream.on('data', function(data) {
				// get the one less than 100 char
				if (data.text.length < 50 && data.lang == 'en' && !data.text.contains('http') && !data.text.contains('@')) {
					// if pool exceeds 10, remove the 1st (shift)
					if (app.tweetPool.length > 9) {
						app.tweetPool.push(data.text);
						app.tweetPool.shift();
						u(data.text + ' replaced 1st');
					} else {
						app.tweetPool.push(data.text);
						u(data.text + ' appending');
					}
				}
			});
		});
	},
	displayTweet: function(hash, second) {
		app.pullTweet(hash);
		setInterval(function() {
			// if(app.readyToSend) {
			if (app.tweetPool.length > 0 && app.readyToSend == true) {
				var tweet = app.tweetPool[rand(app.tweetPool.length)];
				app.write(tweet);
			}
			// }
		}, 1000 * second);
	}
};

/*//=============
	INITIALIZER
=============//*/
app.init();
app.pullTweet('#YOLO');
// app.displayTweet('#YOLO', 2);
// app.repeatGetWeather();