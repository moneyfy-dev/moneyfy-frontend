export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^[a-zA-Z0-9!$&()=<>;,:._-]{8,40}$/;
    return passwordRegex.test(password);
  };
  
  export const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z]{2,}$/;
    return nameRegex.test(name);
  };