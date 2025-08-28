export const PRODUCTS = [
  {
    id: "ebook-1",
    name: "Ebook: Jurus Dagang Digital",
    price: 50000,
    description: "Ebook PDF berisi strategi praktis jualan online.",
    file: "/digital/sample.txt"
  },
  {
    id: "preset-1",
    name: "Preset Lightroom Premium",
    price: 35000,
    description: "Preset siap pakai untuk mobile & desktop.",
    file: "/digital/sample.txt"
  }
];

export function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}
