const axios = require('axios');
const { getConvertedDataExchangeRankingBlockspan } = require('../adapters/topCollectionsAdapter');
const { processCollectionsObjectBlockspan}= require('../adapters/processCollectionsAdapter'); 

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY':process.env.BLOCKSPAN_API_KEY
}
const rankedObjectSchema = require('../models/topCollectionsSchema');
const { getFloorPrice, getNFTsOfCollectionAlchemy } = require('./alchemy');

const {CollectionNFTs} = require('../models/collectionsSchema');

// get ranking collections by exchange
const getRankDeterminingType = (chain,ranking)=>{
    if(chain=='eth-main'){
        return ranking;
    }
    else if(chain=='poly-main'){
        return ranking+"_poly";
    }
}



const getExchangeCollectionsByRanking = async(
    chain,exchange,ranking,page_size
)=>{
    try{


        console.log('--------------Started Fetching from Blockspan and saving information to db based on '+ranking + " and of chain "+chain +"---------------------");
        const resp = await axios.get(`${process.env.BLOCKSPAN_API_URL}/exchanges/collectionsranking`,
        {  params:{
            chain: chain?chain:'eth-main',
            page_size: page_size?page_size:20,
            exchange: exchange?exchange:'opensea',
            ranking: ranking?ranking:'total_volume'
        },  headers:headers  });

        // console.log(resp.data)
        const processedResp = await getConvertedDataExchangeRankingBlockspan(resp.data.results,chain=='poly-main'?'poly-main':'eth-main');
        // console.log(processedResp);
        let finalProcessedList = [];
        for(let obj of processedResp){
           let singleExchangeResp = await getSingleExchangeCollection(obj.blockSpanKey,chain=='poly-main'?'poly-main':'eth-main','opensea');
           let floorPriceInETH = await getFloorPrice(obj.contracts[0],chain);
           await processCollectionsObjectBlockspan(singleExchangeResp,chain=='poly-main'?'poly-main':'eth-main',floorPriceInETH);
           let newObj = {...obj,
            coverImage: singleExchangeResp.image_url?singleExchangeResp.image_url:"",
            floorPriceInEth: floorPriceInETH?floorPriceInETH:"0",
            topBidInEth:"0",
            noOfOwners: singleExchangeResp?.stats?.num_owners?singleExchangeResp.stats.num_owners:"null",
            supply: singleExchangeResp?.stats?.total_supply?singleExchangeResp.stats.total_supply:"null",
            totalSales: singleExchangeResp?.stats?.total_sales?singleExchangeResp.stats.total_sales:"null",
            averagePrice: singleExchangeResp?.stats?.total_average_price?singleExchangeResp.stats.total_average_price:"null"    
        };
        
            if(newObj.coverImage){
                finalProcessedList.push(newObj);
            }
           
            // console.log(singleExchangeResp);
        }
        let rankDeterminingType = getRankDeterminingType(chain,ranking);
        const rankedObject = {
            rank_determiningType: rankDeterminingType, 
            topCollectionsList: finalProcessedList,
          }
        
          let rankedSavedObj =  await rankedObjectSchema.findOne({rank_determiningType:rankDeterminingType});
          if(!rankedSavedObj){
            console.log('Ranked Object Not Found');
          }
          else{
            rankedSavedObj.set(rankedObject);
            console.log(`Saved Ranked Object based on ${ranking} on chain ${chain}` )
            const saveResp = await rankedSavedObj.save();
            // console.log(saveResp);
            console.log(`Saved Ranked Object based on ${ranking} on chain ${chain}` )

            console.log(`--------------Successfully Completed Saving Top Collections to DB based on ${ranking} and on chain ${chain}------------------`);
          }
          

          

      

    }
    catch(e){
        console.log('Error occured '+e);
        console.log(e.message);
    }
}

// get single exchange collection 
const getSingleExchangeCollection = async(
    key,chain,exchange
) =>{
    try{
        const resp = await axios.get(`${process.env.BLOCKSPAN_API_URL}/exchanges/collections/key/${key}`,{
            params:{
               chain: chain?chain:'eth-main',
               exchange: exchange?exchange:'opensea',
            },
            headers: headers   
           });
            // console.log(resp.data);
           return resp.data;
    }
    catch(e){
        console.log(""+e);
        return null;
    }
  

}   

const getAllCollections = async (chain,token_type,cursor,page_size,history)=>{
    try{
        const resp = await axios.get(`${process.env.BLOCKSPAN_API_URL}/collections`,
        {  params:{
            chain: chain?chain:'eth-main',
            page_size: page_size?page_size:20
        },  headers:headers  });
        console.log(resp.data);
    }
    catch(e){
        console.log(e.message);
    }
}

const getCollectionByContractAddress = async (contract_address,chain) =>{
    try{    
        if(contract_address && chain){

        }
        else{
            console.log('Required Fields missing');
        }
    }
    catch(e){
        console.log(e.message);
    }
}


const getNFTsOfCollection =  async (contract_address,chain,trait_filter,cursor,page_size,key) =>{
    try{    
        if(contract_address && chain ){
            // Fetch DB from contract_address ,chain, key
            console.log("Contract Address " +contract_address);
            console.log("Chain "+ chain);
            const collectionObject = await CollectionNFTs.findOne({
                contractAddress: contract_address,
                chain: chain
            });

            if(collectionObject){
                // return this collection object
                return collectionObject;
            }
            else{

                try{
                    const resp =await axios.get(`${process.env.BLOCKSPAN_API_URL}/nfts/contract/${contract_address}`,{
                        params:{
                            chain:chain?chain:'eth-main',
                            include_current_owners:false,
                            include_recent_price:false,
                            page_size: page_size?page_size:8,
        
                        },
                        headers:headers
                    });
                     
                    
                    console.log("Successfully fetched from API")
                    

                    if(resp.data){
                        let mappedList = resp.data.results.map((obj)=>{
                        
                            return {
    
                                nftName: obj?.token_name?obj.token_name: obj.id?obj.id:"null",
                                nftContractAddress: obj?.contract_address?obj.contract_address:"null",
                                nftTokenId:obj?.id?obj.id:"null",
                                nftRarityNumber: obj?.rarity_score?obj.rarity_score:"null",
                                nftRarityRank:obj?.rarity_rank?obj.rarity_rank:"null",
                                nftPrice:"null",
                                nftPriceInUSD:"null",
                                nftLastSale: "null",
                                owners: (obj && obj.current_owners && obj.current_owners[0] && obj.current_owners[0].address)?obj.current_owners[0].address:"null",
                                nftDescription: obj?.token_description?obj.token_description:"null",
                                nftImage: obj?.cached_images?.medium_500_500?obj.cached_images.medium_500_500:obj?.cached_images?.small_250_250?obj.cached_images.small_250_250:obj.cached_images?.tiny_100_100?obj.cached_images.tiny_100_100:obj?.cached_images?.original?obj.cached_images.original:obj?.metadata?.image_url?obj.metadata.image_url:"null",
                                attributes: obj?.metadata?.attributes?obj.metadata.attributes:[],
                                uri: obj?.uri?obj.uri:"null",
                                ipfsImage: obj?.metadata?.image?obj.metadata.image:"null",
                                tokenType: obj?.token_type?obj.token_type:"null",
                                createdDate: obj?.minted_at?obj.minted_at:"null",
                                lastUpdated: obj?.metadata_updated_at?obj.metadata_updated_at:"null",
                            }
    
                        });
    
                        
                        
                        const CollectionNftObject = {
                            contractAddress: contract_address,
                            key:"-",
                            chain: chain,
                            lastUpdated: new Date().toISOString(),
                            nftCollectionList: mappedList
                        }
    
                        const mongooseObject = new CollectionNFTs(CollectionNftObject);
                        const respObject = await mongooseObject.save();
                        return respObject;          
                    }
                    else{
                        console.log("No Data recieved in Response from Blockspan");
                        return null;
                    }
                    
                }
                catch(e){
                    console.log(e);
                    console.log("Request Failed from Blockspan now trying alchemy");
                    const dataResp = await getNFTsOfCollectionAlchemy(contract_address,chain);
                    const filteredNFTs = dataResp?.nfts?.map((obj)=>{
                        return {
    
                            nftName: obj?.title?obj.title:"null",
                            nftContractAddress: obj?.contract?.address?obj.contract.address:"null",
                            nftTokenId:obj?.id?.tokenId?obj.id.tokenId:"null",
                            nftRarityNumber: "null",
                            nftRarityRank: "null",
                            nftPrice:"null",
                            nftPriceInUSD:"null",
                            nftLastSale: "null",
                            owners: "null",
                            nftDescription: obj?.description?obj.description:"null",
                            nftImage: obj?.media[0]?.thumbnail?obj.media[0].thumbnail:obj?.media[0]?.gateway?obj.media[0].gateway:obj?.metadata.image?obj.metadata.image:"null",
                            attributes: obj?.metadata?.attributes?obj.metadata.attributes:[],
                            uri: obj?.tokenUri?.raw?obj.tokenUri.raw:obj?.tokenUri?.gateway?obj.tokenUri.gateway:"null",
                            ipfsImage: obj?.media[0]?.raw?obj.media[0].raw:"null",
                            tokenType: obj?.contractMetadata.tokenType?obj.contractMetadata.tokenType.toLowerCase():"null",
                            createdDate: "null",
                            lastUpdated: obj?.timeLastUpdated?obj.timeLastUpdated:"null",
                        }
                    });
                    
                    const CollectionNftObject = {
                        contractAddress: contract_address,
                        key:"-",
                        chain: chain,
                        lastUpdated: new Date().toISOString(),
                        nftCollectionList: filteredNFTs
                    }
                    
            
                    const mongooseObject = new CollectionNFTs(CollectionNftObject);
                    const respObject = await mongooseObject.save();
                    return respObject;     
                }

         
             
                return null;
            }
            
            // if not found in db 


            //then fetch from api and then save in db

          
        }
        else{
            console.log('Required Fields missing');
            return null;
        }
    }
    catch(e){
        console.log(""+e)
        return null;
    }
}


const getSingleNFT = async(contract_address,token_id,chain)=>{
    try{
        const resp = await axios.get(`${process.env.BLOCKSPAN_API_URL}/nfts/contract/${contract_address}/token/${token_id}`,{
            params:{
                chain:chain?chain:'eth-main',
            },
            headers:headers
        })
        return resp.data;
    }
    catch(e){
        console.log('Get Single NFT Blockspan Error ' + e);
        return null;
    }
}



module.exports={getAllCollections,getCollectionByContractAddress,getExchangeCollectionsByRanking,getSingleExchangeCollection, getNFTsOfCollection, getSingleNFT}