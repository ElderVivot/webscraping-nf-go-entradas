import path from 'path'
import { Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
import { createFolderToSaveData } from './CreateFolderToSaveData'
import { TreatsMessageLog } from './TreatsMessageLog'

export async function CreateFolderToSaveXmls (page: Page, settings: ISettingsNotes): Promise<void> {
    try {
        if (!settings.qtdNotes) {
            throw 'NOT_EXIST_NOTES_TO_DOWN'
        }
        const pathNote = await createFolderToSaveData(settings)
        const client = await page.context().newCDPSession(page)
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path.resolve(pathNote)
        })
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'CreateFolderToSaveXmls'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao criar pasta pra salvar os xmls.'
        if (error === 'NOT_EXIST_NOTES_TO_DOWN') {
            settings.messageLogToShowUser = 'Apesar de ter passado pelo captcha e nao ter dado aviso de sem notas ele nao encontrou nada no download.'
        }

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog()
    }
}