import { Browser, Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

export async function PageQueryNotes (page: Page, browser: Browser, settings: ISettingsNotes) : Promise<Page> {
    try {
        await page.frameLocator('iframe[name="iNetaccess"]').locator('text=Ok').click()

        const [pageQueryNotes] = await Promise.all([
            page.waitForEvent('popup'),
            page.frameLocator('iframe[name="iNetaccess"]').locator('text=Baixar XML NFE').click()
        ])

        await pageQueryNotes.locator('text=Enviar mesmo assim').click()

        return pageQueryNotes
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'PageQueryNotes'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao abrir pagina pra consulta'
        settings.pathFile = __filename

        const treatsMessageLog = new TreatsMessageLog(page, settings, browser)
        // dont save in database because dont have information necessary to reprocess
        await treatsMessageLog.saveLog(false)
    }
}