module.exports = {
    googleClientID: process.env.DEV_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.DEV_GOOGLE_CLIENT_SECRET,
    mongoURI: 'mongodb://localhost:27017/advanced-nodejs',
    redisUrl: 'redis://localhost:6379',
    cookieKey: '123123123',
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-southeast-1',
        bucket: 'advanced-nodejs-tutorial'
    }
};
