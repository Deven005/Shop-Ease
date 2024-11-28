import { createStore, persist } from "easy-peasy";
import { productModel } from "./models/productModel";

const store = createStore(
  persist({ product: productModel }, { storage: "localStorage" })
);

export default store;
