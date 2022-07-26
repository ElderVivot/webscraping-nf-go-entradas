async function sendAnyway (page: any) : Promise<void> {
    await page.locator('text=Enviar mesmo assim').click()
}

export default async function (page: any) : Promise<any> {
    try {
        const [pageQueryNfes] = await Promise.all([
            page.waitForEvent('popup'),
            page.frameLocator('iframe[name="iNetaccess"]').locator('text=Baixar XML NFE').click()
        ])

        await sendAnyway(pageQueryNfes)

        return pageQueryNfes
    } catch (error) {
        console.log(error)
    }
}
