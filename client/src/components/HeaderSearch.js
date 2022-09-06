import { useState } from "react";
import { useSearchClientContext } from "../context/searchClientContext";
import useDebounce from "../hooks/useDebounce";

const HeaderSearch = () => {
    const [inputText, setInputText] = useState('');

    const debounceSearchQuery = useDebounce(inputText, 1500);

    const [search] = useSearchClientContext();

    // const { data: userData, error, isError, isLoading } = useQuery(['account', accountNumber], () => searchByAccountNumber(accountNumber), {
    //     onSuccess: (user) => {
    //         setUserByAccount(user);
    //     }
    // });
    search(debounceSearchQuery);

    const handleChange = e => {
        setInputText(e.target.value);
    }

    return (
        <input
            type="text"
            placeholder="Search by account number"
            className="search"
            value={inputText}
            onChange={handleChange}
        />
    )
}

export default HeaderSearch;