import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PasswordChange = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm(); // Sử dụng Form.useForm() để sử dụng form instance

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/change-password/${user.id}`, {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            },
                {
                    headers: {
                        token: `Bearer ${user.access_token}`,
                    }
                }
            );
            if (response.data.success) {
                message.success('Đổi mật khẩu thành công');
                form.resetFields(); // Đặt lại các trường của form
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', marginTop: "50px", border: '1px solid #f0f0f0', borderRadius: '4px', fontWeight: "600" }}>
            <h1 style={{ textAlign: 'center', marginBottom: "50px" }}>Đổi mật khẩu</h1>
            <Form
                name="password_change"
                onFinish={onFinish}
                layout="vertical"
                form={form} // Sử dụng form instance đã tạo
            >
                <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại (nếu có)"
                    rules={[{ message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirmNewPassword"
                    label="Xác thực mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PasswordChange;
