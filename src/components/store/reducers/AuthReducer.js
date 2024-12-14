import {
    LOADING_TOGGLE_ACTION,
    LOGIN_CONFIRMED_ACTION,
    LOGIN_FAILED_ACTION,
    LOGOUT_ACTION,
    SIGNUP_CONFIRMED_ACTION,
    SIGNUP_FAILED_ACTION,
} from '../actions/AuthActions';

const initialState = {
    auth: {
        idToken: null,
        user: null,
    },
    errorMessage: '',
    successMessage: '',
    showLoading: false,
};

export function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case SIGNUP_CONFIRMED_ACTION:
        case LOGIN_CONFIRMED_ACTION:
            return {
                ...state,
                auth: {
                    idToken: action.payload.accessToken,
                    user: action.payload.user,
                },
                errorMessage: '',
                successMessage: action.type === SIGNUP_CONFIRMED_ACTION 
                    ? 'Signup Successfully Completed' 
                    : 'Login Successfully Completed',
                showLoading: false,
            };

        case LOGOUT_ACTION:
            return {
                ...initialState,
            };

        case SIGNUP_FAILED_ACTION:
        case LOGIN_FAILED_ACTION:
            return {
                ...state,
                errorMessage: action.payload,
                successMessage: '',
                showLoading: false,
            };

        case LOADING_TOGGLE_ACTION:
            return {
                ...state,
                showLoading: action.payload,
            };

        default:
            return state;
    }
}