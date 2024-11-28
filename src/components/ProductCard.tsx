import React from "react";
import { Product } from "../Store/models/productModel";

interface Props {
  product: Product;
  addToCart: (id: number) => void;
}

const ProductCard: React.FC<Props> = ({ product, addToCart }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={product.image} alt={product.title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p>${product.price.toFixed(2)}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
