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
app.use(require('./controllers/file-metadata'));

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

app.use( (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('dev');
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  console.log('nodev');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
// [END app]

// Listen
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
