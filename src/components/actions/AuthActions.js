import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
} from '../services/AuthService';

export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function Logout(navigate) {
    localStorage.clear();
    navigate('/login');
    return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(email, password, redirectPath, navigate) {
    return (dispatch) => {
        let loading = false;
        login(email, password)
        .then((response) => { 
            loading = true;
            saveTokenInLocalStorage(response.data);
            runLogoutTimer(
                dispatch,
                5000 * 1000,
                navigate,
            );
            dispatch(loginConfirmedAction(response.data));   
            loading = false;
            
            // Navigate to the redirect path (from QR code) or default route
            navigate(redirectPath);
        })
        .catch((error) => {
            loading = false;
            var errorMessage;
            try {
                errorMessage = formatError(error.response.data);
            } catch(exception) {
                errorMessage = error.message;
            }
            dispatch(loginFailedAction(errorMessage));
        });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}