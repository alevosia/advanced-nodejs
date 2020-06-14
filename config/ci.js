module.exports = {
    googleClientID: process.env.DEV_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.DEV_GOOGLE_CLIENT_SECRET,
    mongoURI: 'mongodb://127.0.0.1:27017/blog_ci',
    cookieKey: '123123123',
    redisUrl: 'redis://127.0.0.1:6379'
};
