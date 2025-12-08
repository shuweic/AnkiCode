import { useEffect, useState } from "react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router-dom";

import AuthContext, { type AuthState, AuthStateTag } from "@/contexts/AuthContext";

import Loading from "@/components/Loading";
import Login from "@/pages/Login";
import Preference from "@/pages/Preference";
import Problem from "@/pages/Problem";
import Review from "@/pages/Review";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Review />,
  },
  {
    path: "/preference",
    element: <Preference />,
  },
  {
    path: "/problem",
    element: <Problem />,
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

function ActionApp() {
  const [authState, setAuthState] = (
    useState<AuthState>({
      tag: AuthStateTag.Undecided,
    })
  );

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
      router.navigate("/login");
    })();
  }, [])

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {
        authState.tag === AuthStateTag.Undecided ? (
          <Loading />
        ) : (
          <RouterProvider router={router} />
        )
      }
    </AuthContext.Provider>
  )
}

export default ActionApp
