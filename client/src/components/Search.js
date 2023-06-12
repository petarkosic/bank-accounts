import { useEffect, useState } from "react";
import { useSearchClientContext } from "../context/SearchClientContext";
import useDebounce from "../hooks/useDebounce";

const Search = () => {
    const [inputOne, setInputOne] = useState('');
    const [inputTwo, setInputTwo] = useState('');
    const [inputThree, setInputThree] = useState('');

    const inputText = inputOne + inputTwo + inputThree

    const debounceSearchQuery = useDebounce(inputText, 1500);

    const { search } = useSearchClientContext();

    useEffect(() => {
        search(debounceSearchQuery);
    }, [debounceSearchQuery]);

    const handleChange = e => {
        if (e.target.name === 'inputOne') {
            if (e.target.value.length <= e.target.maxLength) {
                setInputOne(e.target.value);
                if (e.target.value.length === e.target.maxLength && e.target.nextElementSibling) {
                    e.target.nextElementSibling.focus();
                }
                return
            }
        }

        if (e.target.name === 'inputTwo') {
            if (e.target.value.length <= e.target.maxLength) {
                setInputTwo(e.target.value);
                if (e.target.value.length === e.target.maxLength && e.target.nextElementSibling) {
                    e.target.nextElementSibling.focus();
                }
                return
            }
        }

        if (e.target.name === "inputThree") {
            if (e.target.value.length <= e.target.maxLength) {
                setInputThree(e.target.value);
                return
            }
        }
    }

    const handleKeyDown = e => {
        if (e.target.name === 'inputOne' && inputOne) {
            setInputOne(prevValue => prevValue.slice(0, prevValue.length));
            return;
        } else if (inputOne.length === 0) {
            return;
        }

        if (e.target.name === 'inputTwo' && inputTwo) {
            setInputTwo(prevValue => prevValue.slice(0, prevValue.length));
            return;
        } else if (inputTwo.length === 0) {
            e.target.previousElementSibling.focus();
        }

        if (e.target.name === 'inputThree' && inputThree) {
            setInputThree(prevValue => prevValue.slice(0, prevValue.length));
            return;
        } else if (inputThree.length === 0) {
            e.target.previousElementSibling.focus();
        }
    }

    const handleSubmit = e => {
        search(debounceSearchQuery);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-wrapper">
                <p>Search by account number</p>
                <div className="inputs">
                    <input
                        type="text"
                        className="search"
                        value={inputOne}
                        name="inputOne"
                        onChange={e => handleChange(e)}
                        onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e)}
                        maxLength={3}
                    />
                    -
                    <input
                        type="text"
                        className="search"
                        value={inputTwo}
                        name="inputTwo"
                        onChange={e => handleChange(e)}
                        onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e)}
                        maxLength={3}
                    />
                    -
                    <input
                        type="text"
                        className="search"
                        value={inputThree}
                        name="inputThree"
                        onChange={e => handleChange(e)}
                        onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e)}
                        maxLength={2}
                    />
                </div>
            </div>
        </form>
    )
}

export default Search;