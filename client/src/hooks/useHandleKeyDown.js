import { useState } from 'react'

const useHandleKeyDown = () => {
    const [inputOne, setInputOne] = useState('');
    const [inputTwo, setInputTwo] = useState('');
    const [inputThree, setInputThree] = useState('');

    const handleKeyDown = (e) => {
        if (e.target.name === 'inputOne' && inputOne) {
            setInputOne((prevValue) => prevValue.slice(0, prevValue.length));
            return;
        } else if (inputOne.length === 0) {
            return;
        }

        if (e.target.name === 'inputTwo' && inputTwo) {
            setInputTwo((prevValue) => prevValue.slice(0, prevValue.length));
            return;
        } else if (inputTwo.length === 0) {
            e.target.previousElementSibling.focus();
        }

        if (e.target.name === 'inputThree' && inputThree) {
            setInputThree((prevValue) => prevValue.slice(0, prevValue.length));
            return;
        } else if (inputThree.length === 0) {
            e.target.previousElementSibling.focus();
        }
    };

    return { inputOne, inputTwo, inputThree, setInputOne, setInputTwo, setInputThree, handleKeyDown };
}

export default useHandleKeyDown;