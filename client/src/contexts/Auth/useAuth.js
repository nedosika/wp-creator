import {createContext, useContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const value = {

    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    return context;
}