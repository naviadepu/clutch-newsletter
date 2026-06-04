const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeEmail(value) {
  const cleaned = cleanString(value);
  if (!cleaned) return null;

  const normalized = cleaned.toLowerCase();
  return EMAIL_PATTERN.test(normalized) ? normalized : null;
}

export function isValidEmail(value) {
  return normalizeEmail(value) !== null;
}

export function normalizeUsPhone(value) {
  const cleaned = cleanString(value);
  if (!cleaned) return null;

  const digits = cleaned.replace(/\D/g, "");
  const normalizedDigits =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalizedDigits.length !== 10) return null;

  return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(
    3,
    6
  )}-${normalizedDigits.slice(6)}`;
}

export function isValidUsPhone(value) {
  return normalizeUsPhone(value) !== null;
}
