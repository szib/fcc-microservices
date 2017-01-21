var express = require('express');
var router = express.Router();

router.get('/header_parser', function(req, res) {
    var json = {};
    var headers = req.headers;

    var ip = req.headers['x-forwarded-for'];
    if (ip) {
        ips = ip.split(",");
        json.ipaddress = ips[ips.length - 1];
    } else {
        json.ipaddress = req.connection.remoteAddress;
    }

    json.software = headers['user-agent'].match(/\(.+?\)/)[0].replace(/\(/, "").replace(/\)/, "");
    json.language = headers['accept-language'].split(",")[0];

    res.set('Content-type', 'application/json');
    res.status(200);
    res.send(json).end;
});

module.exports = router;