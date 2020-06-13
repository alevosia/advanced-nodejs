const puppeteer = require('puppeteer')

const makeSession = require('../factories/session')
const makeUser = require('../factories/user')

class CustomPage {
    static async build(options = { headless: true }) {
        const browser = await puppeteer.launch({ headless: options.headless })

        const page = await browser.newPage()

        const customPage = new CustomPage(page)

        return new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || browser[property] || page[property]
            }
        })
    }

    constructor(page) {
        this.page = page
    }

    async login() {
        const user = await makeUser()
        const { session, signature } = makeSession(user)

        await this.page.setCookie({ name: 'session', value: session })
        await this.page.setCookie({ name: 'session.sig', value: signature })
        await this.page.goto('http://localhost:3000/blogs')
    }

    getAttribute(selector, attr) {
        return this.page.$eval(selector, (el, _attr) => el.getAttribute(_attr), attr)
    }

    getInnerHTML(selector) {
        return this.page.$eval(selector, el => el.innerHTML)
    }

    httpGet(url) {
        return this.page.evaluate(
            (_url) => {
                return fetch(_url, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.json())
            }   
        , url)
    }

    httpPost(url, data) {
        return this.page.evaluate(
            (_url, _data) => {
                return fetch(_url, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                }).then(res => res.json())
            }
        , url, data)
    }
}

module.exports = CustomPage