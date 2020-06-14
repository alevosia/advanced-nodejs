const redis = require('redis')
const mongoose = require('mongoose')
const util = require('util')

const keys = require('../config/keys')
const client = redis.createClient(keys.redisUrl)

const exec = mongoose.Query.prototype.exec
client.hget = util.promisify(client.hget)

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true
    this.hashKey = JSON.stringify(options.key || 'defaultKey')

    return this
}

mongoose.Query.prototype.exec = async function() {

    if (!this.useCache) {  
        const result = await exec.apply(this, arguments)
        return result
    }

    // Create a unique key using the query and collection name
    const query = this.getQuery()
    const collection = this.mongooseCollection.name
    const key = JSON.stringify({ ...query, collection })

    // Check if we have a cached value for 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key)

    // If we do, return that
    if (cacheValue) {
        const parsed = JSON.parse(cacheValue)

        // If the parsed cache value is an array, map each element first
        // to a new instance of its mongoose model, otherwise return 
        // a single instance of the model
        return Array.isArray(parsed)
            ? parsed.map((doc) => new this.model(doc))
            : new this.model(parsed)
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments)

    // As per Redis 4.0.0, HMSET is considered deprecated. Please use HSET in new code.
    client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10)
    return result
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}