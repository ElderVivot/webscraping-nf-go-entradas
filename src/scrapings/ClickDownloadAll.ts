import { Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

export async function ClickDownloadAll (page: Page, settings: ISettingsNotes): Promise<void> {
    try {
        await page.waitForTimeout(2000)
        await page.waitForSelector('.btn-download-all')
        await page.click('.btn-download-all')
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'ClickDownloadAll'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao clicar pra baixar todas as notas.'

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog()
    }
}