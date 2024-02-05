const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const path = require("path");


const customError = require("../errors");
const cloudinary = require("cloudinary").v2

const uploadProductImageLocal = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError("No file uploaded");
  }
  let productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new customError.BadRequestError("Please upload an image");
  }

  const maxSize = 1024 * 1024
  if(productImage.size > maxSize){
    throw new customError.BadRequestError("Please upload an image less than 1KB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async(req,res)=> {
     console.log(req.files.image.tempFilePath)
     try{
    let  result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
        use_filename:true,
        folder:'file-upload',
    })
    res.status(StatusCodes.OK).json({image:{src: result.secure_url}})
}catch(error){
    console.log(error);
}
    
}

module.exports = {
  uploadProductImage,
};
