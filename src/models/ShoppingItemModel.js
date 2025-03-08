// models/ShoppingCartItem.js
export class ShoppingCartItem {
  constructor({
    id = null,
    name = "",
    price = 0,
    quantity = 1,
    image = "",
    product = null,
    owner = { id: null, name: "", email: "", profileUrl: "" },
    buyer = { id: null, name: "", email: "", profileUrl: "" },
  } = {}) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
    this.product = product ? new Product(product) : null;
    this.owner = {
      id: owner.id,
      name: owner.name || "",
      email: owner.email || "",
      profileUrl: owner.profileUrl || "",
    };
    this.buyer = {
      id: buyer.id,
      name: buyer.name || "",
      email: buyer.email || "",
      profileUrl: buyer.profileUrl || "",
    };
  }

  getTotalPrice() {
    return this.price * this.quantity;
  }

  toFirestore(data = {}) {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      image: this.image,
      product: this.product ? this.product.toFirestore() : null,
      owner: { ...this.owner },
      buyer: { ...this.buyer },
      ...data,
    };
  }

  static fromFirestore(data) {
    return new ShoppingCartItem({
      ...data,
      product: data.product ? Product.fromFirestore(data.product) : null,
      owner: data.owner || { id: null, name: "", email: "", profileUrl: "" },
      buyer: data.buyer || { id: null, name: "", email: "", profileUrl: "" },
    });
  }

  static fromProduct(product, quantity = 1, buyer = {}) {
    return new ShoppingCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image:
        product.images && product.images.length > 0 ? product.images[0] : "",
      product: product,
      owner: product.owner,
      buyer: {
        id: buyer.id || null,
        name: buyer.name || "",
        email: buyer.email || "",
        profileUrl: buyer.profileUrl || "",
      },
    });
  }

  updateQuantity(newQuantity) {
    if (newQuantity >= 0) {
      this.quantity = newQuantity;
    }
    return this;
  }
}
