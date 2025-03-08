import { createContext, useReducer } from "react";

const AuthContext = createContext();

let authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return {...state, user: action.payload}
        case 'LOGOUT':
            return {...state, user: null}
        default:
            return state;
    }
}

const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {user: null});

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContextProvider, AuthContext };