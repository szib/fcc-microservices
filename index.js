
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var markdown = require('marked');

markdown.setOptions({
	gfm: false
});

app.set('port', (process.env.PORT || 3000));

app.use(require('./controllers/timestamp'));
app.use(require('./controllers/header_parser'));
app.use(require('./controllers/tinyurl'));
app.use(require('./controllers/imagesearch'));

app.get('/', (req, res) => {
	var mdFile = path.join(__dirname, 'public', 'index.md');
	var index = fs.readFile(mdFile, 'utf8', (err, data) => {
		if (err) {
			return console.log(err);
		} else {
			res.send(markdown(data.toString()));
		}
	})
});

// Listen
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
