import { useParams } from "react-router-dom";
import { useStoreState } from "../hooks/hooks";
import { useStoreActions } from "../hooks/hooks";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from the URL
  const productId = parseInt(id!); // Convert ID to an integer

  const product = useStoreState((state) =>
    state.product.products.find((prod) => prod.id === productId)
  );
  const { addToCart, updateQuantity, removeFromCart } = useStoreActions(
    (actions) => actions.product
  );

  const cartItem = useStoreState((state) =>
    state.product.cart.find((item) => item.id === productId)
  );

  const handleAddToCart = () => {
    addToCart(product!.id); // Add product to cart by product ID
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity({
        productId: cartItem.id,
        quantity: cartItem.quantity + 1,
      });
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity({
        productId: cartItem.id,
        quantity: cartItem.quantity - 1,
      });
    } else {
      removeFromCart(cartItem!.id); // If quantity is 1, remove item from cart
    }
  };

  const handleRemoveFromCart = () => {
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  };

  // Fallback UI if the product is not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold text-red-600">Product Not Found</h2>
        <p className="text-lg text-gray-500 mt-4">
          Sorry, the product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full sm:max-w-xs md:max-w-md lg:max-w-lg max-h-80 object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between">
          {/* Title and Price */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.title}
          </h1>
          <p className="text-xl text-green-600 font-semibold mb-6">
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={
                    i < Math.floor(product.rating.rate)
                      ? "currentColor"
                      : "none"
                  }
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 17.75l-5.5 3.25 1.5-6.75-5-4.5 6.75-.5 2.25-6 2.25 6 6.75.5-5 4.5 1.5 6.75z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-500">
              {product.rating.count} Reviews
            </span>
          </div>

          {/* Cart Action Section */}
          <div className="mt-6">
            {!cartItem ? (
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full md:w-auto text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex justify-between items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="btn btn-outline btn-error"
                  >
                    -
                  </button>
                  <span className="text-xl">{cartItem.quantity}</span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="btn btn-outline btn-success"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleRemoveFromCart}
                  className="btn btn-outline btn-danger"
                >
                  Remove from Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
