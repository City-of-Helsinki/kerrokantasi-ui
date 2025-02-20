import { useOidcClient } from "hds-react"
import { useSelector } from "react-redux";

export const useAuth = () => {
    const { isAuthenticated, getUser, login, logout } = useOidcClient();
    const locale = useSelector(state => state.language);
    
    const handleLogin = async () => {
        console.debug('Logging in with locale', locale);
        login({language: locale, state: {returnUrl: window.location.pathname}});
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