import cloudinary from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
cloudinary.config({
  cloud_name: 'ducsskybm',
  api_key: '563696317811346',
  api_secret: 'jEw-p7R1NYbHoMLDGhzuMWiqMS8',
}); 
const uploadController = {
  upload: async (req, res) => {
    new Promise((resolve) => {
      upload(req, res, (err) => {
        if (err) {
          console.log(err);
        }

        return new Promise((resolve) => {
          cloudinary.uploader.upload(
            req.file.path,
            (result) => {
              resolve({
                url: result.url,
                id: result.public_id,
              });
              fs.unlink(req.file.path, () => {});
              return res.ok(result.url, 'image upload successfully.');
            },
            { folder: 'profile' }
          );
        });
      });
    });
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file');
export default uploadController;
