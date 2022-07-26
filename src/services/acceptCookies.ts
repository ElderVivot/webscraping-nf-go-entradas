export default async (page: any): Promise<void> => {
    try {
        await page.locator('text=Concordo').click()
    } catch (error: any) {
        console.log(error)
    }
}
