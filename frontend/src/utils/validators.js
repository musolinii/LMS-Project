export function validateEmail(email) {
  if (!email) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Invalid email address';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateCourseForm(course) {
  const errors = {};

  const titleErr = validateRequired(course.title, 'Title');
  if (titleErr) errors.title = titleErr;

  const descErr = validateRequired(course.description, 'Description');
  if (descErr) errors.description = descErr;

  if (course.price !== undefined && course.price !== null) {
    if (isNaN(course.price) || Number(course.price) < 0) {
      errors.price = 'Price must be a non-negative number';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
