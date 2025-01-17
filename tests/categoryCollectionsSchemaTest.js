const CategoryCollections = require('../models/categoryCollectionsSchema');

const addCategoryCollection = async()=>{
    let obj = new CategoryCollections({
        contractAddress:"3dfdsf54ydrgdfgdrgdf",
        blockSpanKey:"test",
        name:"test",
        chain:"eth-main"
    });
    await obj.save();
    console.log(obj);
}

const getAllCategoryCollection = async()=>{
    const objectlist = await CategoryCollections.find();
    console.log(objectlist);
}

const clearCategoryCollection = async()=>{
    const clearResp = await  CategoryCollections.deleteMany();
    console.log(clearResp);
}


module.exports={addCategoryCollection,getAllCategoryCollection,clearCategoryCollection};