import { createContext } from "react";

import { type AuthResponse } from "@/api/auth";

export enum AuthStateTag {
    Undecided,
    LoggedOut,
    LoggedIn,
}

export type AuthState = {
    tag: AuthStateTag,
    data?: AuthResponse,
}

const AuthContext = createContext<any>(null)
export default AuthContext;
