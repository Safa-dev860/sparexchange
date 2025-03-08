// models/Transport.js
export class Transport {
  constructor({
    id = null,
    ownerId = null,
    vehicleType = "",
    capacity = 0,
    route = "",
    price = 0,
    images = [],
    owner = { id: null, name: "", email: "", imageUrl: "" },
    createdAt = new Date(),
    updatedAt = new Date(),
    conversations = [],
    status = "active",
    activeUntil = null,
    requests = [],
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.vehicleType = vehicleType;
    this.capacity = capacity;
    this.route = route;
    this.price = price;
    this.images = images;
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.conversations = conversations;
    this.status = status;
    this.activeUntil = activeUntil;
    this.requests = requests;
  }

  toFirestore(data = {}) {
    return {
      id: this.id,
      ...data,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      activeUntil: this.activeUntil ? this.activeUntil.toISOString() : null,
    };
  }

  static fromFirestore(data) {
    return new Transport({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      activeUntil: data.activeUntil ? new Date(data.activeUntil) : null,
    });
  }
}
