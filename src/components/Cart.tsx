import { useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "../hooks/hooks";
import { CartItem } from "../Store/models/productModel";
import { showToast } from "../Utils/Utils";

const Cart = () => {
  const navigate = useNavigate();

  const cart = useStoreState((state) => state.product.cart);
  const { removeFromCart, updateQuantity } = useStoreActions((actions) => ({
    removeFromCart: actions.product.removeFromCart,
    updateQuantity: actions.product.updateQuantity,
  }));

  const handleOnCheckOutClick = () =>
    showToast("Checkout is coming soon!", "info");

  // Calculate the total amount of all items in the cart
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle increasing quantity of a product
  const handleIncreaseQuantity = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    productId: number
  ) => {
    e.stopPropagation();
    const quantity = getQuantity(productId);
    updateQuantity({ productId, quantity: quantity + 1 });
  };

  // Handle decreasing quantity of a product
  const handleDecreaseQuantity = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    productId: number,
    quantity: number
  ) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeFromCart(productId); // If quantity is 1, remove the item completely
    } else {
      updateQuantity({ productId, quantity: quantity - 1 });
    }
  };

  const handleRemoveFromCart = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    removeFromCart(id);
  };

  // Retrieve the quantity of a product in the cart
  const getQuantity = (productId: number) => {
    const item = cart.find((prod) => prod.id === productId);
    return item ? item.quantity : 0;
  };

  const handleRowClick = (productId: number) => {
    // Navigate to the product details page using product ID
    navigate(`/product/${productId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {/* If cart is empty, show a message and image */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="https://via.placeholder.com/300?text=Cart+Empty"
            alt="Empty Cart"
            className="w-40 h-40 mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-600">
            Your cart is empty
          </h3>
          <p className="text-lg text-gray-500">
            Add some products to your cart to proceed with checkout.
          </p>
        </div>
      ) : (
        <>
          {/* Cart Table */}
          <div className="overflow-x-auto mt-8">
            <table className="table table-zebra w-full">
              {/* Table Header */}
              <thead>
                <tr className="text-center">
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {cart.map((item: CartItem) => (
                  <tr
                    key={item.id}
                    className="text-center cursor-pointer hover:bg-gray-200 transition ease-in-out duration-150"
                    onClick={() => handleRowClick(item.id)}
                  >
                    <td className="flex items-center space-x-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <span>{item.title}</span>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={(e) =>
                            handleDecreaseQuantity(e, item.id, item.quantity)
                          }
                          className="btn btn-xs btn-outline btn-error"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={(e) => handleIncreaseQuantity(e, item.id)}
                          className="btn btn-xs btn-outline btn-success"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={(e) => handleRemoveFromCart(e, item.id)}
                        className="btn btn-xs btn-outline btn-danger"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Amount Section */}
          <div className="mt-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-2xl">Total Amount</h3>
            <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>

          {/* Checkout Button */}
          <div className="mt-6 text-center">
            <button
              className="btn btn-outline btn-primary w-full md:w-auto"
              onClick={handleOnCheckOutClick}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
