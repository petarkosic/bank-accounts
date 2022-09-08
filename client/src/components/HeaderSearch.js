import { useEffect, useState } from "react";
import { useSearchClientContext } from "../context/SearchClientContext";
import useDebounce from "../hooks/useDebounce";

const HeaderSearch = () => {
    const [inputText, setInputText] = useState('');

    const debounceSearchQuery = useDebounce(inputText, 1500);

    const { search } = useSearchClientContext();

    useEffect(() => {
        search(debounceSearchQuery);
    }, [debounceSearchQuery]);


    const handleChange = e => {
        setInputText(e.target.value);
    }

    const handleSubmit = e => {
        search(debounceSearchQuery);
    }

    return (
        <input
            type="text"
            placeholder="Search by account number"
            className="search"
            value={inputText}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    )
}

export default HeaderSearch;