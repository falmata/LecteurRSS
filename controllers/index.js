const mongoose = require("mongoose");
let path = require('path');
global.SERVER_ROOT_PATH = path.resolve(__dirname);
let parameters = require(SERVER_ROOT_PATH + '/../config/config');
const Feed = require('../models/feeds');
const formatxmltojson = require('../services/index')
let dbParams = parameters.db;
var urlfeed = 'https://www.lemonde.fr/rss/en_continu.xml';

//db Connection
mongoose.connect(dbParams.url, dbParams.options, err => {
    if(err) throw err;
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


async function getItems(req,res) {
    var feedsarray=[];
    await formatxmltojson.xmlToJson(urlfeed, async function (err, data) {
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
    await formatxmltojson.xmlToJson(urlfeed, async function (err, data) {
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