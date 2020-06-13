const mongoose = require('mongoose')
const Page = require('./helpers/page')

let page

beforeEach(async () => {
    page = await Page.build({ headless: true })
    await page.goto('http://localhost:3000')
})

afterEach(async () => {
    await page.close()
})

afterAll(async () => { 
    await mongoose.connection.close();
});

describe('Brand logo', () => {
    test('says "Blogster"', async () => {
        const text = await page.getInnerHTML('a.brand-logo')
        expect(text).toEqual('Blogster')
    })

    test('links to homepage', async () => {
        const link = await page.getAttribute('a.brand-logo', 'href')
        expect(link).toEqual('/')
    })
})

describe('When logged in', () => {
    beforeEach(async () => {
        await page.login()
    })

    test('shows logout button', async () => {
        const text = await page.getInnerHTML('a[href="/auth/logout"]')
        expect(text).toEqual('Logout')
    })

    test('logout button redirects to homepage when clicked', async () => {
        await page.click('a[href="/auth/logout"]')
        const url = await page.url()
        expect(url).toEqual('http://localhost:3000/')
    })
})

describe('When not logged in', () => {
    describe('Login link', () => {
        test('says "Login With Google"', async () => {
            const text = await page.getInnerHTML('a[href="/auth/google"')
            expect(text).toEqual('Login With Google')
        })
    
        test('starts Google OAuth flow when clicked', async () => {
        	await page.click('.right a')
            const url = await page.url()
            expect(url).toMatch(/accounts\.google\.com/)
        })
    })
})
