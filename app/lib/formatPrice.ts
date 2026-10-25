/* Catalogue prices: whole euros stay compact; fractional prices keep cents. */
export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
