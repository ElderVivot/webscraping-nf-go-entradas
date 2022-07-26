/* internal */
import clg from '@core/clg'

/* external */
import dotenv from 'dotenv'

dotenv.config()

export default () : Promise<Boolean> => {
    return new Promise(resolve => {
        try {
            if (!process.env.USER || !process.env.PASSWORD) {
                throw new Error('You need to set the credentials to login to the site!')
            }

            if (!process.env.START_DATE || !process.env.END_DATE) {
                throw new Error('You need to set the period to carry out an inquiry!')
            }

            if (!process.env.NUM_IE && typeof process.env.NUM_IE === 'string') {
                throw new Error('You need to define a valid state registration to perform the query!')
            }
            resolve(true)
        } catch (error: any) {
            clg(error.message, 'warn')
            resolve(false)
        }
    })
}
