import "./App.css";
import { useStoreRehydrated } from "easy-peasy";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/Header";
import ProductDetails from "./components/ProductDetails";

function App() {
  const isRehydrated = useStoreRehydrated();

  return isRehydrated ? (
    <BrowserRouter>
      <Header />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
