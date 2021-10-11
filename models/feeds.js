const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({

            created_at: Date,
            title: String,
            description: String,
            copyright: String,
            link: String,
            pubDate: String,
            language: String


});
const Feed = mongoose.model("Feed", FeedSchema);

module.exports = Feed;