// Shared client-side validation helpers for the authentication forms.
// These only check the shape of the input; no request is ever made.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getEmailError(value: string): string | undefined {
  const email = value.trim()

  if (!email) {
    return "Enter your email address."
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address."
  }

  return undefined
}

export function getPasswordError(value: string): string | undefined {
  if (!value) {
    return "Enter your password."
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters."
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "Password must include at least one letter and one number."
  }

  return undefined
}
