export const parseNumber = (num) => {
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`
};

const generateRandomNumber = (length) => {
    return (Math.floor(Math.random() * `${length === 3 ? 1000 : 99}`) + 1).toString().padStart(length, '0');
}

export const generateAccountNumber = () => {
    const randomNumberThreeDigit1 = generateRandomNumber(3); // three digit
    const randomNumberThreeDigit2 = generateRandomNumber(3); // three digit
    const randomNumberTwoDigit = generateRandomNumber(2);// two  digit

    return `${randomNumberThreeDigit1}-${randomNumberThreeDigit2}-${randomNumberTwoDigit}`
}