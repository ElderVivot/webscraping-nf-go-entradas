/* internal */
import { chromium } from 'playwright'

import clg from '@core/clg'
import validation from '@core/validation'
import acceptCookies from '@services/acceptCookies'
import checkIfNoResult from '@services/checkIfNoResult'
import clickDownloadAll from '@services/clickDownloadAll'
import formNotesReceived from '@services/formNotesReceived'
import login from '@services/login'
import pageQueryNfes from '@services/pageQueryNfes'

/* external */
(async () => {
    clg('Starting..', 'success')

    const start: Boolean = await validation()

    if (start) {
        const browser = await chromium.launch({
            headless: false,
            slowMo: 1500,
            timeout: 10000
        })

        const page = await browser.newPage()

        await page.goto('https://www.economia.go.gov.br/', { waitUntil: 'networkidle' })

        clg('accepting cookies..')
        await acceptCookies(page)

        clg('logging in..')
        await login(page, browser)

        clg('closing modal..')
        await page.frameLocator('iframe[name="iNetaccess"]').locator('text=Ok').click()

        clg('entering the query page..')
        const pageQuery = await pageQueryNfes(page)

        clg('filling out form..')
        await formNotesReceived(pageQuery)

        clg('check if there are no results..')
        await checkIfNoResult(pageQuery, browser)

        clg('click to download..')
        await clickDownloadAll(pageQuery)

        // await pageQuery.pause()

        await pageQuery.waitForTimeout(1500)

        await browser.close()
    }
})()