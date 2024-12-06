export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^[a-zA-Z0-9!$&()=<>;,:._-]{8,40}$/;
    return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
    const trimmedName = name.trim();
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(trimmedName) && trimmedName.length >= 2;
};

export const sanitizeName = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ');
};

export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+56[98]\d{8}$/;
    return phoneRegex.test(phone.trim());
};

export const validateAddress = (address: string): boolean => {
    // Permite letras (mayúsculas y minúsculas), números, espacios, comas y puntos
    const addressRegex = /^[a-zA-Z0-9\s,.]+$/;
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
    const ppuRegex = /^[a-zA-Z0-9]{6}$/;
    return ppuRegex.test(ppu.trim());
};
