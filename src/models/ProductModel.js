// models/Product.js
export class Product {
  constructor({
    id = null,
    ownerId = null,
    name = "",
    price = 0,
    description = "",
    images = [],
    category = "",
    owner = { id: null, name: "", email: "", imageUrl: "" },
    createdAt = new Date(),
    updatedAt = new Date(),
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.price = price;
    this.description = description;
    this.images = images;
    this.category = category;
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore(data = {}) {
    // Merge the instance properties with any additional data
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      images: this.images,
      category: this.category,
      owner: this.owner,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      ...data, // Allow overriding with passed-in data
    };
  }

  static fromFirestore(data) {
    return new Product({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  getFormattedDate(date) {
    return date instanceof Date ? date.toLocaleDateString() : "";
  }
}
