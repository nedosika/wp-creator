import {createContext, useContext} from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const value = {

    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export const authContext = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("authContext must be used within a AuthProvider");
    }

    return context;
}