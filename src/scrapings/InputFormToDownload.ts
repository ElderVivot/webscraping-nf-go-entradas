/* internal */
import { Browser, Page } from 'playwright'

import { makeDateImplementation } from '@common/adapters/date/date-factory'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

export const InputFormToDownload = async (page: Page, browser: Browser, settings: ISettingsNotes) : Promise<void> => {
    try {
        const dateFactory = makeDateImplementation()

        const dateStartDown = dateFactory.formatDate(settings.dateStartDown, 'dd/MM/yyyy')
        const dateEndDown = dateFactory.formatDate(settings.dateEndDown, 'dd/MM/yyyy')
        await page.waitForSelector('#cmpDataInicial')
        await page.evaluate(`document.getElementById("cmpDataInicial").value="${dateStartDown}";`)
        await page.evaluate(`document.getElementById("cmpDataFinal").value="${dateEndDown}";`)

        await page.locator('input[name="cmpNumIeDest"]').click()
        await page.locator('input[name="cmpNumIeDest"]').fill(settings.stateRegistration)

        await page.locator('input[name="cmpExbNotasCanceladas"]').check()
    } catch (error: any) {
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