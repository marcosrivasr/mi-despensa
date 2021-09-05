export function formatPrice(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(number);
}

export function classNames(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
