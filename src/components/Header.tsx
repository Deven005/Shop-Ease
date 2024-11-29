import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <h1 className="text-2xl font-bold">
          <Link to="/">ShopEase</Link>
        </h1>

        {/* Navigation Links */}
        <nav className="flex justify-center space-x-4 w-full">
          <Link to="/" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/cart" className="hover:text-gray-400">
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
