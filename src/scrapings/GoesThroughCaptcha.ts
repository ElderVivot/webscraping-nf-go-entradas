import { Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
import { initiateCaptchaRequest, pollForRequestResults } from './2captcha'
import { TreatsMessageLog } from './TreatsMessageLog'

const siteDetails = {
    sitekey: '6LfTFzIUAAAAAKINyrQ9X5LPg4W3iTbyyYKzeUd3',
    pageurl: 'https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica'
}

function timeOut (time: number): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('TIME_EXCEED')
        }, time)
    })
}

async function captcha () {
    const requestId = await initiateCaptchaRequest(siteDetails)
    const response = await pollForRequestResults(requestId)
    return response
}

export const GoesThroughCaptcha = async (page: Page, settings: ISettingsNotes): Promise<void> => {
    try {
        // time out 3 minutes if captcha not return results
        const response = await Promise.race([captcha(), timeOut(180000)])
        if (response === 'TIME_EXCEED') throw new Error('TIME EXCEED - GOES THROUGH CAPTCHA')

        await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`)
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 500000 }),
            page.click("button[form='filtro']")
        ])
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'GoesThroughCaptcha'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao passar pelo captcha.'

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog(false)
    }
}