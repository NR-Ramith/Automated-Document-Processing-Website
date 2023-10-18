export function isValidDateFormat(input) {
    // Regular expression to match "YYYY-MM-DD" format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(input);
}

export function isValidDate(input) {
    const parts = input.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const dateObject = new Date(year, month - 1, day); // Month is 0-indexed
    if (
        dateObject.getFullYear() !== year ||
        dateObject.getMonth() !== month - 1 ||
        dateObject.getDate() !== day
    ) {
        return false; // Invalid date
    }

    // Check if the input date is not beyond the present day
    const currentDate = new Date();
    if (dateObject > currentDate) {
        return false; // Input date is in the future
    }

    // Check if the day is within the valid range for the given month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) {
        return false; // Invalid day for the given month
    }

    return true; // Date is valid
}

export function hasOnlyAlphabets(input) {
    // Check if the input contains any numbers or special characters
    if (/\d/.test(input) || /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/]/.test(input)) {
        return false;
    }
    return true;
}

export function hasFieldLength(input, fieldLength, hasFixedLength) {
    // Check if the field is of fixed length or variable
    if (hasFixedLength) {
        // Check if the input is of the given fixed length
        if (input.length !== fieldLength) {
            return false;
        }
    }
    else {
        // Check if the input length is within the field's max length
        if (input.length > fieldLength) {
            return false;
        }
    }
    return true;
}

export function hasOnlyDigits(input) {
    if (!/^\d+$/.test(input)) {
        return false;
    }
    return true;
}

export function isValidEmailFormat(input) {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(input)) {
        return false;
    }
    return true;
}

export function toTitle(input) {
    const words = input.split(' ');
    const capitalizedWords = words.map((word) => {
        if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    });
    const formattedName = capitalizedWords.join(' ');
    return formattedName;
}

export function isValidPhoneNumberFormat(input) {
    if (input.length !== 10 || !/^\d+$/.test(input)) {
        return false;
    }
    return true;
}