import axios, { AxiosResponse } from 'axios'

export function handlesFetchError (error: any): AxiosResponse {
    if (axios.isAxiosError(error)) {
        return error.response?.data
    }
}