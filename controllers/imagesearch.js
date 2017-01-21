'use strict';

require('dotenv').config();
const express = require('express');
const router = express.Router();
const qs = require('querystring');
const got = require('got');

class GoogleClient {
    constructor(cx, apiKey) {
        this.endpoint = 'https://www.googleapis.com/customsearch/v1?';
        this.apiKey = apiKey;
        this.cx = cx;
    }

    search(query, start) {
        if (!query) {
            throw new TypeError("No query...");
        }

        return got(this.endpoint + this._buildOptions(query, start), {
            json: true
        }).then(this._buildResponse);
    }

    _buildOptions(query, start) {
        var options = {
            q: query,
            searchType: 'image',
            cx: this.cx,
            key: this.apiKey
        };

        if (start) {
            options.start = parseInt(start);
        }

        return qs.stringify(options);
    }

    _buildResponse(res) {
        return (res.body.items || []).map(function(item) {
            return {
                url: item.link,
                alt: item.title,
                pageUrl: item.image.contextLink
            }
        });
    }
}

var googleClient = new GoogleClient(process.env.GOOGLE_CX, process.env.GOOGLE_API_KEY);

function saveHistory(query) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var mongoUrl = process.env.IMAGESEARCH_HISTORY_URI;

    var moment = require('moment');
    var timestamp = moment(new Date()).unix();
    var document = {
        'time': timestamp,
        'what': query
    };
    console.log(document);
    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
            console.log('Database error: ', err);
            document.err = err;
        } else {
            console.log('Connection established.');
            var collection = db.collection('history');

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
        }
    });
}

router.get('/imagesearch/:QUERY', (request, response) => {
    googleClient.search(request.params.QUERY).then((res) => {
        response.set('Content-type', 'application/json');
        response.status(200);
        response.send(res).end();
        saveHistory(request.params.QUERY);
    });
});

router.get('/imagesearch/:QUERY/offset/:OFFSET', (request, response) => {
    googleClient.search(request.params.QUERY, request.params.OFFSET).then((res) => {
        response.set('Content-type', 'application/json');
        response.status(200);
        response.send(res).end();
        saveHistory(request.params.QUERY);
    });
});

router.get('/imagesearch_history', (request, response) => {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var mongoUrl = process.env.IMAGESEARCH_HISTORY_URI;

    MongoClient.connect(mongoUrl, (err, db) => {
        if (err) {
            console.log('Database error: ', err);
            document.err = err;
        } else {
            console.log('Connection established.');
            var collection = db.collection('history');
            collection.find().sort({
                time: -1
            }).limit(10).toArray((err, documents) => {
                response.set('Content-type', 'application/json');
                response.status(200);
                response.send(documents).end();
            });
            db.close();
        }
    });

});

module.exports = router;