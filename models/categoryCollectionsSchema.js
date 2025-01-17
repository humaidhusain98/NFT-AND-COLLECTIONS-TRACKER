const mongoose = require('mongoose');
const db = mongoose.createConnection(process.env.MONGODB_URL_DB1+"marketplace");
const getCategoryCollectionsSchema = new mongoose.Schema({
    contractAddress:{
        type: String,
        required: true
    },
    blockSpanKey:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    chain:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    }

})

module.exports= CategoryCollections = db.model('categorycollection',getCategoryCollectionsSchema);
