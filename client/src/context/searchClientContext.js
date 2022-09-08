import { createContext, useContext, useReducer, useState } from "react";
import clientReducer from './SearchClientReducer';
import { searchByAccountNumber } from "../hooks/fetchClients";
import { useQuery } from "@tanstack/react-query";

const ClientContext = createContext();

export const useSearchClientContext = () => useContext(ClientContext);

const SearchClientContext = ({ children }) => {
    const initialState = {
        user: {},
        error: {},
        loading: false,
    };

    const [state, dispatch] = useReducer(clientReducer, initialState);

    const search = async (accNumber) => {
        try {
            dispatch({
                type: 'SET_LOADING',
            });
            const userData = await searchByAccountNumber(accNumber);

            dispatch({
                type: 'SET_USER',
                payload: userData,
            })

            dispatch({
                type: 'SET_LOADING',
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