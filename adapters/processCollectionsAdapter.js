const {Collection} = require('../models/collectionsSchema');


const processCollectionsObjectBlockspan = async(blockspanObject,chainType,floorPriceInEth,category)=>{
    let collectionsSchema,obj;
    try{    
        // console.log(blockspanObject);
        collectionsSchema =  {
            blockSpanKey:blockspanObject.key?blockspanObject.key:"",
            contracts:Array.isArray(blockspanObject.contracts)?blockspanObject.contracts.map((obj)=>obj.contract_address):[],
            name: blockspanObject?.name?blockspanObject.name:"null",
            category: category?category:"unknown",
            updatedDate:new Date().toString(),
            chainType:chainType,
            coverImage: blockspanObject?.image_url?blockspanObject.image_url:"null",
            bannerImage:blockspanObject?.banner_image_url?blockspanObject.banner_image_url:"null",
            totalNFTs: blockspanObject?.stats?.total_supply?blockspanObject.stats.total_supply:'null',
            createdByAddress:"null",
            createdDate:"null",
            creatorFee:"null",
            description:blockspanObject?.description?blockspanObject.description:"null",
            market_cap: blockspanObject?.stats?.market_cap?blockspanObject.stats.market_cap:'null',
            socialLinks:[
               {
                name: 'Discord',
                link:blockspanObject?.discord_url?blockspanObject.discord_url:"null"
               },
              {
                name:"Twitter",
                link:blockspanObject?.twitter_username?`https://twitter.com/${blockspanObject.twitter_username}`:"null",
              },
              {
                name:"Instagram",
                link: blockspanObject?.instagram_username?`https://www.instagram.com/${blockspanObject.instagram_username}`:"null",
              },
              {
                name:"Opensea",
                link: blockspanObject?.exchange_url?blockspanObject.exchange_url:"null"
              }

            ],
            floorPrice:floorPriceInEth?floorPriceInEth:"null",
            one_day_volume:blockspanObject?.stats?.one_day_volume?blockspanObject.stats.one_day_volume:"null",
            one_day_volume_change_percent:(blockspanObject?.stats?.one_day_volume && blockspanObject?.stats?.one_day_volume_change )?((blockspanObject.stats.one_day_volume_change)*100/blockspanObject.stats.one_day_volume):"null",
           
            seven_day_volume:blockspanObject?.stats?.seven_day_volume?blockspanObject.stats.seven_day_volume:"null",
            seven_day_volume_change_percent:(blockspanObject?.stats?.seven_day_volume && blockspanObject?.stats?.seven_day_volume_change )?((blockspanObject.stats.seven_day_volume_change)*100/blockspanObject.stats.seven_day_volume):"null",
            thirty_day_volume:blockspanObject?.stats?.thirty_day_volume?blockspanObject.stats.thirty_day_volume:"null",
            thirty_day_volume_change_percent:(blockspanObject?.stats?.thirty_day_volume && blockspanObject?.stats?.thirty_day_volume_change )?(blockspanObject.stats.thirty_day_volume_change)*100/(blockspanObject.stats.thirty_day_volume):"null",
            numOfOwners:blockspanObject?.stats?.num_owners?blockspanObject.stats.num_owners:"null",
            supply:blockspanObject?.stats?.total_supply?blockspanObject.stats.total_supply:"null",
            royalty:"null",
            totalSales: blockspanObject?.stats?.total_sales?blockspanObject.stats.total_sales:"null",
            averagePrice: blockspanObject?.stats?.total_average_price?blockspanObject.stats.total_average_price:"null",
            totalVolume: blockspanObject?.stats?.total_volume?blockspanObject.stats.total_volume:"null"
          }
          try{
           let colObj = await Collection.findOne({blockSpanKey: blockspanObject.key,chainType:chainType});
          //  console.log(colObj);
           if(!colObj){
            console.log("Adding new collection "+blockspanObject.key);
            obj = new Collection(collectionsSchema);
            await obj.save();
            return collectionsSchema;
            // console.log(obj);
           }
           else{
            console.log('Updating Collection '+ blockspanObject.key)
            const resp= await Collection.updateOne({blockSpanKey: blockspanObject.key,chainType:chainType},collectionsSchema);
            return collectionsSchema;
           }

          
          }
          catch(err){
            console.log(err);
            if(err.code==11000){
      
            }
            return null;
          }



    }
    catch(e){
      console.log('Outside Loop Error' +e);
      return null;
    }
}


module.exports={processCollectionsObjectBlockspan};