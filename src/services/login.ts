/* external */
import dotenv from 'dotenv'

dotenv.config()

async function removeAttrTarget (page: any): Promise<void> {
    try {
        const form = await page.waitForSelector('form[name="frmAcesso"]')
        await form.evaluate((form: any) => form.removeAttribute('target'))
    } catch (error: any) {
        console.log(error)
    }
}

export default async (page: any, browser: any): Promise<void> => {
    try {
        await removeAttrTarget(page)

        await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))

        await page.locator('[placeholder="CPF"]').click()
        await page.locator('[placeholder="CPF"]').fill(process.env.USER)

        await page.locator('[placeholder="Senha"]').click()
        await page.locator('[placeholder="Senha"]').fill(process.env.PASSWORD)

        await page.locator('text=Entrar').click()

        await page.waitForTimeout(3000)
    } catch (error: any) {
        console.log(error)
    }
}
