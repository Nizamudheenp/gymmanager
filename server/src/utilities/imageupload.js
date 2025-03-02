const cloudinary = require('../config/cloudinary')

const uploadCloudinary = (filepath)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(
            filepath,
            {folder:'images'},
            (error,result)=>{
                if(error){
                    return reject(error)
                }
                resolve(result.secure_url)
            }
        )
    })
}
module.exports = uploadCloudinary