// models/Freelance.js
export class Freelance {
  constructor({
    id = null,
    ownerId = null,
    gigTitle = "",
    description = "",
    category = "",
    packages = [],
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
      ...data,
      createdAt: validCreatedAt.toISOString(),
      updatedAt: validUpdatedAt.toISOString(),
    };
  }

  static fromFirestore(data) {
    const createdAt =
      data.createdAt && typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now());
    const updatedAt =
      data.updatedAt && typeof data.updatedAt.toDate === "function"
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now());

    return new Freelance({
      ...data,
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
