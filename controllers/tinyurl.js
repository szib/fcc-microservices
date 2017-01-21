var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.URLSHORTENER_URI;

var md5 = require('md5');

function insertURL(req, res, protocol) {
    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
            console.log('Database error: ', err);
            document.err = err;
        } else {
            console.log('Connection established.');
            var collection = db.collection('urls');

            var url = protocol + req.params.URL;

            if (url.match(/^(http[s]?:\/\/){1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,6}[\.]{0,1}($|[\/]{1}$|\/.+$)/gi)) {
                var document = {
                    url: url,
                    id: md5(url)
                };
                collection.insert(document, (err, result) => {
                    if (err) {
                        console.log("Insert error: ", err);
                        document = {};
                        document.err = err;
                    } else {
                        console.log('Document has been inserted.')
                    }
                    db.close();
                });
            } else {
                console.log("Invalid URL");
                document = {};
                document.err = "Invalid URL";
            }
            res.set('Content-type', 'application/json');
            res.status(200);
            res.send(document).end();
        }
    });
}

router.get('/tinyurl/new/http://:URL', (req, res) => {
    insertURL(req, res, "http://");
});
router.get('/tinyurl/new/https://:URL', (req, res) => {
    insertURL(req, res, "https://");
});

router.get('/tinyurl/new/*', (req, res) => {
    res.set('Content-type', 'application/json');
    res.status(200);
    res.send({
        err: "Invalid URL"
    }).end();
})


router.get('/tinyurl/:ID', (req, res) => {

    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
            console.log('Database error: ', err);
        } else {
            console.log('Connection established.');
            var collection = db.collection('urls');
            var id = {};
            id.id = req.params.ID;

            collection.find(id).toArray((err, result) => {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    res.set('Location', result[0].url);
                    res.status(301);
                    res.end();
                } else {
                    console.log('No docements found.')
                }
                db.close();
            });

        }
    });
});

module.exports = router;