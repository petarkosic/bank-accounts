import { useState } from "react";

const HeaderSearch = () => {
    const [inputText, setInputText] = useState('');

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