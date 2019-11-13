const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
let isCompatible = true;
const port = process.env.PORT || 8888;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

const multerConfig = {

    //where the files will be stored
    storage: multer.diskStorage({

        //set storage destination
        destination: function(req, file, next) {
            next(null, './public/storage');
        },

        filename: function(req, file, next) {
            console.log(file);
            //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.' + ext);
        }
    }),

    // Filter files types
    fileFilter: function(req, file, next) {
        // Output log msgs
        const image = file.mimetype.startsWith('image/');
        if (image) {
            isCompatible = true;
            console.log('photo uploaded');
            next(null, true);
        } else {
            isCompatible = false;
            console.log("file not supported")
            return next();
        }
    }
};

// Website readouts
app.get('/', function(req, res) {
    res.render('index.html');
});

app.post('/upload', multer(multerConfig).single('photo'), function(req, res) {
        if (isCompatible == true) {
            res.send('Complete! Check out your storage folder. <a href="index.html">Try again</a>');
        } else {
            res.send('Error! This file type is not supported. <a href="index.html">Please try again</a>');
        }
    }

);

// Local server connection
app.listen(port, function() {
    console.log(`Server listening on port ${port}`);
});