import { Page } from 'playwright'

import { saveXMLsNFeNFCGOLib } from '@queues/lib/SaveXMLsNFeNFCGO'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

interface IElementDownload {
    dateString: string
    fileName: string
    filePath: string
    fileUrl: string
    state: string
    url: string
}

// eslint-disable-next-line no-undef
interface IHTMLElement extends Element {
    readonly items_: Array<IElementDownload>
}

export async function SendLastDownloadToQueue (page: Page, settings: ISettingsNotes): Promise<void> {
    try {
        await page.goto('chrome://downloads/')
        await page.waitForTimeout(3000)

        const lastDownload = await page.evaluate(() => {
            const manager: IHTMLElement = document.querySelector('downloads-manager')

            const downloads = manager.items_.length
            const lastDownload = manager.items_[0]
            if (downloads && lastDownload.state === 'COMPLETE') {
                return manager.items_[0]
            }
        })
        await saveXMLsNFeNFCGOLib.add({
            pathThatTheFileIsDownloaded: lastDownload.filePath,
            settings
        })
    } catch (error) {
        settings.typeLog = 'error'
        settings.messageLog = 'SendLastDownloadToQueue'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao enviar pra fila o ultimo download realizado.'

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog()
    }
}