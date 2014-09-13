
/**
 * Module dependencies.
 */

var express = require('express')
	, http = require('http')
	, https = require('https')
	, path = require('path')
	, mysql = require('mysql');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'admin',
	database : 'accounts'
});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('mysql connected as id ' + connection.threadId);
});

app.get('/', function(req, res) {
	return res.render("index");
});

app.get('/getLocations', function(req, res) {
	
	var val = req.query.q;
	var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+val+
			"&offset=0&components=country:in&types=geocode&key=AIzaSyB2me4z9TltDLyr5StlXjtdbKp0EMhpdtk";
	
	https.get(url, function (response) {
		var buffer = "";
		response.on("data", function (chunk) {
			buffer += chunk;
		});
		response.on("end", function (err) {
			res.json(buffer);
		});
	}).on('error', function (e) {
		res.json(null);
	});
});

//Handle 404
app.use(function(req, res) {
	console.error('Request for '+req.url+' not found!');
	res.send('404: Page not Found', 404);
});

//Handle 500
app.use(function(error, req, res, next) {
	console.error(error.stack);
	res.send('500: Internal Server Error', 500);
});

require("./routes/dealercontroller.js")(app, connection);
require("./routes/manufacturercontroller.js")(app, connection);
require("./routes/transportercontroller.js")(app, connection);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
