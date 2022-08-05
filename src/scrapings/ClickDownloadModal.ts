import { Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
// import { createFolderToSaveData } from './CreateFolderToSaveData'
import { TreatsMessageLog } from './TreatsMessageLog'

export async function ClickDownloadModal (page: Page, settings: ISettingsNotes): Promise<number> {
    try {
        await page.waitForTimeout(2000)
        await page.waitForSelector('#dnwld-all-btn-ok')
        await page.click('#cmpPagPer')
        await page.type('#cmpPagIni', String(settings.pageInicial))
        await page.type('#cmpPagFin', String(settings.pageFinal))
        await page.click('#dnwld-all-btn-ok')

        // const [download] = await Promise.all([
        //     page.waitForEvent('download'),
        //     page.click('#dnwld-all-btn-ok')
        // ])
        // const pathNote = await createFolderToSaveData(settings)
        // const path = await download.saveAs(pathNote)
        // console.log(download.suggestedFilename())
        // console.log(path)
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'ClickDownloadModal'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao clicar pra baixar as notas na tela suspensa'

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog()
        return 0
    }
}