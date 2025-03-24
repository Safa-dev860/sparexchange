import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice"; // Adjust the path if necessary
import { FaRecycle } from "react-icons/fa"; // Import icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State to manage scrolling
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);

  // Handle scroll and check initial scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Only update isScrolled if the user is on the home page
      if (location.pathname === "/") {
        setIsScrolled(window.scrollY > 0);
      }
    };

    // Check initial scroll position on mount
    handleScroll();

    // Add scroll event listener only on the home page
    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (location.pathname === "/") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [location.pathname]);

  const handleAccountClick = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const handleLogout = () => dispatch(logout());

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/exchange", label: "Exchange" },
    { to: "/donate", label: "Donate" },
    { to: "/freelance", label: "Freelance" },
    { to: "/transport", label: "Transport" },
  ];

  // Determine navbar color
  const navbarColor =
    location.pathname !== "/" || isScrolled ? "bg-[#003837]" : "bg-transparent";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navbarColor} shadow-md`}
      style={{ padding: "1.5rem 0" }} // Increase Navbar size
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Logo with icon */}
        <div className="flex items-center space-x-2">
          <FaRecycle className="text-3xl text-green-400" />
          <h1 className="text-2xl font-bold text-white">SpareXchange</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  location.pathname === item.to
                    ? "bg-green-700 text-white shadow-lg"
                    : `${
                        navbarColor === "bg-[#003837]"
                          ? "text-white hover:bg-green-800 hover:text-white hover:shadow-md"
                          : "text-white hover:bg-green-800 hover:text-white hover:shadow-md"
                      }`
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Account or Authentication Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* Notifications Button */}
              <Link
                to="/notifications"
                className={`p-2 rounded-full transition-all duration-300 ${
                  navbarColor === "bg-[#003837]"
                    ? "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                    : "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </Link>

              {/* Cart Button with Badge */}
              <Link
                to="/shopping-card"
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  navbarColor === "bg-[#003837]"
                    ? "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                    : "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartTotalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartTotalQuantity}
                  </span>
                )}
              </Link>

              {/* Account Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={handleAccountClick}
                  className={`p-1 rounded-full transition-all duration-300 ${
                    navbarColor === "bg-[#003837]"
                      ? "bg-green-700 hover:bg-green-800 hover:shadow-md"
                      : "bg-green-700 hover:bg-green-800 hover:shadow-md"
                  }`}
                >
                  <img
                    src={user.profilePicture}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </button>

                {isAccountOpen && (
                  <div className="absolute top-10 mt-2 right-0 w-48 bg-green-900 text-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <img
                        src={user.profilePicture}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{user.name}</span>
                    </Link>
                    <hr className="my-1 border-green-800" />
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <span>Settings</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <span>Logout</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              {/* Login Button with White Background on Scroll */}
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  navbarColor === "bg-[#003837]"
                    ? "bg-white text-green-950 hover:bg-gray-100 hover:shadow-md"
                    : "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 hover:shadow-md"
                }`}
              >
                Login
              </Link>
              {/* Sign Up Button */}
              <Link
                to="/signup"
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  navbarColor === "bg-[#003837]"
                    ? "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                    : "bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 hover:shadow-md"
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl hover:text-green-400 transition-colors duration-200"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-900 flex flex-col items-center py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1 rounded-full transition-all duration-300 ${
                location.pathname === item.to
                  ? "bg-green-700 text-white shadow-lg"
                  : "text-white hover:bg-green-800 hover:text-white hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex space-x-4">
                {/* Notifications Button */}
                <Link
                  to="/notifications"
                  className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 hover:shadow-md transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </Link>

                {/* Cart Button with Badge */}
                <Link
                  to="/cart"
                  className="relative bg-green-700 text-white p-2 rounded-full hover:bg-green-800 hover:shadow-md transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {cartTotalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartTotalQuantity}
                    </span>
                  )}
                </Link>

                {/* Account Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleAccountClick}
                    className="bg-green-700 text-white p-1 rounded-full hover:bg-green-800 hover:shadow-md transition-all duration-300 relative"
                  >
                    <img
                      src={user.profilePicture}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                </div>
              </div>

              {/* Account Dropdown (Mobile) */}
              {isAccountOpen && (
                <div className="w-full bg-green-900 text-white rounded-lg shadow-lg py-2">
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                    onClick={() => {
                      setIsOpen(false);
                      setIsAccountOpen(false);
                    }}
                  >
                    <img
                      src={user.profilePicture}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{user.name}</span>
                  </Link>
                  <hr className="my-1 border-green-800" />
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                    onClick={() => setIsAccountOpen(false)}
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                    onClick={() => {
                      setIsOpen(false);
                      setIsAccountOpen(false);
                    }}
                  >
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 hover:bg-green-800 transition-colors duration-200"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                      setIsAccountOpen(false);
                    }}
                  >
                    <span>Logout</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {/* Login Button with White Background on Scroll */}
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  navbarColor === "bg-[#003837]"
                    ? "bg-white text-green-950 hover:bg-gray-100 hover:shadow-md"
                    : "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 hover:shadow-md"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              {/* Sign Up Button */}
              <Link
                to="/signup"
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  navbarColor === "bg-[#003837]"
                    ? "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                    : "bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 hover:shadow-md"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
