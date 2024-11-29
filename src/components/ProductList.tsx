import { MouseEvent, useEffect, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";
import { Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

const ProductList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search input state
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { fetchAndAddProducts, addToCart, updateQuantity, removeFromCart } =
    useStoreActions((actions) => actions.product);
  const { products, cart } = useStoreState((state) => state.product);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (debouncedSearchTerm) {
        await fetchAndAddProducts({ page: page, search: debouncedSearchTerm });
      } else {
        await fetchAndAddProducts({ page: page, search: "" });
      }
      setLoading(false);
    };
    loadData();
  }, [debouncedSearchTerm, fetchAndAddProducts, page]);

  // Handle change in the search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term
    // delayedQuery(value); // Trigger the debounced API call
  };

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
  const handleQuantityChange = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    productId: number,
    action: string
  ) => {
    e.preventDefault();
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

  const handleAddToCart = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: number
  ) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent routing when "Add to Cart" is clicked
    addToCart(id);
  };

  const handleRemoveFromCart = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: number
  ) => {
    e.preventDefault();
    removeFromCart(id);
  };

  return (
    <div>
      <div className="mb-6">
        {/* Search bar */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">What is your name?</span>
          </div>
          <input
            type="text"
            placeholder="Search product!"
            className="input input-bordered w-full max-w-xs"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const cartItem = getCartItem(product.id);
          return (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              {/* Link to product details page */}
              <Link
                to={`/product/${product.id}`}
                className="block"
                onClick={(e) => e.stopPropagation()} // Prevent triggering "Add to Cart" logic
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover mb-4"
                />
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="font-bold text-lg">${product.price}</p>
              </Link>

              {/* Add to Cart Button or Quantity Controls */}
              {isInCart(product.id) ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) =>
                      handleQuantityChange(e, product.id, "decrement")
                    }
                    className="btn btn-sm btn-secondary"
                  >
                    -
                  </button>
                  <span>{cartItem?.quantity}</span>
                  <button
                    onClick={(e) =>
                      handleQuantityChange(e, product.id, "increment")
                    }
                    className="btn btn-sm btn-secondary"
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => handleRemoveFromCart(e, product.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
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
      {loading && <span className="loading loading-dots loading-lg"></span>}

      {/* Placeholder for infinite scroll */}
      <div id="last-product"></div>
    </div>
  );
};

export default ProductList;
