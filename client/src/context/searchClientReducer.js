export default function clientReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                loading: false,
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: true,
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case 'REMOVE_ERROR':
            return {
                ...state,
                error: {},
                loading: false,
            }
        default:
            return state;
    };
};