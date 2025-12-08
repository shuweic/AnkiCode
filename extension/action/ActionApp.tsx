import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Flex, Tabs, Typography } from "antd";
import { Brain } from "lucide-react";

import AuthContext, { type AuthState, AuthStateTag } from "@/contexts/AuthContext";

import Loading from "@/components/Loading";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import Problem from "@/pages/Problem";
import Review from "@/pages/Review";

import "./ActionApp.css";

const { Title } = Typography;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ActionApp() {
  const [authState, setAuthState] = (
    useState<AuthState>({
      tag: AuthStateTag.Undecided,
    })
  );
  const dashboardItems = [
    {
      key: "1",
      label: <Title level={5} className="title">Review</Title>,
      children: <Review />,
    },
    {
      key: "2",
      label: <Title level={5} className="title">Problem</Title>,
      children: <Problem />,
    },
    {
      key: "3",
      label: <Title level={5} className="title">Settings</Title>,
      children: <Settings />,
    },
  ];

  useEffect(() => {
    (async () => {
      const storage = (await chrome.storage.local.get("ankicode-extension-edge"))["ankicode-extension-edge"];
      if (storage) {
        const data = storage["data"];
        if (data && data.token && data.user) {
          setAuthState({
            tag: AuthStateTag.LoggedIn,
            data,
          });
          return;
        }
      }

      setAuthState({ tag: AuthStateTag.LoggedOut });
    })();
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        {
          {
            [AuthStateTag.Undecided]: <Loading />,
            [AuthStateTag.LoggedOut]: <Login />,
            [AuthStateTag.LoggedIn]:
              <div className="dashboard">
                <Flex justify="center" gap={8}>
                  <div className="logo">
                    <Brain size={24} />
                  </div>
                  <Title level={3}>AnkiCode</Title>
                </Flex>
                <Tabs items={dashboardItems} centered className="nav"></Tabs>
              </div>
            ,
          }[authState.tag]
        }
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

export default ActionApp
