import axios from "axios"

export const getConfig = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`)
    return res.data
}

export const getVnpay = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/vnpay/create_payment_url`, data)
    return res.data
}