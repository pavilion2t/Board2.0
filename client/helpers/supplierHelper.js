export function getName(suppliers, supplierId) {
  try {
    return suppliers[supplierId].name;
  } catch (e) {
    return "Supplier data not exist";
  }
}

export function getMargin(cost, price) {
  if (!cost || !price) {
    return '';
  }

  return ((1 - (cost / price)) * 100).toFixed(2);
}
