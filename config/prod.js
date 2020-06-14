module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: 'mongodb://localhost:27017/advanced-nodejs',
    redisUrl: 'redis://localhost:6379',
    cookieKey: process.env.COOKIE_KEY,
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-southeast-1',
        bucket: 'advanced-nodejs-tutorial'
    }
};
