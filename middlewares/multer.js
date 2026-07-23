import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {//req comes from client,file comes here messy unorganized file or photos etc,multer organizes then it seaves it to req.file=file,cb is multers callback function takes error and value,if no error then gives null and proceed to save the file to your given destination  
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({storage });