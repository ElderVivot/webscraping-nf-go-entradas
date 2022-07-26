/* internal */
import clg from '@core/clg'
import GoesThroughCaptcha from '@services/GoesThroughCaptcha'

function checkDate (date: any): Boolean {
    const size = date.length
    if (size === 8) return true
    return false
}

function checkIe (ie: any): Boolean {
    const size = ie.length
    if (size === 9) return true
    return false
}

export default async (page: any) : Promise<void> => {
    try {
        const startDate = process.env.START_DATE?.replaceAll('/', '')
        const endDate = process.env.END_DATE?.replaceAll('/', '')
        const ie = process.env.NUM_IE

        const isStartDate = checkDate(startDate)
        const isEndDate = checkDate(endDate)
        const isIe = checkIe(ie)

        if (!isStartDate) throw new Error('START_DATE')
        if (!isEndDate) throw new Error('END_DATE')
        if (!isIe) throw new Error('NUM_IE')

        if (isStartDate && isEndDate && isIe) {
            await page.locator('[placeholder="Data inicial"]').click()
            await page.locator('[placeholder="Data inicial"]').fill(startDate)

            await page.locator('[placeholder="Data final"]').click()
            await page.locator('[placeholder="Data final"]').fill(endDate)

            await page.locator('input[name="cmpNumIeDest"]').click()
            await page.locator('input[name="cmpNumIeDest"]').fill(process.env.NUM_IE)

            await page.locator('input[name="cmpExbNotasCanceladas"]').check()

            await GoesThroughCaptcha(page)

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 500000 }),
                page.click("button[form='filtro']")
            ])
        }
    } catch (error: any) {
        const msg: any = error?.message
        if (msg === 'START_DATE') clg('START_DATE invalid!', 'warn')
        else if (msg === 'END_DATE') clg('END_DATE invalid!', 'warn')
        else if (msg === 'NUM_IE') clg('NUM_IE invalid!', 'warn')
        else console.log(error)
    }
}
