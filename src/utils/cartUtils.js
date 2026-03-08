export const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];




  const existingProduct = cart.find(
    (item) =>
      item.id === product.id &&
      item.type === product.type &&
      item.category === product.category
  );




  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }




  localStorage.setItem("cart", JSON.stringify(cart));
};
