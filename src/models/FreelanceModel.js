// models/Freelance.js
export class Freelance {
  constructor({
    id = null,
    ownerId = null,
    gigTitle = "",
    description = "",
    category = "",
    packages = [
      {
        title: "basic",
        description: "",
        price: 0,
        revisions: 0,
        deliveryTime: 0,
      },
      {
        title: "standard",
        description: "",
        price: 0,
        revisions: 0,
        deliveryTime: 0,
      },
      {
        title: "premium",
        description: "",
        price: 0,
        revisions: 0,
        deliveryTime: 0,
      },
    ],
    technologies = [],
    images = [],
    freelancer = { id: null, name: "", email: "", imageUrl: "" },
    createdAt = new Date(),
    updatedAt = new Date(),
    conversations = [],
    status = "active",
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.gigTitle = gigTitle;
    this.description = description;
    this.category = category;
    this.packages = packages;
    this.technologies = technologies;
    this.images = images;
    this.freelancer = freelancer;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.conversations = conversations;
    this.status = status;
  }

  toFirestore(data = {}) {
    return {
      id: this.id,
      ...data,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  static fromFirestore(data) {
    return new Freelance({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}
