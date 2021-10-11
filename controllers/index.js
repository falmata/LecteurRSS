const mongoose = require("mongoose");
const uri = "mongodb+srv://feedUser:Feed2021@cluster0.ljjv5.mongodb.net/feed?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}, err => {
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

var parseString = require('xml2js').parseString;
var https = require('https');
const Feed = require("../models/feeds");
var urlfeed = 'https://www.lemonde.fr/rss/en_continu.xml';

async function xmlToJson(url, callback) {
    var req = https.get(url, function(res) {
        var xml = '';

        res.on('data', function(chunk) {
            xml += chunk;
        });

        res.on('error', function(e) {
            callback(e, null);
        });

        res.on('timeout', function(e) {
            callback(e, null);
        });

        res.on('end', function() {
            parseString(xml, function(err, result) {
                callback(null, result);
            });
        });
    });
}

async function getItems(req,res) {
    var feedsarray=[];
    await xmlToJson(urlfeed, async function (err, data) {
        data.rss.channel[0].item.forEach(element => {
            let item={
                "title": element.title[0],
                "pubDate": element.pubDate[0],
                "description": element.description[0],
                "link": element.link[0],
                "media": {
                    "details": {
                        "url": element['media:content'][0].$.url,
                        "width":element['media:content'][0].$.width ,
                        "height": element['media:content'][0].$.height
                    }
                }
            }
            feedsarray.push(item);
        });
        res.send(feedsarray);
    });
}

async function getFeed (req,res){
    let feed={};
    await xmlToJson(urlfeed, async function (err, data) {
        feed = {
            "title": data.rss.channel[0].title[0],
            "description": data.rss.channel[0].description[0],
            "copyright": data.rss.channel[0].copyright[0],
            "link": data.rss.channel[0].link[0],
            "pubDate": data.rss.channel[0].pubDate[0],
            "language": data.rss.channel[0].language[0],
        }
        let feedInstanciation;
        feedInstanciation = await Feed.findOne({link: feed.link})
        if(!feedInstanciation){
            feedInstanciation=new Feed(feed)
            feedInstanciation.save();
        }
        res.send(feedInstanciation);
    });

}

async function updateChannel (req,res){
    let feedInstanciation = await Feed.findOne({_id: req.body._id})

    if(feedInstanciation){
        if(req.body.title){
            feedInstanciation.title=req.body.title;
        }
        if(req.body.description){
            feedInstanciation.description=req.body.description;
        }
        await feedInstanciation.save()
    }
   res.send("success");
}

/*async function updateChannelDescription (req,res){
    let feedInstanciation = await Feed.findOne({_id: req.params.id})
    if(feedInstanciation){
        feedInstanciation.description=req.params.description;
        await feedInstanciation.save()
    }
    res.send(feedInstanciation);
}*/






module.exports = {
    getFeed,
    getItems,
    updateChannel

};