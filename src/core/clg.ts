/* external */
import colors from 'colors'

const success: any = colors.green
const warn: any = colors.yellow
const error: any = colors.red
const info: any = colors.gray

function setColor (text: string, type: string) : string {
    switch (type) {
    case 'success':
        text = success(text)
        break
    case 'warn':
        text = warn(text)
        break
    case 'info':
        text = info(text)
        break
    case 'error':
        text = error(text)
        break
    }

    return text
}

function setTitleDescription (text: string, type: string) : string {
    switch (type) {
    case 'warn':
        text = `warning: ${text}`
        break
    case 'error':
        text = `error: ${text}`
        break
    case 'info':
        text = `info: ${text}`
        break
    }

    return text
}

export default function (text: string, type: string = '') : void {
    const name: string = colors.bgGreen.black('GLINUS')
    const time: string = colors.bold(new Date().toLocaleTimeString())
    text = setColor(setTitleDescription(text, type), type)
    console.log('>', name, time, text)
}
