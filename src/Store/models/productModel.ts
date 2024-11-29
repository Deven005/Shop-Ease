import { Thunk, Action, thunk, action } from "easy-peasy";

// Define the Product interface
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

// Define the CartItem interface (which extends Product to include quantity)
export interface CartItem extends Product {
  quantity: number;
}

interface FetchProductModel {
  page: number;
  search: string;
}

// Define the ProductModel interface for easy-peasy store model
export interface ProductModel {
  products: Product[]; // List of available products
  cart: CartItem[]; // Cart items (with quantity)

  // Thunks to fetch products
  fetchAndAddProducts: Thunk<ProductModel, FetchProductModel>;

  // Actions
  addProduct: Action<ProductModel, Product>; // Add a product to the products list
  addToCart: Action<ProductModel, number>; // Add a product to the cart by product ID
  removeFromCart: Action<ProductModel, number>; // Remove a product from the cart by product ID
  updateQuantity: Action<ProductModel, { productId: number; quantity: number }>; // Update product quantity in the cart
}

// Store Model implementation
export const productModel: ProductModel = {
  products: [], // Initial list of products
  cart: [], // Initial cart (empty)

  // Fetch products from API and add to store
  fetchAndAddProducts: thunk(async (actions, payload, { getState }) => {
    const { page } = payload;
    const response = await fetch(
      `https://fakestoreapi.com/products?limit=${
        page * 5
      }&sort=desc&page=${page}`
    );
    const data: Product[] = await response.json();
    // data.forEach((product) => actions.addProduct(product)); // Add each product to the store
    data.forEach((product) => {
      // Check if the product is already in the store
      const isProductExists = getState().products.some(
        (existingProduct) => existingProduct.id === product.id
      );

      if (!isProductExists) {
        // Add the product only if it doesn't exist in the store
        actions.addProduct(product);
      }
    });
  }),

  // Action to add a product to the products list
  addProduct: action((state, product) => {
    state.products.push(product); // Simply push new product to the list
  }),

  // Action to add a product to the cart, or increase its quantity if already in the cart
  addToCart: action((state, productId) => {
    // Check if product is already in the cart
    const cartItem = state.cart.find((item) => item.id === productId);
    if (cartItem) {
      // If the product is already in the cart, increase quantity by 1
      cartItem.quantity += 1;
    } else {
      // Otherwise, find the product from the product list and add it to the cart with quantity 1
      const product = state.products.find((prod) => prod.id === productId);
      if (product) {
        state.cart.push({ ...product, quantity: 1 }); // Add new product to the cart
      }
    }
  }),

  // Action to remove a product from the cart based on its ID
  removeFromCart: action((state, productId) => {
    // Filter out the product from the cart
    state.cart = state.cart.filter((item) => item.id !== productId);
  }),

  // Action to update the quantity of a product in the cart
  updateQuantity: action((state, { productId, quantity }) => {
    const cartItem = state.cart.find((item) => item.id === productId);
    if (cartItem) {
      if (quantity === 0) {
        // If quantity is set to 0, remove the product from the cart
        state.cart = state.cart.filter((item) => item.id !== productId);
      } else {
        // Update the quantity if greater than 0
        cartItem.quantity = quantity;
      }
    }
  }),
};
