import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-950 text-white py-8 mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight">SpareXchange</h2>
            <p className="text-sm mt-3 text-gray-300 max-w-xs mx-auto md:mx-0">
              Your platform to Sell, Exchange, Donate, Freelance & Transport.
            </p>
          </div>

          {/* Center Links */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-100">Quick Links</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-300 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  to="/exchange"
                  className="text-gray-300 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Exchange
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  className="text-gray-300 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  to="/freelance"
                  className="text-gray-300 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Freelance
                </Link>
              </li>
              <li>
                <Link
                  to="/transport"
                  className="text-gray-300 hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Transport
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section (Social Media) */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-100">Follow Us</h2>
            <div className="flex space-x-6 mt-4 justify-center md:justify-start">
              <a
                href="/"
                className="text-gray-300 hover:text-green-300 text-2xl transition-colors duration-200 hover:scale-110"
              >
                <FaFacebook />
              </a>
              <a
                href="/"
                className="text-gray-300 hover:text-green-300 text-2xl transition-colors duration-200 hover:scale-110"
              >
                <FaTwitter />
              </a>
              <a
                href="/"
                className="text-gray-300 hover:text-green-300 text-2xl transition-colors duration-200 hover:scale-110"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-green-800/50 pt-4 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} SpareXchange. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
