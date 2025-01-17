const { getETHToUSDRate } = require("../dataProviders/alchemy")

const convertETHToUSDOfRankedObject = async(rankedObject)=>{
    try{
       let resp =  await getETHToUSDRate();
       let USDRate = resp.USD;
       let newRankedObject = {
        rank_determiningType: rankedObject.rank_determiningType,
        topCollectionsList: []
       };
       let processedList = [];
       let usdConvertedObjectList = rankedObject.topCollectionsList;
       for(let obj of usdConvertedObjectList){
        let newObj = {
            "rank": obj.rank,
            "blockSpanKey": obj.blockSpanKey,
            "name": obj.name,
            "contracts": obj.contracts,
            "chainType": obj.chainType,
            "coverImage": obj.coverImage,
            "noOfOwners": obj.noOfOwners,
            "oneDayVolumeChangePercent": obj.oneDayVolumeChangePercent,
            "sevenDayVolumeChangePercent": obj.sevenDayVolumeChangePercent,
            "supply": obj.supply,
            "_id": obj._id,
            floorPriceInUSD: (obj?.floorPriceInEth && USDRate)?obj.floorPriceInEth*USDRate+"":"null",
            topBidInUSD : (obj?.topBidInEth && USDRate)?obj.topBidInEth*USDRate+"":"null",
            oneDayVolumeUSD : (obj?.oneDayVolumeEth && USDRate)?obj.oneDayVolumeEth*USDRate+"":"null",
            sevenDayVolumeUSD : (obj?.sevenDayVolumeEth && USDRate)?obj.sevenDayVolumeEth*USDRate+"":"null",
            averagePriceUSD: (obj?.averagePrice && USDRate)?obj.averagePrice*USDRate+"":"null"
        }
        processedList.push(newObj);
   
    }
        newRankedObject.topCollectionsList = processedList;
        return newRankedObject;

    }
    catch(e){
        console.log("Error Occured ="+e);
        return null;
    }
}


module.exports = {convertETHToUSDOfRankedObject};