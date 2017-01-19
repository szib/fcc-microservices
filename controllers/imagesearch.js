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

router.get('/imagesearch/:QUERY', (request, response) => {
    googleClient.search(request.params.QUERY).then((res) => {
        response.set('Content-type', 'application/json');
        response.status(200);
        response.send(res).end();
    });
});

router.get('/imagesearch/:QUERY/offset/:OFFSET', (request, response) => {
    googleClient.search(request.params.QUERY, request.params.OFFSET).then((res) => {
        response.set('Content-type', 'application/json');
        response.status(200);
        response.send(res).end();
    });
});

module.exports = router;
