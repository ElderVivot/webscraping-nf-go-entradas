import { Browser, Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

export const OpenSite = async (page: Page, browser: Browser, settings: ISettingsNotes): Promise<void> => {
    try {
        await page.goto('https://www.economia.go.gov.br/', { waitUntil: 'networkidle' })
        await page.waitForTimeout(2000)
        await page.locator('text=Concordo').click()
    } catch (error: any) {
        settings.typeLog = 'error'
        settings.messageLog = 'LoguinCertificado'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao fazer loguin com o certificado.'
        settings.pathFile = __filename

        const treatsMessageLog = new TreatsMessageLog(page, settings, browser)
        // dont save in database because dont have information necessary to reprocess
        await treatsMessageLog.saveLog(false)
    }
}