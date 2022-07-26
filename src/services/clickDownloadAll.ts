/* internal */
import clg from '@core/clg'

export default async function (page: any): Promise<void> {
    try {
        await page.waitForTimeout(2000)

        await page.locator('text=Baixar todos os arquivos').click()

        await Promise.all([
            page.waitForEvent('download'),
            page.locator('#dnwld-all-btn-ok').click()
        ])

        await page.locator('button:has-text("Ok")').click()
    } catch (error) {
        clg('Error clicking to download grades on drop-down screen', 'error')
        console.log(error)
    }
}
