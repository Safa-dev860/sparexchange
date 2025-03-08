// models/Done.js
export class Done {
  constructor({
    id = null,
    ownerId = null,
    doneTitle = "",
    completionDate = null,
    remarks = "",
    proofImages = [],
    owner = { id: null, name: "", email: "", imageUrl: "" },
    createdAt = new Date(),
    updatedAt = new Date(),
    conversations = [],
    status = "inprogress",
    completedAt = null,
    completedBy = null,
  } = {}) {
    this.id = id;
    this.ownerId = ownerId;
    this.doneTitle = doneTitle;
    this.completionDate = completionDate;
    this.remarks = remarks;
    this.proofImages = proofImages;
    this.owner = owner;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.conversations = conversations;
    this.status = status;
    this.completedAt = completedAt;
    this.completedBy = completedBy;
  }

  toFirestore(data = {}) {
    return {
      id: this.id,
      ...data,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      completionDate: this.completionDate
        ? this.completionDate.toISOString()
        : null,
      completedAt: this.completedAt ? this.completedAt.toISOString() : null,
    };
  }

  static fromFirestore(data) {
    return new Done({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      completionDate: data.completionDate
        ? new Date(data.completionDate)
        : null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    });
  }
}
