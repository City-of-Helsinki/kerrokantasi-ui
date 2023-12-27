import { useOidcClient } from "hds-react"

export const useAuth = () => {
    const { isAuthenticated, getUser, login, logout } = useOidcClient();
    
    const handleLogin = async () => {
        login();
    }
    const handleLogout = async () => {
        logout();
    }
    return {
        authenticated: isAuthenticated(),
        login: handleLogin,
        logout: handleLogout,
        user: getUser(),
    };
}

export default useAuth;