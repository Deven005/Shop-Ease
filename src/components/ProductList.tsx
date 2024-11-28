import { useEffect, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";
import { Product } from "../Store/models/productModel";

const ProductList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { fetchAndAddProducts, addToCart, updateQuantity, removeFromCart } =
    useStoreActions((actions) => actions.product);
  const { products, cart } = useStoreState((state) => state.product);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAndAddProducts(page).finally(() => setLoading(false));
  }, [page, fetchAndAddProducts]);

  // Infinite scroll logic using IntersectionObserver
  useEffect(() => {
    const lastProductElement = document.querySelector("#last-product");

    if (!lastProductElement) return;

    const loadMoreProducts = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // Load next page when bottom of list is reached
      }
    };

    observer.current = new IntersectionObserver(loadMoreProducts, {
      rootMargin: "100px", // Trigger load more when 100px before last product
    });

    if (lastProductElement) {
      observer.current.observe(lastProductElement);
    }

    return () => {
      if (observer.current && lastProductElement) {
        observer.current.unobserve(lastProductElement); // Cleanup observer on unmount
      }
    };
  }, [products]);
  // Check if product is in cart
  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId);
  };

  // Get the cart item for a product
  const getCartItem = (productId: number) => {
    return cart.find((item) => item.id === productId);
  };

  // Handle adding/removing quantity
  const handleQuantityChange = (productId: number, action: string) => {
    const cartItem = getCartItem(productId);
    if (action === "increment") {
      updateQuantity({
        productId,
        quantity: cartItem ? cartItem.quantity + 1 : 1,
      });
    } else if (action === "decrement" && cartItem!.quantity > 1) {
      updateQuantity({ productId, quantity: cartItem!.quantity - 1 });
    } else if (cartItem?.quantity === 1) {
      removeFromCart(productId); // Remove item if quantity is 1 and decrement is clicked
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const cartItem = getCartItem(product.id);
          return (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <p className="font-bold text-lg">${product.price}</p>

              {/* If the product is in the cart, show the quantity control */}
              {isInCart(product.id) ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, "decrement")
                    }
                    className="btn btn-sm btn-secondary"
                  >
                    -
                  </button>
                  <span>{cartItem?.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, "increment")
                    }
                    className="btn btn-sm btn-secondary"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product.id)}
                  className="btn btn-sm btn-primary mt-4"
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Placeholder for infinite scroll */}
      <div id="last-product"></div>
    </div>
  );
};

export default ProductList;
