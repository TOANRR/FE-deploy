import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/LoadingComponent';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import './StyleTran.css'

import * as PaymentService from '../../services/PaymentService'
import { message } from 'antd';
const OrderSuccessVnpay = () => {
    const location = useLocation();
    const navigate = useNavigate()

    // Khởi tạo state để lưu trữ chuỗi JSON của các tham số
    const [queryParamsString, setQueryParamsString] = useState('');
    const [sucess, setSucess] = useState(false)
    const [order, setOrder] = useState();
    useEffect(() => {
        // Lấy tham số từ đường link
        const fetchData = async () => {
            try {
                // Lấy tham số từ đường link
                const searchParams = new URLSearchParams(location.search);
                console.log(searchParams)
                // Khởi tạo một đối tượng để lưu trữ các tham số
                const vnp_Params = {};

                // Duyệt qua tất cả các tham số và thêm chúng vào đối tượng params
                for (const [key, value] of searchParams.entries()) {
                    vnp_Params[key] = value;
                }
                console.log(vnp_Params)
                const res = await PaymentService.getURLreturn(vnp_Params)
                console.log(res)
                if (vnp_Params["vnp_TransactionStatus"] === "00" && res.status === "OK") {
                    // message.success("Giao dịch thành công!")
                    // setOrder(res.data)
                    // setSucess(true)
                    message.success('Đặt hàng thành công');
                    navigate('/orderSuccess', {
                        state: {
                            delivery: res.data?.delivery,
                            payment: res.data?.paymentMethod,
                            orders: res.data?.orderItems,
                            totalPriceMemo: res.data?.totalPrice
                        }
                    });
                    setSucess(true)
                }


                else {
                    setSucess(false)
                    message.error(res.Message)
                }
                // // Chuyển đối tượng params thành một chuỗi JSON
                // const jsonString = JSON.stringify(params, null, 2); // Tham số thứ ba là số lượng khoảng trắng để thụt vào
                // // Cập nhật state với chuỗi JSON
                // setQueryParamsString(jsonString);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // u

    return (

        <div style={{ background: '#fff', with: '100%', height: '100vh' }}>
            {
                !sucess && (
                    <div className="failed-transaction-container">
                        <div className="failed-transaction">
                            <div className="image-container">
                                <img src="https://camo.githubusercontent.com/eb55e48476c688bd5e2537cbf80943f9304e26755883ab851e032e8933a4377d/687474703a2f2f70657478696e682e776565626c792e636f6d2f75706c6f6164732f312f332f312f372f3133313733373936312f30396261366462663937626462396330316561633330663038383936623935392e676966" alt="" />
                            </div>                                <h2 className="failed-transaction-title">Giao dịch thất bại</h2>
                            <p className="failed-transaction-message">Xin lỗi, giao dịch của bạn đã thất bạn, đơn hàng bạn vừa order sẽ bị xóa khỏi giỏ hàng.</p>
                        </div>
                    </div>
                )

            }

        </div>
    )
}

export default OrderSuccessVnpay