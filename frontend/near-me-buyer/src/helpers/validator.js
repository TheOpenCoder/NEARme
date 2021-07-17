export const validator = {
    validateIfShopIsOpen,
    validateCardNumber,
    validateCvv,
    validateExpiryDate,
    validateNotNull,
    validateEmail
};


function validateIfShopIsOpen(shopOpeningTime, shopClosingTime) {

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getHours();

    if (`${currentHour}:${currentMinute}` > shopOpeningTime && `${currentHour}:${currentMinute}` < shopClosingTime) {
        return true;
    } else {
        return false;
    }
}


function validateCardNumber(submitted, value) {
    if (submitted) {
        return (value.length === 19) ? true : false
    } else {
        return true
    }
}



function validateCvv(submitted, value) {
    if (submitted) {
        return (value.length === 3) ? true : false
    } else {
        return true
    }
}



function validateExpiryDate(submitted, value) {
    if (submitted) {
        return (value.length === 5) ? true : false
    } else {
        return true
    }
}

function validateNotNull(submitted, value) {
    if (submitted) {
        return (value.length > 0) ? true : false
    } else {
        return true
    }
}

function validateEmail(submitted, value) {
    if (submitted) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(value) === false) {
            return false;
          } else {
              return true
          }
    } else {
        return true
    }
}

