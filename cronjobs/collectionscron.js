const cron = require("node-cron"); 
const { getExchangeCollectionsByRanking } = require('../dataProviders/blockSpan');
const { EncloserStart, EncloserEnd } = require("../helpers/constants");
const mongoose = require('mongoose');


const connectMongoDB = ({
    dbName,
    dbConnectionString,
    dbDescription
})=>{
    try {
       
        const db = mongoose.createConnection(dbConnectionString);
        db.once('open', () => {
            console.log(EncloserStart)
          console.log(` Connected to DB: ${dbName}`);
          console.log(` DB Description : ${dbDescription}`)
          console.log(EncloserEnd)
        })
      
      }
      catch (e) {
        console.log("DB Connection error " + e);
      }
      
} 


const runTopCollectionsDataUpdater = async()=>{
    try{
      connectMongoDB({
          dbName:"Staging DB 1",
          dbConnectionString: process.env.MONGODB_URL_DB1,
          dbDescription:`Our DB from official Account.`,
      })
  
       connectMongoDB({
          dbName:"Staging DB 2",
          dbConnectionString: process.env.MONGODB_URL_DB2,
          dbDescription:`Our DB from humdev101 account`
      })
      await getExchangeCollectionsByRanking('eth-main', 'opensea', 'total_volume', 20);
      await getExchangeCollectionsByRanking('poly-main', 'opensea', 'total_volume', 20);
      await getExchangeCollectionsByRanking('eth-main', 'opensea', 'one_day_volume', 20);
      await getExchangeCollectionsByRanking('poly-main', 'opensea', 'one_day_volume', 20);
      await getExchangeCollectionsByRanking('eth-main', 'opensea', 'seven_day_volume', 20);
      await getExchangeCollectionsByRanking('poly-main', 'opensea', 'seven_day_volume', 20);
      await getExchangeCollectionsByRanking('eth-main','opensea','thirty_day_volume',20);
      await getExchangeCollectionsByRanking('poly-main','opensea','thirty_day_volume',20);
      await getExchangeCollectionsByRanking('eth-main','opensea','total_sales',20);
      await getExchangeCollectionsByRanking('poly-main','opensea','total_sales',20);
      await getExchangeCollectionsByRanking('eth-main','opensea','one_day_sales',20);
      await getExchangeCollectionsByRanking('poly-main','opensea','one_day_sales',20);
      await getExchangeCollectionsByRanking('eth-main','opensea','seven_day_sales',20);
      await getExchangeCollectionsByRanking('poly-main','opensea','seven_day_sales',20);
      await getExchangeCollectionsByRanking('eth-main','opensea','thirty_day_sales',20);
      await getExchangeCollectionsByRanking('poly-main','opensea','thirty_day_sales',20);
      await getExchangeCollectionsByRanking('eth-main', 'opensea', 'total_average_price', 20);
      await getExchangeCollectionsByRanking('poly-main', 'opensea', 'total_average_price', 20);
    }
    catch(e){
      console.log("Collections Updater Error "+e);
    }
  
  }


  cron.schedule('0 0 */8 * * *', async function() {
    try{
        console.log(EncloserStart);
        console.log("cron job running every 8 hours for updating nfts"); 
    
        // for(let chainId of chainsList){
        //    await connectToBlockchainThroughProviders(chainId);
        // }
        runTopCollectionsDataUpdater();
    
        console.log(EncloserEnd)
    } 
    catch(e){
        console.log("Error inside cronjob "+e);
    }

}); 
