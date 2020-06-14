const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const keys = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin')

const s3 = new AWS.S3({
    accessKeyId: keys.aws.accessKeyId,
    secretAccessKey: keys.aws.secretAccessKey,
})

module.exports = app => {
app.get('/api/upload', requireLogin, (req, res) => {
    const fileType = req.query.fileType
    const fileExt = fileType.substring(fileType.indexOf('/')+1)
    const key = `${req.user.id}/${uuidv4()}.${fileExt}`

    const params = {
        Bucket: 'advanced-nodejs-tutorial', 
        Key: key,
        ContentType: fileType
    };

    s3.getSignedUrl('putObject', params, (error, url) => {
        if (error) {
            console.error(error)
            return res.sendStatus(500)
        }

        return res.json({ key, url })
    })
})
}