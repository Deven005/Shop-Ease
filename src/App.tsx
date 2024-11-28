import { useState } from "react";
import "./App.css";
import { useStoreRehydrated } from "easy-peasy";
import { useStoreActions, useStoreState } from "./hooks/hooks";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const isRehydrated = useStoreRehydrated();

  // const cart = useStoreState((state) => state.product.cart);

  const [isCartVisible, setCartVisible] = useState(false);
  const toggleCart = () => setCartVisible(!isCartVisible);

  return isRehydrated ? (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">ShopEase</h1>
        </div>
      </header>

      <ProductList />

      {isCartVisible && <Cart />}
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
