import { createContext, useContext, useReducer, useState } from "react";
import clientReducer from './searchClientReducer';
import { searchByAccountNumber } from "../hooks/fetchClients";
import { useQuery } from "@tanstack/react-query";


const ClientContext = createContext();

export const useSearchClientContext = () => useContext(ClientContext);

const initialState = {
    user: {},
    error: {},
    loading: false,
};

const SearchClientContext = ({ children }) => {

    const [state, dispatch] = useReducer(clientReducer, initialState);

    const search = async (accNumber) => {
        try {
            dispatch({
                type: 'SET_LOADING',
            });
            // let res = await axios.get('http://localhost:5000/login');
            const { data: userData, error, isError, isLoading } = useQuery(['account', accNumber], () => searchByAccountNumber(accNumber), {
                onSuccess: (user) => {
                    // setUserByAccount(user);
                    dispatch({
                        type: 'SET_USER',
                        payload: user,
                    })
                }
            });
        } catch (err) {
            setError(err.response.data);
        }
    }

    const setError = (err) => {
        dispatch({
            type: 'SET_ERROR',
            payload: err,
        })
        setTimeout(() => {
            dispatch({ type: 'REMOVE_ERROR' })
        }, 3000);
    }

    const value = {
        user: state.user,
        error: state.error,
        loading: state.loading,
        search,
    }

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    );
}

export default SearchClientContext;