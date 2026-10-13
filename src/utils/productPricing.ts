export function productPrice(grams: number, pricePerGram: number) {
  const gold = Math.round(grams * pricePerGram);
  const workmanship = Math.round(gold * 0.049);
  const fees = Math.round(gold * 0.15);
  return { gold, workmanship, fees, total: gold + workmanship + fees };
}
