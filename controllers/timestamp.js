var express = require('express');
var router = express.Router();

router.get('/timestamp/:TIME', function(req, res) {
	var json = {};
	json.unix = null;
	json.natural = null;

	var moment = require('moment');

	var ts = moment.unix(parseInt(req.params.TIME));	
	if (ts.isValid()) {
		json.unix = parseInt(req.params.TIME);
		json.natural = moment(ts).format('MMMM D, YYYY');
	} else {
		ts = moment(req.params.TIME, 'MMMM D, YYYY');
		if (ts.isValid()) {
			json.unix = ts.unix();
			json.natural = req.params.TIME;
		}
	}

	res.set('Content-type', 'application/json');
	res.status(200);
	res.send(json).end();
});

module.exports = router;
