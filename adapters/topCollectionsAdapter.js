const {getSingleExchangeCollection} = require('../dataProviders/blockSpan')
const axios = require('axios');
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY':process.env.BLOCKSPAN_API_KEY
}
const rankedObjectSchema = require('../models/topCollectionsSchema');



const getConvertedDataExchangeRankingBlockspan = async (data,chainType)=>{
    try{    
        let topCollectionsList =[];
        if(data && Array.isArray(data)){
            let counter =1;
            for(let obj of data){
                let schemaObj = {
                    rank: counter,
                    blockSpanKey:obj.key?obj.key:"",
                    name: obj.name?obj.name:"",
                    contracts: Array.isArray(obj.contracts)?obj.contracts.map((obj)=>obj.contract_address):[],
                    chainType: chainType,
                    coverImage: "",
                    floorPriceInEth: "",
                    topBidInEth:"",
                    noOfOwners:"",
                    oneDayVolumeEth: obj.one_day_volume?obj.one_day_volume:"",
                    oneDayVolumeChangePercent: (obj.one_day_volume && obj.total_volume)?((obj.one_day_volume/obj.total_volume)*100):"",
                    sevenDayVolumeEth:obj.seven_day_volume?obj.seven_day_volume:"",
                    sevenDayVolumeChangePercent:(obj.seven_day_volume && obj.total_volume)?((obj.seven_day_volume/obj.total_volume)*100):"",
                    supply:""
                }
                counter = counter+1;
            

                topCollectionsList.push(schemaObj);

            }

            // const respSingleColl = await  getSingleExchangeCollection('parallelalpha','eth-main','opensea');
            // console.log(respSingleColl);

            // console.log(topCollectionsList);
            return topCollectionsList;
        }
        else{
            console.log('Insufficient Data Provided');
            return null;
        }
    }
    catch(e){
        console.log(e);
        return null;
    }
}






const processTopCollectionsDataToDbFormat = async(
    chain,exchange,ranking,page_size
)=>{
    try{


        console.log('--------------Started Fetching from Blockspan and saving information to db ------------------');


        const resp = await axios.get(`${process.env.BLOCKSPAN_API_URL}/exchanges/collectionsranking`,
        {  params:{
            chain: chain?chain:'eth-main',
            page_size: page_size?page_size:20,
            exchange: exchange?exchange:'opensea',
            ranking: ranking?ranking:'total_volume'
        },  headers:headers  });
        const processedResp = await getConvertedDataExchangeRankingBlockspan(resp.data.results,"eth_main");
        // console.log(processedResp);
        let finalProcessedList = [];
        for(let obj of processedResp){
           let singleExchangeResp = await getSingleExchangeCollection(obj.blockSpanKey,'eth-main','opensea');
           let newObj = {...obj,
            coverImage: singleExchangeResp.image_url?singleExchangeResp.image_url:"0",
            floorPriceInEth: singleExchangeResp?.stats?.floorPrice?singleExchangeResp.stats.floorPrice:"0",
            topBidInEth:"0",
            noOfOwners: singleExchangeResp?.stats?.num_owners?singleExchangeResp.stats.num_owners:"0",
            supply: singleExchangeResp?.stats?.total_supply?singleExchangeResp.stats.total_supply:"0",
            };

            

            finalProcessedList.push(newObj);
        }   
     
        const rankedObject = {
            rank_determiningType: 'total_volume', 
            topCollectionsList: finalProcessedList,
          }
         
          let rankedSavedObj =  await rankedObjectSchema.findOne({rank_determiningType:'total_volume'});
        //   console.log(rankedSavedObj);
          rankedSavedObj.set(rankedObject);
          const saveResp = await rankedSavedObj.save();
        // console.log(saveResp);

        console.log('--------------Successfully Completed Saving Top Collections to DB------------------');

          

      

    }
    catch(e){
        console.log('Error occured');
        console.log(e.message);
    }
}


module.exports={getConvertedDataExchangeRankingBlockspan,processTopCollectionsDataToDbFormat};