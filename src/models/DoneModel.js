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
    const validCreatedAt =
      this.createdAt instanceof Date && !isNaN(this.createdAt)
        ? this.createdAt
        : new Date();
    const validUpdatedAt =
      this.updatedAt instanceof Date && !isNaN(this.updatedAt)
        ? this.updatedAt
        : new Date();
    const validCompletionDate =
      this.completionDate instanceof Date && !isNaN(this.completionDate)
        ? this.completionDate
        : new Date();
    const validCompletedAt =
      this.completedAt instanceof Date && !isNaN(this.completedAt)
        ? this.completedAt
        : new Date();
    return {
      id: this.id,
      ...data,
      createdAt: validCreatedAt.toISOString(),
      updatedAt: validUpdatedAt.toISOString(),
      completionDate: validCompletionDate.toISOString(),
      completedAt: validCompletedAt.toISOString(),
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
    const completionDate =
      data.completionDate && typeof data.completionDate.toDate === "function"
        ? data.completionDate.toDate()
        : new Date(data.completionDate || Date.now());
    const completedAt =
      data.completedAt && typeof data.completedAt.toDate === "function"
        ? data.completedAt.toDate()
        : new Date(data.completedAt || Date.now());
    return new Done({
      ...data,
      createdAt,
      updatedAt,
      completionDate,
      completedAt,
    });
  }

  getFormattedDate(date) {
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString()
      : "";
  }
}
