import { Page } from 'playwright'
import { initiateCaptchaRequest, pollForRequestResults } from '@utils/2captcha'

function timeOut (time: number): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('TIME_EXCEED')
        }, time)
    })
}

async function captcha (page: Page) {
    const sitekey = await page.getAttribute('.g-recaptcha', 'data-sitekey') ?? ''

    const siteDetails = {
        sitekey,
        pageurl: 'https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica'
    }

    const requestId = await initiateCaptchaRequest(siteDetails)
    const response = await pollForRequestResults(requestId)
    return response
}

export default async (page: Page): Promise<Boolean> => {
    try {
        // time out 3 minutes if captcha not return results
        const response = await Promise.race([captcha(page), timeOut(180000)])
        if (response === 'TIME_EXCEED') throw new Error('TIME EXCEED - GOES THROUGH CAPTCHA')

        await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`)

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
