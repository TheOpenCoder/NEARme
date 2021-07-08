export const formatter = {
    formatTimeTo12HoursStandard,
    formatCardNumber,
    formatExpiryDate,
    formatCvv,
    formatWalletAddMoney,
    formatOnlyNumber
};


function formatTimeTo12HoursStandard(time) {

    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join('');
}

function clearNumber(value = '') {
    return value.replace(/\D+/g, '')
}


function formatCardNumber(value) {

    const clearValue = clearNumber(value)
    let nextValue;
    nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
    return nextValue.trim();

}

function formatExpiryDate(value) {
    const clearValue = clearNumber(value)

    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`
    }

    return clearValue;
}

function formatCvv(value) {
    const clearValue = clearNumber(value);
    return clearValue.slice(0, 3);
}

function formatWalletAddMoney(value) {
    const clearValue = clearNumber(value);
    return clearValue.slice(0, 5);
}

function formatOnlyNumber(value) {
    return clearNumber(value);
}