const fs = require('fs');
const multer =require('multer');
const path = require('path');
const { con } = require('../src/db/db');

const storage = multer.diskStorage({
  destination : (req, file, cb)=>{
    cb(null,"./videos")

  },
  filename: (req, file, cb)=>{
    cb(null, "user_"+req.user._id + '_' + Date.now() +  path.extname(file.originalname))

  }

})

const filter = (req, file, cb)=>{

  const ext = ['.mp4', '.mp3'];
  if (file.mimetype != 'image/jpg' || file.mimetype != 'image/jpeg' || file.mimetype != 'image/png') 
    return cb(null, new Error("Invalid image format"));
  
    
  cb(null, true);

};

const upload = multer({ storage : storage  })

module.exports.upload = upload;