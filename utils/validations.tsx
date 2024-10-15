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
