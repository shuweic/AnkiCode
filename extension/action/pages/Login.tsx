import { useContext, useState } from "react";

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography, message } from "antd";
import { Brain, LogIn } from "lucide-react";

import AuthContext, { AuthStateTag } from "@/contexts/AuthContext";
import { authApi } from "@/api/auth";

import "./Login.css";


const { Title, Text, Link } = Typography;

type LoginForm = {
    email?: string;
    password?: string;
}

const EXTENSION_PUBLIC_SITE_URL = process.env.EXTENSION_PUBLIC_SITE_URL || 'http://localhost:5173';

enum LoginStateTag {
    Normal,
    Login,
}

type LoginState = {
    tag: LoginStateTag,
    data?: string,
}

export default function Login() {
    const { setAuthState } = useContext(AuthContext);
    const [loginState, setLoginState] = useState<LoginState>({
        tag: LoginStateTag.Normal,
    });
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: LoginForm) => {
        setLoginState({ tag: LoginStateTag.Login });
        try {
            const response = await authApi.login({
                email: values.email!,
                password: values.password!,
            });
            const data = response.data;
            await chrome.storage.local.set({
                "ankicode-extension-edge": {
                    data
                }
            });
            setAuthState({ tag: AuthStateTag.LoggedIn, data });
        } catch (error: any) {
            console.error("Login failed:", error);
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials';
            setLoginState({ tag: LoginStateTag.Normal, data: errorMessage });
            messageApi.open({
                type: 'error',
                content: errorMessage,
            });
        }
    };
    return (
        <>
            {contextHolder}
            <div className="login">
                <Flex vertical justify='center' align='center' className="header">
                    <div className="logo">
                        <Brain size={48} />
                    </div>
                    <Title>AnkiCode</Title>
                    <Text type="secondary" className="subtitle">Sign in to your account</Text>
                </Flex>
                <Form name="login" onFinish={onFinish}>
                    <Flex vertical gap={0}>
                        <Form.Item<LoginForm>
                            name="email"
                            rules={[{ required: true, message: '' }]}
                        >
                            <Flex vertical className="input">
                                <Text strong className="label">Email</Text>
                                <Input
                                    size="large"
                                    placeholder="user@example.com"
                                    prefix={
                                        <div className="icon">
                                            <MailOutlined />
                                        </div>
                                    }
                                    type="email"
                                    disabled={loginState.tag === LoginStateTag.Login}
                                />
                            </Flex>
                        </Form.Item>
                        <Form.Item<LoginForm>
                            name="password"
                            rules={[{ required: true, message: '' }]}
                        >
                            <Flex vertical className="input">
                                <Text strong className="label">Password</Text>
                                <Input
                                    size="large"
                                    placeholder="••••••••"
                                    prefix={
                                        <div className="icon">
                                            <LockOutlined />
                                        </div>
                                    }
                                    type="password"
                                    disabled={loginState.tag === LoginStateTag.Login}
                                />
                            </Flex>
                        </Form.Item>

                        <Form.Item>
                            <Flex justify="center">
                                <Button
                                    color="orange"
                                    variant="solid"
                                    htmlType="submit"
                                    size="large"
                                    className="submit"
                                    loading={loginState.tag === LoginStateTag.Login}
                                >
                                    <LogIn size={18} />
                                    <span>Sign In</span>
                                </Button>
                            </Flex>
                        </Form.Item>
                    </Flex>
                </Form>
                <Text type="secondary" className="footer">
                    Don't have an account?{' '}
                    <Link href={`${EXTENSION_PUBLIC_SITE_URL}/register`} target="_blank">
                        Sign up now
                    </Link>
                </Text>

            </div>
        </>
    )
}