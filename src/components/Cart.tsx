import React from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";

const Cart = () => {
  const cart = useStoreState((state) => state.product.cart);
  const { removeFromCart, updateQuantity, addToCart } = useStoreActions(
    (actions) => ({
      removeFromCart: actions.product.removeFromCart,
      updateQuantity: actions.product.updateQuantity,
      addToCart: actions.product.addToCart,
    })
  );

  // Calculate the total amount of all items in the cart
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleIncreaseQuantity = (productId: number) => {
    updateQuantity({ productId, quantity: getQuantity(productId) + 1 });
  };

  const handleDecreaseQuantity = (productId: number, quantity: number) => {
    if (quantity === 1) {
      removeFromCart(productId); // If quantity is 1, remove the item completely
    } else {
      updateQuantity({ productId, quantity: quantity - 1 });
    }
  };

  const getQuantity = (productId: number) => {
    const item = cart.find((prod) => prod.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="cart">
      {/* Render Cart Items */}
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <span>{item.title}</span>
          <span>{item.price}</span>
          <span>Quantity: {item.quantity}</span>
          <button
            onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
          >
            -
          </button>
          <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}

      <div className="total">
        <span>Total: ${totalAmount}</span>
      </div>
    </div>
  );
};

export default Cart;
