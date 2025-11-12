/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions | undefined;

// const DEFAULT_LOCALE = { code: 'en-US', currency: 'USD' };
const DEFAULT_LOCALE = { code: "uz-UZ", currency: "UZS" };

function processInput(inputValue: InputNumberValue): number | null {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export const formatNumber = (num: number) => {
  // Agar raqam butun bo'lsa, kasrni ko'rsatmaymiz
  // Agar kasr bo'lsa, faqat kerakli raqamlarni ko'rsatamiz
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

  return formatted;
};

export function fNumber(inputValue: InputNumberValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(locale.code, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fCurrency(inputValue: InputNumberValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return "Bepul";

  const fm = new Intl.NumberFormat(locale.code, {
    style: "currency",
    currency: locale.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue: InputNumberValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(locale.code, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(number / 100);

  return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(
  inputValue: InputNumberValue,
  options?: Options
) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return "";

  const fm = new Intl.NumberFormat(locale.code, {
    notation: "compact",
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue: InputNumberValue) {
  const number = processInput(inputValue);
  if (number === null || number === 0) return "0 bytes";

  const units = ["bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
  const decimal = 2;
  const baseValue = 1024;

  const index = Math.floor(Math.log(number) / Math.log(baseValue));
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

  return fm;
}

// src/utils/phoneFormat.ts

export function formatUzbekPhoneNumber(phone: string): string {
  if (!phone) return "";

  // faqat raqamlarni olib qolamiz
  const digits = phone.replace(/\D/g, "");

  // agar +998 bilan boshlanmasa boshida qo‘shamiz
  let normalized = digits.startsWith("998") ? digits : `998${digits}`;

  // 12 ta raqamdan oshib ketsa faqat birinchisini olamiz
  normalized = normalized.substring(0, 12);

  // formatlash: +998XX XXX XX XX
  if (normalized.length === 12) {
    return normalized.replace(
      /^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
      "+$1$2 $3 $4 $5"
    );
  }

  return `+${normalized}`; // agar to‘liq emas bo‘lsa
}
