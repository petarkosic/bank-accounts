import { useState, useEffect } from 'react';

function useDebounce(value, delay = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        let timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        }
    }, [value, delay])

    return debouncedValue
}

export default useDebounce;