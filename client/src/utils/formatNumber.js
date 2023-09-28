
export function formatNumber(num) {
    return Intl.NumberFormat('en', { notation: 'standard' }).format(num);
}