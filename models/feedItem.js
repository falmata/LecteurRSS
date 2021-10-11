const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({

                    title: String,
                    pubDate: String,
                    description: String,
                    link: String,
                    media: {
                        details: {
                            url: String,
                            width: String,
                            height: String
                        }
                    }


});
const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;