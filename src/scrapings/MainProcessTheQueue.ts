import 'dotenv/config'

import { chromium } from 'playwright'

import { logger } from '@common/log'

import { ISettingsNotes } from './_interfaces'
import { CheckIfDownloadInProgress } from './CheckIfDownloadInProgress'
import { CheckIfNoResult } from './CheckIfNoResult'
import { ClickDownloadAll } from './ClickDownloadAll'
import { ClickDownloadModal } from './ClickDownloadModal'
import { CreateFolderToSaveXmls } from './CreateFolderToSaveXmls'
import { GetQuantityNotes } from './GetQuantityNotes'
import { GoesThroughCaptcha } from './GoesThroughCaptcha'
import { InputFormToDownload } from './InputFormToDownload'
import { Loguin } from './Login'
import { OpenSite } from './OpenSite'
import { PageQueryNotes } from './PageQueryNotes'
import { SendLastDownloadToQueue } from './SendLastDownloadToQueue'

/* external */
(async (settings: ISettingsNotes): Promise<void> => {
    try {
        const browser = await chromium.launch({
            headless: false,
            slowMo: 500
        })

        const context = await browser.newContext()
        let page = await browser.newPage()

        const { dateStartDown, dateEndDown, modelNotaFiscal, situationNotaFiscal, federalRegistration, pageInicial, pageFinal } = settings

        // await page.setViewportSize({ width: 0, height: 0 })

        logger.debug('Abrindo site e aceitando cookies')
        await OpenSite(page, browser, settings)

        logger.debug('Realizando loguin')
        await Loguin(page, browser, settings)

        logger.debug('Pegando new page of query notes') // replace page
        page = await PageQueryNotes(page, browser, settings)

        logger.debug('Preenchendo formulario')
        await InputFormToDownload(page, browser, settings)

        logger.debug('Passando pelo captcha')
        await GoesThroughCaptcha(page, settings)

        logger.debug('Checando se existe notas pra baixar')
        await CheckIfNoResult(page, settings)

        const qtdNotesGlobal = await GetQuantityNotes(page, settings)
        settings.qtdNotes = qtdNotesGlobal
        const qtdPagesDivPer100 = Math.trunc(qtdNotesGlobal / 100)
        const qtdPagesModPer100 = qtdNotesGlobal % 100
        settings.qtdPagesTotal = (qtdPagesDivPer100 >= 1 ? qtdPagesDivPer100 : 0) + (qtdPagesModPer100 >= 1 ? 1 : 0)
        settings.pageInicial = 1
        settings.pageFinal = settings.qtdPagesTotal <= 20 ? settings.qtdPagesTotal : 20
        let countWhilePages = 0

        while (true) {
            if (countWhilePages === 0 && pageInicial && pageFinal) {
                settings.pageInicial = pageInicial || settings.pageInicial
                settings.pageFinal = pageFinal || settings.pageFinal
            }

            logger.debug(`Clicando pra baixar arquivos - pag ${settings.pageInicial} a ${settings.pageFinal} de um total de ${settings.qtdPagesTotal}`)
            await ClickDownloadAll(page, settings)

            logger.debug('Clicando pra baixar dentro do modal')
            await ClickDownloadModal(page, settings)

            // logger.debug(`Criando pasta pra salvar ${settings.qtdNotes} notas`)
            // settings.typeLog = 'success' // update to sucess to create folder
            // await CreateFolderToSaveXmls(page, settings)

            // logger.debug('Checando se o download ainda esta em progresso')
            // await CheckIfDownloadInProgress(page, settings)

            // settings.nameStep = 'Enviando informacao que o arquivo foi baixado pra fila de salvar o processamento.'
            // const pageDownload = await context.newPage()
            // await SendLastDownloadToQueue(pageDownload, settings)
            // if (pageDownload) { await pageDownload.close() }

            settings.pageFinal = settings.pageFinal + 20
            settings.pageFinal = settings.pageFinal > settings.qtdPagesTotal ? settings.qtdPagesTotal : settings.pageFinal
            const varAuxiliar = settings.pageFinal - settings.pageInicial - 20
            settings.pageInicial = settings.pageFinal - varAuxiliar
            if (settings.pageInicial > settings.pageFinal) break // if pageInicial is > than pageFinal its because finish processing
            settings.typeLog = 'processing'

            countWhilePages += 1
        }
        // logger.info('-------------------------------------------------')

    // await browser.close()
    } catch (error) {
        logger.error(error)
    }
})({
    dateStartDown: new Date('2022-07-04 03:00'),
    dateEndDown: new Date('2022-08-03 03:00'),
    stateRegistration: '106071459',
    nameCompanie: 'EMPRESA A',
    codeCompanieAccountSystem: '123',
    year: 2022,
    month: 1,
    typeNF: '55'
})