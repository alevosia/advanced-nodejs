const Keygrip = require('keygrip')
const keys = require('../../config/keys')

const keygrip = new Keygrip([keys.cookieKey])

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user.id
        }
    }

    const session = Buffer.from(JSON.stringify(sessionObject), 'utf8').toString('base64')
    const signature = keygrip.sign('session=' + session)

    return { session, signature }
}