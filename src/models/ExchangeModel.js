// models/Exchange.js
export class Exchange {
  constructor({
    id = null,
    ownerId = null, // Corrected the typo here
    itemOffered = "",
    itemWanted = "",
    condition = "new",
    location = "",
    images = [],
    owner = { id: null, name: "", email: "", imageUrl: "" },
    createdAt = new Date(),
    updatedAt = new Date(),
    conversations = [],
    status = "open",
    closedAt = null,
    closedBy = null,
    requests = [],
  } = {}) {
    this.id = id;
    this.ownerId = ownerId; // Corrected the typo here
    this.itemOffered = itemOffered;
    this.itemWanted = itemWanted;
    this.condition = condition;
    this.location = location;
    this.images = images;
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.conversations = conversations;
    this.status = status;
    this.closedAt = closedAt;
    this.closedBy = closedBy;
    this.requests = requests;
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
    const validClosedAt =
      this.closedAt instanceof Date && !isNaN(this.closedAt)
        ? this.closedAt
        : null; // Ensure closedAt is null if not a valid date
    return {
      id: this.id,
      ownerId: this.ownerId,
      ...data,
      createdAt: validCreatedAt,
      updatedAt: validUpdatedAt,
      closedAt: validClosedAt,
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
    const closedAt =
      data.closedAt && typeof data.closedAt.toDate === "function"
        ? data.closedAt.toDate()
        : data.closedAt || null;
    return new Exchange({
      ...data,
      ownerId: data.ownerId,
      createdAt,
      updatedAt,
      closedAt,
    });
  }
}
