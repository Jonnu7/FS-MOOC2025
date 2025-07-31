/*const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()

    //await expect(page.getByLabel('username')).toBeVisible()
    //await expect(page.getByLabel('password')).toBeVisible()
  })

  
})*/

const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'rootti',
        username: 'johannes',
        password: 'johannes'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        //await page.getByLabel('username').fill('johannes')
        //await page.getByLabel('password').fill('johannes')
        await page.getByRole('textbox', { name: '' }).first().fill('johannes')
        await page.getByRole('textbox').nth(1).fill('johannes')
        await page.getByRole('button', { name: /login/i }).click()
        
        await expect(page.getByText('rootti logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByRole('textbox', { name: '' }).first().fill('johannes')
        await page.getByRole('textbox').nth(1).fill('asdasd')
        await page.getByRole('button', { name: /login/i }).click()

        await expect(page.getByText(/Wrong credentials|error/i)).toBeVisible()
        await expect(page.getByText('rootti logged in')).not.toBeVisible()
    })

describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    // Luo käyttäjä ja mene sivulle
    await page.goto('http://localhost:5173')
    // Kirjaudu sisään
    await page.getByRole('textbox').first().fill('johannes')
    await page.locator('input[type="password"]').fill('johannes')
    await page.getByRole('button', { name: /login/i }).click()
    // Odota että kirjautuminen onnistuu
    await expect(page.getByText('rootti logged in')).toBeVisible()
  })

  test('a new blog can be created', async ({ page }) => {

    await page.getByRole('button', { name: /create new blog/i }).click()

    /*await page.getByPlaceholder('title').fill('Playwright test blog')
    await page.getByPlaceholder('author').fill('Test Author')
    await page.getByPlaceholder('url').fill('http://testurl.com')*/    
    await page.getByRole('textbox').nth(0).fill('Playwright test')
    await page.getByRole('textbox').nth(1).fill('Test Author')
    await page.getByRole('textbox').nth(2).fill('http://test.com')

    await page.getByRole('button', { name: /create/i }).click()


    //await expect(page.getByText('Playwright test - by: Test Author')).toBeVisible()
    //await expect(page.getByText(/Playwright test/)).toBeVisible()
    //await expect(page.getByText(/Test Author/)).toBeVisible()
    await expect(page.locator('text=Playwright test - by: Test Author').first()).toBeVisible()
  })
  
})
  })
})