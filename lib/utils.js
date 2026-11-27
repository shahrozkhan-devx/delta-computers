import clsx from "clsx";

export function cn(...classes) {
  return clsx(classes);
}

export function formatPrice(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-PK")}`;
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function whatsappLink(number, text = "") {
  const cleanNumber = String(number || "").replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function discountPercent(price, discount) {
  if (!price || !discount || Number(discount) >= Number(price)) return 0;
  return Math.round(((Number(price) - Number(discount)) / Number(price)) * 100);
}
