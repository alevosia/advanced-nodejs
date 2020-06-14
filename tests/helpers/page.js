const puppeteer = require('puppeteer')

const makeSession = require('../factories/session')
const makeUser = require('../factories/user')

class CustomPage {
    static async build(options = { headless: true }) {
        const browser = await puppeteer.launch({ 
            headless: options.headless,
            args: ['--no-sandbox']
        })

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

    get(path) {
        return this.page.evaluate(
            (_path) => {
                return fetch(_path, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.json())
            }, 
            path
        )
    }

    post(path, data) {
        return this.page.evaluate(
            (_path, _data) => {
                return fetch(_path, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                }).then(res => res.json())
            }, 
            path, 
            data
        )
    }

    execHttpRequests(actions) {
        return Promise.all(
            actions.map( ({ method, path, data }) => {
                return this[method](path, data) 
            })
        )
    }
}

module.exports = CustomPage