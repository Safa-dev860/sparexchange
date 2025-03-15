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
    location = { lat: null, lng: null },
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
    this.location = location;
    this.owner = owner;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(); // Ensure valid Date
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date();
  }

  toFirestore(data = {}) {
    // Ensure createdAt and updatedAt are valid Date objects before calling toISOString
    const validCreatedAt =
      this.createdAt instanceof Date && !isNaN(this.createdAt)
        ? this.createdAt
        : new Date();
    const validUpdatedAt =
      this.updatedAt instanceof Date && !isNaN(this.updatedAt)
        ? this.updatedAt
        : new Date();

    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      images: this.images,
      category: this.category,
      location: {
        lat: this.location.lat,
        lng: this.location.lng,
      },
      owner: this.owner,
      createdAt: validCreatedAt.toISOString(),
      updatedAt: validUpdatedAt.toISOString(),
      ...data,
    };
  }

  static fromFirestore(data) {
    // Handle Firestore Timestamp conversion
    const createdAt =
      data.createdAt && typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now());
    const updatedAt =
      data.updatedAt && typeof data.updatedAt.toDate === "function"
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now());

    return new Product({
      ...data,
      location: data.location || { lat: null, lng: null },
      createdAt,
      updatedAt,
    });
  }

  getFormattedDate(date) {
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString()
      : "";
  }
}
