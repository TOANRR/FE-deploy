import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/LoadingComponent';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import { Breadcrumb } from 'antd';


const OrderSucess = () => {
    const location = useLocation()
    const { state } = location
    return (
        <div style={{ background: 'rgb(240,240,240)', with: '100%', minHeight: '100vh' }}>
            <Breadcrumb
                items={[
                    {
                        title: <a href="/">Trang chủ</a>,
                    },
                    {
                        title: <a href="/order">Giỏ hàng</a>,
                    },
                    {
                        title: <a href="#">Đơn đặt hàng thành công</a>,
                    }
                ]}
                style={{ marginBottom: "25px", paddingTop: "30px", fontSize: "18px", paddingLeft: "5%", fontWeight: "500" }}
            />
            <Loading isLoading={false}>
                <div style={{ height: '100%', width: '90%', margin: '0 auto' }}>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <Lable>Phương thức giao hàng</Lable>
                                    <WrapperValue>
                                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Phương thức thanh toán</Lable>

                                    <WrapperValue>
                                        {orderContant.payment[state?.payment]}
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                {state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder>
                                            <div style={{ width: '200px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                                                <div style={{
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>{order?.name}</div>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Giá tiền: {convertPrice(order?.price)}</span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}
                            </WrapperItemOrderInfo>
                            <div style={{ textAlign: 'right', marginTop: "20px" }}>
                                <span style={{ color: '#ea8500', fontWeight: 'bold', fontSize: "20px", textAlign: 'right' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
                            </div>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default OrderSucess