function validateName(name:string) {
  const namePattern = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9]+$/;

  if (!name) {
    return 'Name is required';
  }

  if (name.length < 5) return 'At least 5 characters';

  if (!namePattern.test(name)) {
    return 'Name can only contain letters and numbers';
  }
}

function validateEmail(value: string) {
  const EMAIL_PATTERN = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!value) return 'Email is required';
  if (!EMAIL_PATTERN.test(value)) return 'Email is not valid';
}

function validatePassword (value: string)  {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'At least 6 characters';
}

export const validatorService = {
  validateName,
  validateEmail,
  validatePassword
}