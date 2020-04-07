const mongoose = require('mongoose')
const channelSchema = new mongoose.Schema({
    Channel_titile: String,
    Channel_id: String,
    Channel_sub: Number,
    Channel_views: Number,
    Channel_public: Date,
    Channel_image: String
}) 

module.exports = mongoose.model("Channel", channelSchema);