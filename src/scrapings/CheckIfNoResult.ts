import { Page } from 'playwright'

import { treateTextField } from '@utils/functions'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

export async function CheckIfNoResult (page: Page, settings: ISettingsNotes): Promise<void> {
    try {
        await page.waitForTimeout(2000)

        const messageUserDontPermissionOriginal: string = await (await page.$('.panel-body > div > label:nth-child(2)'))?.textContent() // await page.locator('text=Você não tem permissão para acessar esta página.')?.textContent()
        const messageUserDontPermission = messageUserDontPermissionOriginal ? treateTextField(messageUserDontPermissionOriginal) : ''
        if (messageUserDontPermission.indexOf('NAO TEM PERMISSAO') >= 0) {
            throw 'USER_DONT_PERMISSION_TO_FETCH_THIS_IE'
        }

        const messageOriginal: string = await (await page.$('#message-containter > div:nth-child(1)'))?.textContent()
        const message = messageOriginal ? treateTextField(messageOriginal) : ''
        if (message.indexOf('SEM RESULTADO') >= 0) {
            throw 'NOT_EXIST_NOTES'
        }
        if (message.indexOf('CAPTCHA INVALIDO') >= 0) {
            throw 'CAPTCHA_INVALID'
        }
    } catch (error) {
        settings.messageLog = 'CheckIfSemResultados'
        settings.messageError = error
        if (error === 'NOT_EXIST_NOTES') {
            settings.typeLog = 'success'
            settings.messageLogToShowUser = 'Não há notas no período informado.'
        } else if (error === 'CAPTCHA_INVALID') {
            settings.typeLog = 'error'
            settings.messageLogToShowUser = 'Erro ao passar pelo Captcha.'
        } else if (error === 'USER_DONT_PERMISSION_TO_FETCH_THIS_IE') {
            settings.typeLog = 'warning'
            settings.messageLogToShowUser = 'Usuário não tem permissão de baixar notas pra essa inscrição estadual.'
        }

        const treatsMessageLog = new TreatsMessageLog(page, settings, null, true)
        await treatsMessageLog.saveLog(false)
    }
}