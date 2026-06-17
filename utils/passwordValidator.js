/**
 * Password validation utility for strong password requirements
 */

const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

/**
 * Validates a password against strong password requirements
 * @param {string} password - The password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
function validatePassword(password) {
    const errors = [];

    if (!password) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    }

    if (!PASSWORD_REQUIREMENTS.hasUppercase.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!PASSWORD_REQUIREMENTS.hasLowercase.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*...)');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

module.exports = { validatePassword, PASSWORD_REQUIREMENTS };
