import { Page } from 'playwright'

import { makeFetchImplementation } from '@common/adapters/fetch/fetch-factory'
import { handlesFetchError } from '@common/error/fetchError'

import { ILogNotaFiscalApi, ISettingsNotes } from './_interfaces'
import { urlBaseApi } from './_urlBaseApi'
import { TreatsMessageLog } from './TreatsMessageLog'

async function getQtdNotes (page: Page): Promise<number> {
    try {
        const qtdNotesText: string = await page.$eval('.table-legend-right-container > :nth-child(1)', element => element.textContent)
        const qtdNotes: number = Number(qtdNotesText)
        return qtdNotes
    } catch (error) {
        return 0
    }
}

async function saveScreenshot (page: Page, settings: ISettingsNotes) {
    try {
        const fetchFactory = makeFetchImplementation()
        const urlBase = `${urlBaseApi}/log_nota_fiscal`

        const screenshot = await page.screenshot({ type: 'png', fullPage: true })
        await fetchFactory.patch<ILogNotaFiscalApi[]>(
            `${urlBase}/${settings.idLogNotaFiscal}/upload_print_log`,
            {
                bufferImage: screenshot
            },
            { headers: { tenant: process.env.TENANT } }
        )
    } catch (error) {
        const responseAxios = handlesFetchError(error)
        if (responseAxios) settings.errorResponseApi = responseAxios
    }
}

export async function GetQuantityNotes (page: Page, settings: ISettingsNotes): Promise<number> {
    try {
        await page.waitForTimeout(3000)

        await saveScreenshot(page, settings)

        const qtdNotes = await getQtdNotes(page)
        return qtdNotes
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'GetQuantityNotes'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao pegar quantidade das notas.'

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog()
        return 0
    }
}