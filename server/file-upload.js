const aws = require('aws-sdk')
    , multer = require('multer')
    , multerS3 = require('multer-s3')
    , { key, access, bucketName } = require('./server-config')

aws.config.update({
    secretAccessKey: access,
    accessKeyId: key,
    region: 'us-west-1' //E.g us-east-1
});

const s3 = new aws.S3();

/* In case you want to validate your file type */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Wrong file type, only upload JPEG and/or PNG !'),
            false);
    }
};

const upload = multer({
    fileFilter: fileFilter,
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: bucketName,
        key: function (req, file, cb) {
            req.file = req.params.id;
            cb(null, req.params.id);
        }
    })
});

module.exports = upload;