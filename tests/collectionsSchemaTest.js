const Collection = require("../models/collectionsSchema");

const addNewCollections = async() =>{
    let objList = new Collection({
        name: "dssfjdskfs",
            category: "asdfdsf",
            blockSpanKey: "fjgbje",
            updatedDate: "2024-09-16",
            contracts: ["contract1", "contract2"],
            chainType: "Ethereum",
            coverImage: "cover.jpg",
            bannerImage: "banner.jpg",
            totalNFTs: "1000",
            createdByAddress: "0x123456789abcdef",
            createdDate: "2024-09-16",
            creatorFee: "5%",
            description: "This is a collection description",
            floorPrice: "0.5 ETH",
            market_cap: "100 ETH",
            one_day_volume: "10 ETH",
            one_day_volume_change_percent: "5%",
            seven_day_volume: "30 ETH",
            seven_day_volume_change_percent: "3%",
            thirty_day_volume: "100 ETH",
            thirty_day_volume_change_percent: "10%",
            numOfOwners: "500",
            supply: "2000",
            royalty: "10%",
            totalSales: "1500",
            averagePrice: "0.75 ETH",
            totalVolume: "500 ETH"

    })
} 

try {
    const savedCollection = await objList.save();
    console.log(savedCollection);
} catch (error) {
    console.log("Error is saving Collection",error);
}

const getAllCollection = async() =>{
    const objectlist = await Collection.find();
    console.log(objectlist);
     
}

const clearCollections = async() =>{
    const clearCollection = await Collection.deleteMany();
    console.log(clearCollection);
    
}

module.exports = {addNewCollections,getAllCollection,clearCollections};