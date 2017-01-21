var express = require('express');
var path = require('path');
var router = express.Router();
var multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({
    storage: storage
});

router.get('/file-metadata', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '/file-metadata', '/index.html'));
});

router.post('/file-metadata/get-file-size', upload.single('myfile'), (req, res, next) => {
    res.status(200);
    var json = {
        size: req.file.size
    };
    res.set('Content-type', 'application/json');
    res.status(200);
    res.send(json);
});

module.exports = router;
