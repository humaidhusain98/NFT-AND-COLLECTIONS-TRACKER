const express = require('express');
const router = express.Router();
const rankedObjectSchema = require('../models/topCollectionsSchema');
const { Collection, CollectionNFTs } = require('../models/collectionsSchema');
const { convertETHToUSDOfRankedObject } = require('../adapters/convertEthToUSD');
const { getSingleExchangeCollection, getNFTsOfCollection, getSingleNFT } = require('../dataProviders/blockSpan');
const { processCollectionsObjectBlockspan } = require('../adapters/processCollectionsAdapter');
const { getFloorPrice, getETHToUSDRate } = require('../dataProviders/alchemy');

const CategoryCollections = require('../models/categoryCollectionsSchema');


const getRankDeterminingType = (chain,ranking)=>{
    if(chain=='eth-main'){
        return ranking;
    }
    else if(chain=='poly-main'){
        return ranking+"_poly";
    }
    else{
        return null;
    }
}


// 1
router.post('/getAllTopCollections',async(req,res)=>{

    try{
        if( req.body && req.body.chain && req.body.ranking){
            let {chain, ranking} = req.body;
            let rankDeterminingType = getRankDeterminingType(chain,ranking);
            if(!rankDeterminingType){
                rankDeterminingType='total_volume'; 
            }
            let rankedSavedObj =  await rankedObjectSchema.findOne({rank_determiningType:rankDeterminingType});
            let usdConvertedRankedObject;
            if(req.body.currency=='USD'){
                usdConvertedRankedObject = await convertETHToUSDOfRankedObject(rankedSavedObj);

            }
            res.json(usdConvertedRankedObject?usdConvertedRankedObject:rankedSavedObj)
        }
        else{
            let rankedSavedObj =  await rankedObjectSchema.findOne({rank_determiningType:'total_volume'});
            if(req.body.currency=='USD'){
                usdConvertedRankedObject = await convertETHToUSDOfRankedObject(rankedSavedObj);

            }
            res.json(usdConvertedRankedObject?usdConvertedRankedObject:rankedSavedObj)
        }
       
    }
    catch(e){
        console.log(e);
        res.json({error:""+e})
    }

})



router.post('/getCollectionByKey',async(req,res)=>{
    try{
        let obj;
        if(req.body && req.body.key && req.body.chain){
            obj = await  Collection.findOne({
                blockSpanKey: req.body.key,
                chainType: req.body.chain
            });
            if(!obj){
                console.log('Collection not found in DB for key '+ req.body.key );
                // Check API and automatically add it on db 
                let singleExchangeResp = await getSingleExchangeCollection(req.body.key,req.body.chain,'opensea');
                
                if(singleExchangeResp){
                    // let floorPriceInETH = "null"
                    let floorPriceInETH = await getFloorPrice(singleExchangeResp.contracts[0]?.contract_address,req.body.chain);
                    obj = await processCollectionsObjectBlockspan(singleExchangeResp,req.body.chain=='poly-main'?'poly-main':'eth-main',floorPriceInETH);
                }

                
            }
            res.json(obj);

        }
        else{
            res.status(400).json({error:"Key or Chain Not Present"})
        }
    }
    catch(e){
        res.status(500).json({error: ""+e});
    }
})


router.post('/getNFTsofCollection',async(req,res)=>{
    try{
        const {contract_address,chain,page_size,cursor} = req.body;
        if(!chain || !contract_address){
            res.status(400).json("Chain and Contract Address are required");
        }
         let nftResp = await getNFTsOfCollection(contract_address,chain,null,null,cursor,page_size);
         res.json(nftResp);
        
        }
    catch(e){
        console.log("Error Occured "+e);
        res.json("Error Occured"+e);
    }
})


router.post('/getSingleNFT',async(req,res)=>{
    try{
        const {contract_address,token_id,chain} = req.body;

        if(contract_address && token_id && chain){
            // first fetch CollectionNFTs by chain and contract_address
            const colNFTsObj = await CollectionNFTs.findOne(
                {contractAddress:contract_address,
                chain: chain
            });
            // console.log(colNFTsObj);
             if(colNFTsObj){
                const nftItem = colNFTsObj?.nftCollectionList?.filter((obj)=>obj.nftTokenId==token_id);
                if(nftItem[0]){
                   res.json(nftItem[0]);
                }   
                else{
                   const obj = await getSingleNFT(contract_address,token_id,chain); 
                   const newObj = {
                       nftName: obj?.token_name?obj.token_name: obj.id?obj.id:"null",
                       nftContractAddress: obj?.contract_address?obj.contract_address:"null",
                       nftTokenId:obj?.id?obj.id:"null",
                       nftRarityNumber: obj?.rarity_score?obj.rarity_score:"null",
                       nftRarityRank:obj?.rarity_rank?obj.rarity_rank:"null",
                       nftPrice:"null",
                       nftPriceInUSD:"null",
                       nftLastSale: "null",
                       owners: obj?.total_current_owners?obj.total_current_owners:"null",
                       nftDescription: obj?.token_description?obj.token_description:"null",
                       nftImage: obj?.cached_images?.medium_500_500?obj.cached_images.medium_500_500:obj?.cached_images?.small_250_250?obj.cached_images.small_250_250:obj.cached_images?.tiny_100_100?obj.cached_images.tiny_100_100:obj?.cached_images?.original?obj.cached_images.original:obj?.metadata?.image_url?obj.metadata.image_url:"null",
                       attributes: obj?.metadata?.attributes?obj.metadata.attributes:[],
                       uri: obj?.uri?obj.uri:"null",
                       ipfsImage: obj?.metadata?.image?obj.metadata.image:"null",
                       tokenType: obj?.token_type?obj.token_type:"null",
                       createdDate: obj?.minted_at?obj.minted_at:"null",
                       lastUpdated: obj?.metadata_updated_at?obj.metadata_updated_at:"null",
                   }
   
                   res.json(newObj);
                }

             }
             else{
                console.log('Collection information not found in db');
                res.json(null);
             }
        
        }
        else{
            console.log('contract_address , token_id and chain is required');
            res.status(400).json({message:"contract_address , token_id and chain is required"})
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"" + e})
    }
 
})

router.post('/addCollection',async(req,res)=>{
    try{
       

          const {blockSpanKey,chain,category} = req.body;
          if(  blockSpanKey && chain ){
            let obj;
            let singleExchangeResp = await getSingleExchangeCollection(blockSpanKey,chain,'opensea');
            if(singleExchangeResp){
                // let floorPriceInETH = "null"
                let floorPriceInETH = await getFloorPrice(singleExchangeResp.contracts[0]?.contract_address,req.body.chain);
                obj = await processCollectionsObjectBlockspan(singleExchangeResp,req.body.chain=='poly-main'?'poly-main':'eth-main',floorPriceInETH,category);
                let gamingCollectionObj = await new CategoryCollections({
                    contractAddress: singleExchangeResp.contracts[0]?.contract_address,
                    blockSpanKey:blockSpanKey,
                    name: singleExchangeResp.name,
                    chain:chain,
                    category: category
                })
                let resp = await CategoryCollections.findOne({blockSpanKey: blockSpanKey});
                if(!resp){
                     resp =  await gamingCollectionObj.save();
                }
                res.json({
                    savedCollectionsObject: obj,
                    savedGamingCollectionObject: resp
                });
            }
            else{
                res.status(400).json({message: "Error = Single Exchange Response Null"})
            }
              
          }
          else{
              console.log('contract_address , blockSpanKey , chain and name is required');
              res.status(400).json({message:"blockSpanKey and chain is required"})
          }
    }
    catch(e){
        console.log("Error =" +e);
        res.status(500).json(null);
    }
})


router.post('/getCategoryCollections',async(req,res)=>{
    try{
        let {pageSize, pageNumber ,category} = req.body;
        if(!pageSize){
            pageSize=5;
        }
        if(!pageNumber){
            pageNumber=1
        }
        if(!category){
            category = "GAMING"
        }
        let gamingCollectionResp =await Collection.find({category:category},{name: 1,blockSpanKey: 1,coverImage:1,chainType: 1,floorPrice: 1,averagePrice:1,totalVolume: 1}).limit(pageSize).skip((pageSize * (pageNumber - 1)));
        let USDRateResp =  await getETHToUSDRate();
        let USDRate = USDRateResp.USD;
        let modifiedResp = gamingCollectionResp?.map((obj)=>{
            let newobj = obj?.toObject();

            return {
                ...newobj,
                averagePriceInDollar: (newobj?.averagePrice && USDRate)?newobj.averagePrice*USDRate:null 
            }
        })
        res.json(modifiedResp);
    }
    catch(e){
        console.log(e);
        res.status(500).json({err:"Error ="+e})
    }
})


router.post('/searchCollection', async (req, res) => {
    try {
        const { searchValue } = req.body;
        let { pageSize, pageNumber } = req.body;

        if (!pageSize) pageSize = 5;
        if (!pageNumber) pageNumber = 1;

        if (searchValue && searchValue.length >= 2) {
            let searchList = await Collection.find(
                { name: { $regex: searchValue, $options: 'i' } } 
            )
            .limit(pageSize)
            .skip(pageSize * (pageNumber - 1));

            res.json(searchList); 
        } else {
            res.status(400).json({ err: "Please enter at least 2 characters for suggestions" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ err: "Error =" + e });
    }
});


router.post('/getCarouselCollections',async(req,res)=>{
    try{
        const {searchValue} = req.body;
        let {pageSize, pageNumber } = req.body;
        if(!pageSize){
            pageSize=5;
        }
        if(!pageNumber){
            pageNumber=1
        }
        if(searchValue){
        //    let searchList =await Collection.find({name:{$regex: searchValue,$options:'i'}},{blockSpanKey:1,coverImage:1,name:1,description:1}).limit(pageSize).skip((pageSize * (pageNumber - 1)));

            res.json(searchList);
        }
        else{
            res.status(400).json({err:"searchValue is required"})
        }

    }
    catch(e){
        console.log(e);
        res.status(500).json({err:"Error ="+e})
    }
})


router.post('/addCarouselCollection',async(req,res)=>{
    try{
       

        const {blockSpanKey,chain} = req.body;
        if(  blockSpanKey && chain ){
          let obj;
          let singleExchangeResp = await getSingleExchangeCollection(blockSpanKey,chain,'opensea');
          if(singleExchangeResp){
              // let floorPriceInETH = "null"
              let floorPriceInETH = await getFloorPrice(singleExchangeResp.contracts[0]?.contract_address,req.body.chain);
              obj = await processCollectionsObjectBlockspan(singleExchangeResp,req.body.chain=='poly-main'?'poly-main':'eth-main',floorPriceInETH,"CAROUSEL");
              let carouselCollectionObj = await new CategoryCollections({
                  contractAddress: singleExchangeResp.contracts[0]?.contract_address,
                  blockSpanKey:blockSpanKey,
                  name: singleExchangeResp.name,
                  chain:chain
              })
            //   let resp = await CategoryCollections.findOne({blockSpanKey: blockSpanKey});
            //   if(!resp){
            //        resp =  await gamingCollectionObj.save();
            //   }
              res.json({
                  savedCollectionsObject: obj,
                  savedGamingCollectionObject: null
              });
          }
          else{
              res.status(400).json({message: "Error = Single Exchange Response Null"})
          }
            
        }
        else{
            console.log('contract_address , blockSpanKey , chain and name is required');
            res.status(400).json({message:"contract_address , blockSpanKey , chain and name is required"})
        }
  }
  catch(e){
      console.log("Error =" +e);
      res.status(500).json(null);
  }
})



module.exports = router;