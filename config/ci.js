module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: 'mongodb://127.0.0.1:27017/blog_ci',
    redisUrl: 'redis://127.0.0.1:6379',
    cookieKey: '123123123',
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-southeast-1',
        bucket: 'advanced-nodejs-tutorial'
    }
};
