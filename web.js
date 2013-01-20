var express = require('express');
var util    = require('util');

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'asdf32sd12w' })
);

app.use('/data',express.static(__dirname + '/data'));
app.use('/images',express.static(__dirname + '/images'));
app.use('/scripts',express.static(__dirname + '/scripts'));
app.use('/vendor',express.static(__dirname + '/scripts/vendor'));
app.use('/styles',express.static(__dirname + '/styles'));

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

function render_page(req, res) {
  res.sendfile(__dirname + '/index.html');
}

function handle_request(req, res) {
    render_page(req, res);
}

app.get('/', handle_request);
app.post('/', handle_request);
