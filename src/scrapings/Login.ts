import { Browser, Page } from 'playwright'

import { ISettingsNotes } from './_interfaces'
import { TreatsMessageLog } from './TreatsMessageLog'

export const Loguin = async (page: Page, browser: Browser, settings: ISettingsNotes): Promise<void> => {
    try {
        const form = await page.waitForSelector('form[name="frmAcesso"]')
        await form.evaluate((form: any) => form.removeAttribute('target'))

        await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))

        await page.locator('[placeholder="CPF"]').click()
        await page.locator('[placeholder="CPF"]').fill(process.env.USER_LOGUIN)

        await page.locator('[placeholder="Senha"]').click()
        await page.locator('[placeholder="Senha"]').fill(process.env.PASS_LOGUIN)

        await page.locator('text=Entrar').click()

        await page.waitForTimeout(3000)
    } catch (error: any) {
        settings.typeLog = 'error'
        settings.messageLog = 'Loguin'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao fazer loguin.'
        settings.pathFile = __filename

        const treatsMessageLog = new TreatsMessageLog(page, settings, browser)
        // dont save in database because dont have information necessary to reprocess
        await treatsMessageLog.saveLog(false)
    }
}