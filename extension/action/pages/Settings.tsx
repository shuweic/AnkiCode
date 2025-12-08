import { useContext, useState } from "react";

import { Button, Card, Flex, Typography } from "antd";
import { LogOut } from "lucide-react";

import AuthContext, { AuthStateTag } from "@/contexts/AuthContext";

import "./Settings.css";
import { authApi } from "@/api/auth";


const { Text } = Typography;

export default function Settings() {
    const { authState, setAuthState } = useContext(AuthContext);
    const onLogout = async () => {
        try {
            await authApi.logout();
        } finally {
            await chrome.storage.local.remove("ankicode-extension-edge");
            setAuthState({ tag: AuthStateTag.LoggedOut });
        }
    };
    return (
        <Flex vertical justify="space-between" className="settings">
            <div>
                <Card title="Account Information" size="small" className="account">
                    <Flex justify="space-between">
                        <Text strong>Name</Text>
                        <Text>{authState.data.user.name}</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text strong>Email</Text>
                        <Text>{authState.data.user.email}</Text>
                    </Flex>
                </Card>
                <Card title="About" size="small" className="about">
                    <Flex justify="space-between">
                        <Text strong>Version</Text>
                        <Text>1.0.0</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text strong>System</Text>
                        <Text>AnkiCode for Edge</Text>
                    </Flex>
                </Card>
            </div>
            <Button
                color="orange"
                variant="solid"
                size="large"
                className="submit"
                onClick={onLogout}
            >
                <LogOut size={18} />
                <span>Sign out</span>
            </Button>
        </Flex>
    )
}