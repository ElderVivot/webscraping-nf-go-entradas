/* internal */
import clg from '@core/clg'
import { treateTextField } from '@utils/functions'

export default async function CheckIfSemResultados (page: any, browser: any): Promise<void> {
    try {
        await page.waitForTimeout(2000)

        const msg = await page.$eval('#message-containter', (el: any) => el.childNodes.length)

        if (msg) {
            const noOriginalResult: string = await page.$eval(
                '#message-containter > div:nth-child(1)',
                (element: any) => element.textContent
            )

            const noResult = noOriginalResult ? treateTextField(noOriginalResult) : ''

            if (noResult.indexOf('FECHARO PERIODO MAXIMO DA CONSULTA E DE 30 DIAS') >= 0) throw new Error('INCORRECT_PERIOD')
            if (noResult.indexOf('SEM RESULTADO') >= 0) throw new Error('NOT_EXIST_NOTES')
            if (noResult.indexOf('CAPTCHA INVALIDO') >= 0) throw new Error('CAPTCHA_INVALID')
        }
    } catch (error: any) {
        if (error?.message === 'NOT_EXIST_NOTES') clg('There are no grades in the reported period', 'info')
        else if (error?.message === 'INCORRECT_PERIOD') clg('Maximum consultation period is 30 DAYS', 'warn')
        else if (error?.message === 'CAPTCHA_INVALID') clg('going through CAPTCHA', 'error')
        else console.log(error)

        await browser.close()
        process.exit()
    }
}
