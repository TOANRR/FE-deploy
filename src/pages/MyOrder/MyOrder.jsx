import React, { useEffect, useState } from 'react';
import Loading from '../../components/LoadingComponent/LoadingComponent';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/MessageComponent/MessageComponent';
import { Breadcrumb, Menu, Modal, Input } from 'antd';

const MyOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    console.log(location);
    const user = useSelector((state) => state.user);
    const [activeMenu, setActiveMenu] = useState('all'); // State for active menu item
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleMenuClick = (key) => {
        setActiveMenu(key);
        fetchOrdersByStatus(key);
    };

    const fetchOrdersByStatus = async (status) => {
        setIsLoading(true);
        try {
            const response = await OrderService.getOrdersByStatus(status, user.id, user.access_token);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersByStatus('all');
    }, []);

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token
            }
        });
    };

    const mutation = useMutationHooks(
        (data) => {
            const { id, token, orderItems, userId, reason } = data;
            return OrderService.cancelOrder(id, token, orderItems, userId, reason);
        }
    );

    const handleCancelOrder = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleConfirmCancel = () => {
        if (selectedOrder) {
            mutation.mutate(
                { id: selectedOrder._id, token: state.token, orderItems: selectedOrder?.orderItems, userId: user.id, reason: cancelReason },
                {
                    onSuccess: () => {
                        fetchOrdersByStatus(activeMenu); // Refresh order list after cancellation
                    }
                }
            );
            setIsModalVisible(false);
            setCancelReason('');
        }
    };

    const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation;

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success('Đã hủy đơn hàng thành công!');
        } else if (dataCancel?.status === 'ERR') {
            message.error(dataCancel.message);
        }
    }, [isErrorCancel, isSuccessCancel]);

    const renderProduct = (data) => {
        return data?.map((order, index) => {
            return (
                <WrapperHeaderItem key={index}>
                    <img src={order?.image}
                        style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            border: '1px solid rgb(238, 238, 238)',
                            padding: '2px'
                        }}
                    />
                    <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginLeft: '10px'
                    }}>{order?.name}</div>
                    <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
                </WrapperHeaderItem>
            );
        });
    };

    const getDeliveryStatus = (order) => {
        if (order.isCancel) {
            return 'Đã hủy';
        } else if (order.deliveryStatus === 'delivered') {
            return 'Đã vận chuyển';
        } else if (order.deliveryStatus === 'delivering') {
            return 'Đang vận chuyển';
        } else {
            return 'Chưa giao hàng';
        }
    };

    return (
        <div style={{ minHeight: "100hv", marginBottom: "100px" }}>
            <Loading isLoading={isLoading || isLoadingCancel}>
                <WrapperContainer>
                    <div style={{ height: '100%', width: '100%', margin: '0 auto' }}>
                        <Breadcrumb
                            items={[
                                {
                                    title: <a href="/">Trang chủ</a>,
                                },
                                {
                                    title: <a href="#">Đơn hàng của tôi</a>,
                                }
                            ]}
                            style={{ fontSize: "18px", fontWeight: "500", paddingLeft: "9%", paddingTop: "35px" }}
                        />
                        <Menu mode="horizontal" selectedKeys={[activeMenu]} onClick={({ key }) => handleMenuClick(key)} style={{ width: "82%", margin: "0 auto", marginTop: "2%" }}>
                            <Menu.Item key="all"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Tất cả đơn hàng</div></Menu.Item>
                            <Menu.Item key="unpaid"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Chưa thanh toán</div></Menu.Item>
                            <Menu.Item key="paid"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Đã thanh toán</div></Menu.Item>
                            <Menu.Item key="not_shipped"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Chưa vận chuyển</div></Menu.Item>
                            <Menu.Item key="shipping"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Đang vận chuyển</div></Menu.Item>
                            <Menu.Item key="shipped"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Hoàn thành</div></Menu.Item>
                            <Menu.Item key="cancelled"><div style={{ fontSize: '14px', color: '#555555', fontWeight: '500' }}>Đã hủy</div></Menu.Item>
                        </Menu>
                        <WrapperListOrder>
                            {orders?.map((order, index) => {
                                return (
                                    <WrapperItemOrder key={index}>
                                        <WrapperStatus>
                                            {
                                                (!order?.isCancel) ? (<div>
                                                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                                                    <div><span style={{ color: 'rgb(255, 66, 78)', paddingTop: "20px" }}>Giao hàng: </span>{getDeliveryStatus(order)}</div>
                                                    <div><span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán:</span>{`${order.isPaid ? ' Đã thanh toán' : ' Chưa thanh toán'}`}</div>
                                                </div>) : (<div><span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                                                    <div><span style={{ color: "red", fontWeight: "600" }}>Đã bị hủy</span></div></div>)
                                            }
                                        </WrapperStatus>

                                        {renderProduct(order?.orderItems)}
                                        <WrapperFooterItem>
                                            <div>
                                                <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                                                <span
                                                    style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                                                >{convertPrice(order?.totalPrice)}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {
                                                    (!order?.isCancel) ? (<ButtonComponent
                                                        onClick={() => handleCancelOrder(order)}
                                                        size={40}
                                                        styleButton={{
                                                            height: '36px',
                                                            border: '1px solid rgb(11, 116, 229)',
                                                            borderRadius: '4px'
                                                        }}
                                                        textbutton={'Hủy đơn hàng'}
                                                        styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                                    >
                                                    </ButtonComponent>) : (<div></div>)
                                                }
                                                <ButtonComponent
                                                    onClick={() => handleDetailsOrder(order?._id)}
                                                    size={40}
                                                    styleButton={{
                                                        height: '36px',
                                                        border: '1px solid rgb(11, 116, 229)',
                                                        borderRadius: '4px'
                                                    }}
                                                    textbutton={'Xem chi tiết'}
                                                    styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                                >
                                                </ButtonComponent>
                                            </div>
                                        </WrapperFooterItem>
                                    </WrapperItemOrder>
                                );
                            })}
                        </WrapperListOrder>
                    </div>
                </WrapperContainer>
                <Modal
                    title="Lý do hủy đơn hàng"
                    visible={isModalVisible}
                    onOk={handleConfirmCancel}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <Input.TextArea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Nhập lý do hủy đơn hàng"
                        rows={4}
                    />
                </Modal>
            </Loading>
        </div>

    );
};

export default MyOrderPage;
