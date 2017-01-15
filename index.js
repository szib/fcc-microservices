var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(require('./controllers/timestamp'));
app.use(require('./controllers/header_parser'));

// Listen
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
