import { ShoppingCartItem } from "./ShoppingItemModel";
export class ShoppingCart {
  constructor(items = []) {
    this.items = items.map((item) =>
      item instanceof ShoppingCartItem ? item : new ShoppingCartItem(item)
    );
  }

  addItem(item, buyer = {}) {
    const existingItem = this.items.find(
      (i) => i.id === item.id && i.buyer.id === buyer.id
    );
    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + 1);
    } else {
      const cartItem =
        item instanceof ShoppingCartItem
          ? item
          : new ShoppingCartItem({
              ...item,
              buyer: {
                id: buyer.id || null,
                name: buyer.name || "",
                email: buyer.email || "",
                profileUrl: buyer.profileUrl || "",
              },
            });
      this.items.push(cartItem);
    }
  }

  removeItem(itemId, buyerId) {
    this.items = this.items.filter(
      (item) => !(item.id === itemId && item.buyer.id === buyerId)
    );
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0);
  }

  getBuyerTotal(buyerId) {
    return this.items
      .filter((item) => item.buyer.id === buyerId)
      .reduce((sum, item) => sum + item.getTotalPrice(), 0);
  }

  toFirestore() {
    return {
      items: this.items.map((item) => item.toFirestore()),
      total: this.getTotal(),
    };
  }

  static fromFirestore(data) {
    return new ShoppingCart(
      data.items.map((item) => ShoppingCartItem.fromFirestore(item))
    );
  }
}

// // Updated example usage with your cartItems:
// const initialCartItems = [
//   {
//     id: 1,
//     name: "Low allow beige leather shoes",
//     price: 299,
//     quantity: 1,
//     image: "https://via.placeholder.com/100x100?text=Beige+Shoes",
//     owner: {
//       id: "owner1",
//       name: "John Doe",
//       email: "john@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=John"
//     },
//     buyer: {
//       id: "buyer1",
//       name: "Jane Smith",
//       email: "jane@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=Jane"
//     }
//   },
//   {
//     id: 2,
//     name: "White leather shoes",
//     price: 145,
//     quantity: 1,
//     image: "https://via.placeholder.com/100x100?text=White+Shoes",
//     owner: {
//       id: "owner2",
//       name: "Bob Wilson",
//       email: "bob@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=Bob"
//     },
//     buyer: {
//       id: "buyer1",
//       name: "Jane Smith",
//       email: "jane@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=Jane"
//     }
//   },
//   {
//     id: 3,
//     name: "Green leather shoes",
//     price: 216,
//     quantity: 1,
//     image: "https://via.placeholder.com/100x100?text=Green+Shoes",
//     owner: {
//       id: "owner1",
//       name: "John Doe",
//       email: "john@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=John"
//     },
//     buyer: {
//       id: "buyer2",
//       name: "Mike Johnson",
//       email: "mike@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=Mike"
//     }
//   },
// ];

// // Usage example:
// const cart = new ShoppingCart(initialCartItems);

// // Add a new item with owner and buyer
// cart.addItem(
//   {
//     id: 4,
//     name: "Blue leather shoes",
//     price: 180,
//     quantity: 1,
//     image: "https://via.placeholder.com/100x100?text=Blue+Shoes",
//     owner: {
//       id: "owner3",
//       name: "Alice Brown",
//       email: "alice@example.com",
//       profileUrl: "https://via.placeholder.com/50x50?text=Alice"
//     }
//   },
//   {
//     id: "buyer1",
//     name: "Jane Smith",
//     email: "jane@example.com",
//     profileUrl: "https://via.placeholder.com/50x50?text=Jane"
//   }
// );

// // Get total for a specific buyer
// const buyer1Total = cart.getBuyerTotal("buyer1");
