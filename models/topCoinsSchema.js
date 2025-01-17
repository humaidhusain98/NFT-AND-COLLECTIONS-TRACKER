const mongoose = require('mongoose');
const db = mongoose.createConnection(process.env.MONGODB_URL_DB1+"coins");
const coinsSchema = new mongoose.Schema({
    name:{
        type:String,
        unique: false,
        required: true,
    },
    symbol:{
        type:String,
        unique: true,
        required: true,
    },
    price:{
        type:String,
        unique: false,
        required: true,
    },
    coinImage:{
        type: String,
        required: true
    }
    
}
)

const topCoinsSchema =new mongoose.Schema(
    {
        rank_determiningType: {
            type: String,
            required: true,
            unique: true
        }, 
        topCoinsList: {
            type:[coinsSchema],
            required:true,
            unique: false
        },
    },
    {
        timestamps: true
    }
);

const coinsGraphPoint = new mongoose.Schema(
        {
        coinPriceInUSDT:{
            type: Number,
            required: true,
        },
        date:{
            type: String,
            required: true
        }
    }
)

const coinsGraphChartSchema = new mongoose.Schema(
    {
        timeFrame:{
            type: String,
            required: true
        },
        coinSymbol:{
            type: String,
            required: true
        },
        plotList:{
            type: [coinsGraphPoint],
            required: true,
            default: []
        }
    },
    {
        timestamps: true
    }
)
// https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints
// https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=15m&limit=96
const CoinsModel = db.model('coins', coinsSchema);
const TopCoinsSchema = db.model('topcoins',topCoinsSchema);
const CoinGraphSchema = db.model('coingraphs',coinsGraphChartSchema);
module.exports = {CoinsModel, TopCoinsSchema, CoinGraphSchema};