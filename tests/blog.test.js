const mongoose = require('mongoose')
const Page = require('./helpers/page')

let page

describe('When logged in and add blog post is clicked', () => {
    beforeEach(async () => {
        page = await Page.build({ headless: true })
        await page.goto('http://localhost:3000')
        await page.login()
        await page.click('a[href="/blogs/new"]')
    })
    
    afterEach(async () => {
        await page.close()
    })
    
    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('create blog post form is accessible', async () => {
        const label = await page.getInnerHTML('form label')
        expect(label).toEqual('Blog Title')
    })

    describe('And submitted with an empty form', () => {
        beforeEach(async () => {
            await page.click('button[type="submit"]')
        })

        test('the form shows an error message for each empty field', async () => {
            const titleError = await page.getInnerHTML('.title .red-text')
            const contentError = await page.getInnerHTML('.content .red-text')

            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')
        })
    })

    describe('And submitted with valid inputs', () => {

        const TEST_TITLE = 'Test Valid Title'
        const TEST_CONTENT = 'Test Valid Content'
        const CONFIRM_MESSAGE = 'Please confirm your entries'

        beforeEach(async () => {
            await page.type('input[name="title"]', TEST_TITLE)
            await page.type('input[name="content"]', TEST_CONTENT)
            await page.click('button[type="submit"]')
        })

        test('shows the confirmation screen', async () => {
            const confirmText = await page.getInnerHTML('h5')
            expect(confirmText).toEqual(CONFIRM_MESSAGE)
        })

        test('confirming adds the post to blog page', async () => {
            await page.click('button.green')
            await page.waitFor('.card')

            const title = await page.getInnerHTML('.card-content .card-title')
            const content = await page.getInnerHTML('.card-content p')

            expect(title).toEqual(TEST_TITLE)
            expect(content).toEqual(TEST_CONTENT)
        })
    })
})
