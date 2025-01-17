const axios = require('axios');

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY':process.env.BLOCKSPAN_API_KEY
}

const getFloorPrice = async(contract_address,chain) =>{

    try{
        let url = chain=='poly-main'?process.env.ALCHEMY_POLY_URL:process.env.ALCHEMY_ETH_URL;
        if(chain=='eth-main'){
            const resp = await axios.get(`${url}/getFloorPrice?contractAddress=${contract_address}`);
            // console.log(resp.data);
            // console.log(resp.data.openSea.floorPrice);
            return resp.data.openSea.floorPrice;
        }
        else{
            return "null";
        }
   
    }
    catch(e){
       
        console.log("Floor Price Request failed "+e.response.data);
        return null;
    }
}

const getETHToUSDRate = async ()=>{
    try{
        const resp = await axios.get(`${process.env.CRYPTOCOMPARE_ETHUSD_URL}`);
        return resp.data;
    }
    catch(e){
        console.log(e);
        return null;
    }
    
}


const getNFTsOfCollectionAlchemy = async(contract_address,chain)=>{
    try{
        if(contract_address && chain){
            
            let url = chain=='poly-main'?process.env.ALCHEMY_POLY_URL:process.env.ALCHEMY_ETH_URL;
            const resp = await axios.get(`${url}/getNFTsForCollection?contractAddress=${contract_address}&withMetadata=true&limit=8`);
            // console.log(resp.data);
            return resp.data;
            // console.log(resp.data.openSea.floorPrice);
            
        }
        else{
            console.log('Required Params Missing');
            return null;
        }
      
    
   
    }
    catch(e){
       
        console.log("Floor Price Request failed "+e.response.data);
        return null;
    }
}

module.exports={getFloorPrice,getETHToUSDRate,getNFTsOfCollectionAlchemy}