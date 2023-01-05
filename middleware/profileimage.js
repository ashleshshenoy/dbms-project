const fs = require('fs');
const multer =require('multer');
const path = require('path');
const { con } = require('../src/db/db');

const storage = multer.diskStorage({
  destination : (req, file, cb)=>{
    cb(null,"./images")

  },
  filename: (req, file, cb)=>{
    cb(null, "user_profile_"+req.user._id + path.extname(file.originalname))
  }

})

const filter = (req, file, cb)=>{

  const ext = ['.png', '.jpeg', '.jpg'];
  if (file.mimetype != 'image/jpg' || file.mimetype != 'image/jpeg' || file.mimetype != 'image/png') 
    return cb(null, new Error("Invalid image format"));
  
  for (let i = 0; i < ext.length; i++) {
    fs.exists(path.join('./images', 'user_profile_',   req.user._id ,  ext[i]), (e) => {
      if(e) cb(null, new Error(" image already exists"));
    });

  }
    
  cb(null, true);

};

const upload = multer({ storage : storage , fileFilter: filter })

module.exports.upload = upload;