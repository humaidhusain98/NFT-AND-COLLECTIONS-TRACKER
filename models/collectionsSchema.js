const mongoose = require('mongoose');
require('dotenv').config();

const db = mongoose.createConnection(process.env.MONGODB_URL_DB1+"marketplace");

const socialLinksSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: false
    },
    link:{
        type:String,
        required: true,
        unique: false
    }
})

const attributesSchema = new mongoose.Schema({
    value: {
        type: String,
        required: false,
        unique: false
    },
    trait_type:{
        type: String,
        required: false,
        unique: false
    }
})


const nftSchema = new mongoose.Schema({

    nftName:{
        type: String,
        required: true,
        unique: false
    },

      nftContractAddress:{
        type: String,
        required: true,
        unique: false
    },
      nftTokenId:{
        type: String,
        required: true,
        unique: false
    },
      nftRarityNumber:{
        type: String,
        required: true,
        unique: false
    },

    nftRarityRank:{
        type: String,
        required: true,
        unique: false
    },
    
      nftPrice:{
        type: String,
        required: true,
        unique: false
    },
    nftPriceInUSD:{
        type: String,
        required: true,
        unique: false
    }
    ,
      nftLastSale:{
        type: String,
        required: true,
        unique: false
    },
      owners:{
        type: String,
        required: true,
        unique: false
    },
      nftDescription:{
        type: String,
        required: true,
        unique: false
    },
      nftImage:[{
        type: String,
        required: true,
        unique: false
    }],
    attributes: {
        type: [attributesSchema],
        required: false,
        unique:false
    },
    uri: {
        type: String,
        required: true,
        unique: false
    },
    ipfsImage:  {
        type: String,
        required: true,
        unique: false
    },
    tokenType: {
        type: String,
        required: true,
        unique: false
    },
    createdDate: {
        type: String,
        required: true,
        unique: false
    },
    lastUpdated: {
        type: String,
        required: true,
        unique: false
    }


})

const collectionNFTsByAddressSchema = new mongoose.Schema({
    contractAddress: {
        type:String,
        required: true,
        unique: false
    },
    key:{
        type: String,
        required: true,
        unique: false
    },
    chain:{
        type: String,
        required: true,
        unique: false
    },

    lastUpdated:{
        type: String,
        required: true,
        unique: false
    }
    ,

    nftCollectionList: {
        type: [nftSchema],
        required: true,
        unique: false
    }
});

const collectionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: false
    },

    category:{
        type: String,
        required: false,
        unique: false
    },

    blockSpanKey:{
        type: String,
        required: true,
        unique: false
    },
    updatedDate:{
        type: String,
        required: true,
        unique: false
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
    bannerImage: {
        type: String,
        required: true,
        unique: false

    },
    totalNFTs: {
        type: String,
        required: true,
        unique: false

    },

    createdByAddress: {
        type: String,
        required: true,
        unique: false

    },

    createdDate: {
        type: String,
        required: true,
        unique: false

    },
    creatorFee: {
        type: String,
        required: true,
        unique: false

    },

    description: {
        type: String,
        required: true,
        unique: false

    },

    socialLinks: {
        type: [socialLinksSchema],
        required: false,
        unique: false

    },


    floorPrice: {
        type: String,
        required: true,
        unique: false

    },

    market_cap: {
        type: String,
        required: true,
        unique: false

    },



    one_day_volume: {
        type: String,
        required: true,
        unique: false

    },

    one_day_volume_change_percent:{
        type: String,
        required: true,
        unique: false
    },


    seven_day_volume: {
        type: String,
        required: true,
        unique: false

    },

    seven_day_volume_change_percent:{
        type: String,
        required: true,
        unique: false
    },

    thirty_day_volume: {
        type: String,
        required: true,
        unique: false

    },

    thirty_day_volume_change_percent:{
        type: String,
        required: true,
        unique: false
    },

    numOfOwners: {
        type: String,
        required: true,
        unique: false

    },

    supply:{
        type: String,
        required: true,
        unique: false
    },

    royalty:{
        type: String,
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
    },
    totalVolume:{
        type:String,
        required: true,
        unique: false
    }

})

const Collection = db.model('collection',collectionSchema);
const CollectionNFTs = db.model('collectionnft',collectionNFTsByAddressSchema);
const Nft = db.model('nft',nftSchema);

module.exports = {
    Collection,
    Nft,
    CollectionNFTs
}