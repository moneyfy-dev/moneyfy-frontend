export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
    // Validar longitud entre 8 y 40 caracteres
    if (password.length < 8 || password.length > 40) return false;
    
    // Validar que contenga al menos:
    const hasNumber = /[0-9]/.test(password);         // un número
    const hasLower = /[a-z]/.test(password);         // una minúscula
    const hasUpper = /[A-Z]/.test(password);         // una mayúscula
    
    return hasNumber && hasLower && hasUpper;
};

export const getPasswordErrors = (password: string): string[] => {
    // Solo obtenemos los errores si validatePassword falla
    if (!validatePassword(password)) {
        const errors = [];
        if (password.length < 8) {
            errors.push('mínimo 8 caracteres');
        }
        if (password.length > 40) {
            errors.push('máximo 40 caracteres');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('un número');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('una letra minúscula');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('una letra mayúscula');
        }
        return errors;
    }
    return [];
};

export const validateName = (name: string): boolean => {
    const trimmedName = name.trim();
    // Permite letras, espacios y acentos. Mínimo 2 caracteres.
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,}$/;
    return nameRegex.test(trimmedName) && trimmedName.length >= 2;
};

export const sanitizeName = (name: string): string => {
    // Elimina espacios múltiples y espacios al inicio/final
    return name.trim().replace(/\s+/g, ' ');
};

export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+56[98]\d{8}$/;
    return phoneRegex.test(phone.trim());
};

export const validateAddress = (address: string): boolean => {
    const addressRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s,.]+$/;
    return addressRegex.test(address.trim());
};

export const validateRUT = (rut: string): boolean => {
    // Eliminar puntos y guión del RUT
    rut = rut.replace(/\./g, '').replace('-', '');

    // Validar formato
    if (!/^0*(\d{1,3}(\.?\d{3})*)-?[\dkK]$/.test(rut)) {
        return false;
    }

    // Obtener dígitos y dígito verificador
    const rutDigits = rut.slice(0, -1);
    const dv = rut.slice(-1).toLowerCase();

    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;

    for (let i = rutDigits.length - 1; i >= 0; i--) {
        sum += parseInt(rutDigits[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDV = 11 - (sum % 11);
    const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'k' : expectedDV.toString();

    // Comparar dígito verificador calculado con el proporcionado
    return calculatedDV === dv;
};

export const validatePPU = (ppu: string): boolean => {
    // Limpiamos y convertimos a minúsculas para la validación
    ppu = ppu.trim().toLowerCase();
    
    // Validar longitud (5 o 6 caracteres)
    if (![5, 6].includes(ppu.length)) return false;

    // Contadores para letras, números y consonantes
    const counts = {
        letters: ppu.match(/[a-z]/g)?.length || 0,
        numbers: ppu.match(/[0-9]/g)?.length || 0,
        consonants: ppu.match(/[bcdfghjklmnpqrstvwxyz]/g)?.length || 0
    };

    // Patentes de 5 caracteres (motos)
    if (ppu.length === 5) {
        return (
            (counts.letters === 3 && counts.numbers === 2) || // Formato AAA11
            (counts.letters === 2 && counts.numbers === 3)    // Formato AA111
        );
    }

    // Patentes de 6 caracteres (autos)
    if (ppu.length === 6) {
        return (
            (counts.letters === 2 && counts.numbers === 4) || // Formato AA1111
            (counts.consonants === 4 && counts.numbers === 2) // Formato BBBB11
        );
    }

    return false;
};

export const validateBankAccount = (accountNumber: string): boolean => {
    // Eliminar espacios en blanco
    const cleanAccount = accountNumber.trim();
    
    // Validar que:
    // - Solo contenga números
    // - Tenga entre 7 y 16 dígitos
    const bankAccountRegex = /^\d{7,16}$/;
    
    return bankAccountRegex.test(cleanAccount);
};

    