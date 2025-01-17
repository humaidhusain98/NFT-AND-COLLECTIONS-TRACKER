const mongoose = require('mongoose');
const db = mongoose.createConnection(process.env.MONGODB_URL_DB1+"marketplace");
const topCollectionsSchema = new mongoose.Schema({
    
    rank:{
        type:Number,
        unique: false,
        required: true,
    },

    blockSpanKey:{
        type:String,
        unique: false,
        required: true,
    },

    name:{
        type: String,
        unique: false,
        required: true
    },

    contracts:{
        type: [String],
        required:true
    },

    chainType:{
        type:String,
        required: true,
        unique: false
    } ,
    coverImage: {
        type: String,
        required: true,
        unique: false

    },
    floorPriceInEth:{
        type: String,
        required: true,
        unique: false
    },
    topBidInEth:{
        type: String,
        required: true,
        unique: false
    },
    noOfOwners: {
        type: String,
        required: true,
        unique: false
    },
    oneDayVolumeEth:{
        type:String,
        required: true,
        unique: false

    },
    oneDayVolumeChangePercent:{
        type:String,
        required: true,
        unique: false
    },
    sevenDayVolumeEth:{
        type:String,
        required: true,
        unique: false
    },
    sevenDayVolumeEth:{
        type:String,
        required: true,
        unique: false
    },
    sevenDayVolumeChangePercent:{
        type:String,
        required: true,
        unique: false
    },
    supply:{
        type:String,
        required: true,
        unique: false
    },
    totalSales:{
        type:String,
        required: true,
        unique: false
    },
    averagePrice:{
        type:String,
        required: true,
        unique: false
    }


})


const rankedObjectSchema =new mongoose.Schema(
    {
        rank_determiningType: {
            type: String,
            required: true,
            unique: true
        }, 
        topCollectionsList: {
            type:[topCollectionsSchema],
            required:true,
            unique: false
        },
    }
);

module.exports = TopCollections = db.model('topCollections', rankedObjectSchema);