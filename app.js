require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require('express')
const nftAndCollectionsRoute = require('./routes/nftApiRoute');
const app = express()


const connectMongoDB = ({
    dbName,
    dbConnectionString,
    dbDescription
})=>{
    try {
        const db = mongoose.createConnection(dbConnectionString);
        db.once('open', () => {
          console.log(` Connected to DB: ${dbName}`);
          console.log(` DB Description : ${dbDescription}`)
        })
      
      }
      catch (e) {
        console.log("DB Connection error " + e);
      }
      
} 
// midlewares application
// cors to allow only whitelisted urls to pass through
app.use(cors({
    origin:[
        process.env.ORIGIN
    ]
}));
connectMongoDB({
    dbName:"NFT and Collections Tracker DB",
    dbConnectionString: process.env.MONGODB_URL_DB,
    dbDescription:`This DB stores nft and collections live prices and data like images, metadata, contract address , tokenid etc.`,
})

app.use("/v1/nftandColTracker",nftAndCollectionsRoute);
app.listen(process.env.port, () => {
    console.log(` server running on ${process.env.port}`)

})
