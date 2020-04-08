var express = require("express");
var app = express();
var request = require('request')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static("public"));

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://doannhatanh:dhoPQ3lemwLNCtvG@cluster0-g513c.mongodb.net/Youtube?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log("Mongodb connected error : " + err)
    } else {
        console.log("Mongodb connected sucessfully")
    }
});

const listener = app.listen(process.env.PORT || 8000, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});


var search = require('./model/channel_request')
var Channel = require('./model/channel')

app.get('/channel', function (req, res) {
    res.render('channel')
})

app.post('/channel', urlencodedParser, function (req, res) {
    var URL = req.body.url
    URL = URL + '/about'
    var information = search(URL)
    res.redirect('/channel/information')
})

app.get('/channel/information', function (req, res) {
    Channel.findOne().sort({ $natural: -1 }).limit(1).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result == null) {
                res.render('channel')
            } else {
                res.render('information', {
                    id: result.Channel_id,
                    img: result.Channel_image,
                    title: result.Channel_title,
                    views: result.Channel_views,
                    public: result.Channel_public,
                    sub: result.Channel_sub
                })
            }
        }
    })
})

app.get('/', function (req, res) {
    res.render("home");
});

app.get('/login', function (req, res) {
    res.render("login");
});

