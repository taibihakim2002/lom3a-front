export default function formatPrice(amount, currency = "دج") {
  if (isNaN(amount)) return "0 " + currency;

  return `${Number(amount)} ${currency}`;
}
