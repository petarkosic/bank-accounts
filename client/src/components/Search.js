import { useEffect, useState } from "react";
import { useSearchClientContext } from "../context/SearchClientContext";
import useDebounce from "../hooks/useDebounce";
import useHandleKeyDown from "../hooks/useHandleKeyDown";
import searchInputSchema from "../validations/searchInputSchema";

const Search = () => {
    const { inputOne, inputTwo, inputThree, setInputOne, setInputTwo, setInputThree, handleKeyDown } = useHandleKeyDown();

    const [errors, setErrors] = useState({});

    const inputText = inputOne + inputTwo + inputThree;

    const debounceSearchQuery = useDebounce(inputText, 1500);

    const { search } = useSearchClientContext();

    useEffect(() => {
        const { error } = searchInputSchema.validate({
            inputOne,
            inputTwo,
            inputThree
        });

        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                if (detail.path[0] === 'inputOne') {
                    validationErrors['Input One'] = detail.message;
                } else if (detail.path[0] === 'inputTwo') {
                    validationErrors['Input Two'] = detail.message;
                } else if (detail.path[0] === 'inputThree') {
                    validationErrors['Input Three'] = detail.message;
                }
            });
            setErrors(validationErrors);
        } else {
            setErrors({});
            search(debounceSearchQuery);
        }
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
                        className={`search${errors['Input One'] ? ' error' : ''}`}
                        value={inputOne}
                        name="inputOne"
                        onChange={e => handleChange(e)}
                        onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e)}
                        maxLength={3}
                    />
                    -
                    <input
                        type="text"
                        className={`search${errors['Input Two'] ? ' error' : ''}`}
                        value={inputTwo}
                        name="inputTwo"
                        onChange={e => handleChange(e)}
                        onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e)}
                        maxLength={3}
                    />
                    -
                    <input
                        type="text"
                        className={`search${errors['Input Three'] ? ' error' : ''}`}
                        value={inputThree}
                        name="inputThree"
                        onChange={e => handleChange(e)}
                        onKeyDown={e => e.key === 'Backspace' && handleKeyDown(e)}
                        maxLength={2}
                    />
                </div>
                {errors['Input One'] && <p className="error">{errors?.['Input One']}</p>}
                {errors['Input Two'] && <p className="error">{errors?.['Input Two']}</p>}
                {errors['Input Three'] && <p className="error">{errors?.['Input Three']}</p>}
            </div>
        </form>
    )
}

export default Search;