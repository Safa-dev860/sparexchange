// models/Exchange.js
export class Exchange {
  constructor({
    id = null,
    onwerId = null,
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
    // Similar structure with all properties
    this.id = id;
    this.ownerId = onwerId;
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
    return {
      id: this.id,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      closedAt: Date.now(),
    };
  }

  static fromFirestore(data) {
    return new Exchange({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      closedAt: data.closedAt ? new Date(data.closedAt) : null,
    });
  }
}
