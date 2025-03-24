import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaRecycle,
  FaHandsHelping,
  FaExchangeAlt,
  FaShoppingCart,
  FaHandshake,
  FaGift,
  FaTools,
  FaHammer,
  FaTint,
  FaPlug,
  FaUserPlus,
  FaBullhorn,
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaBell,
  FaThumbsUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import spareImage from "../assets/spare.jpg";
import sophieImage from "../assets/sophie.webp"; // Import de l'image Sophie
import minImage from "../assets/min.png"; // Import de l'image min.jpg
import paImage from "../assets/pa.png"; // Import de l'image search.jpg
import chatImage from "../assets/chat.jpg"; // Import de l'image search.jpg
import userImage from "../assets/user.jpg"; //
import user2Image from "../assets/user2.jpg"; //
import user3Image from "../assets/user3.jpg"; //
import { FaComments } from "react-icons/fa";

const Home = () => {
  // Array of hero images
  const heroImages = [spareImage, sophieImage];

  // Array of corresponding texts
  const heroTexts = [
    "SpareXchange: Your Zero-Waste Marketplace",
    "You think it's trash? Think again!",
  ];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0); // Index for the current hero image
  const [currentHeroImage, setCurrentHeroImage] = useState(heroImages[0]); // Current hero image
  const [currentText, setCurrentText] = useState(heroTexts[0]); // Current hero text

  // Function to cycle through hero images and texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // Change image and text every 3 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Update the current hero image and text whenever the index changes
  useEffect(() => {
    setCurrentHeroImage(heroImages[currentHeroIndex]);
    setCurrentText(heroTexts[currentHeroIndex]);
  }, [currentHeroIndex]);

  return (
    <div className="w-full bg-black text-white flex flex-col items-center text-center overflow-hidden">
      <Navbar />

      {/* Hero Section with background image */}
      <div
        className="relative flex flex-col md:flex-row justify-center items-center px-4 sm:px-10"
        style={{
          backgroundImage: `url(${currentHeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh", // Full screen height
          width: "100vw", // Full screen width
          margin: 0, // Remove margins
          padding: 0, // Remove paddings
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black opacity-70"></div>

        <div className="relative z-10 md:w-1/2 text-left px-4 sm:px-0">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mt-10 drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            key={currentText} // Trigger animation on text change
          >
            {currentText}
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-200 mt-4 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Join SpareXchange and give a new life to your unused items while
            contributing to waste reduction. Together, let's create a more
            sustainable future!
          </motion.p>

          <Link
            to="/"
            className="mt-8 inline-block bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-md text-sm sm:text-lg hover:from-green-600 hover:to-green-800 transition-all"
          >
            Join Now
          </Link>
        </div>
      </div>

      {/* About SpareXchange Section */}
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 bg-white text-black">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          About SpareXchange
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl text-center text-sm sm:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          SpareXchange is more than just an exchange platform. It's a vision, a
          commitment to a sustainable future where every item finds a second
          life. We believe in the power of the community to transform waste into
          resources and reduce our environmental impact.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl px-4 sm:px-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="flex flex-col items-center p-6">
            <motion.div
              className="text-6xl text-green-500 mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FaLeaf />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-semibold">
              Sustainability
            </h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              We are committed to promoting sustainable practices for a greener
              future.
            </p>
          </div>

          <div className="flex flex-col items-center p-6">
            <motion.div
              className="text-6xl text-blue-500 mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FaRecycle />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-semibold">Recycling</h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              Give a second life to your items and reduce waste.
            </p>
          </div>

          <div className="flex flex-col items-center p-6">
            <motion.div
              className="text-6xl text-yellow-500 mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FaHandsHelping />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-semibold">Community</h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              An engaged community for a more responsible lifestyle.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Our Concept Section */}
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 bg-white text-black">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Our Concept: Sell, Exchange, Donate, and Services
        </motion.h2>

        <motion.p
          className="mt-4 max-w-2xl text-center text-sm sm:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Discover how SpareXchange revolutionizes the way you manage your
          unused items. Sell, exchange, donate, or find local services in just a
          few clicks!
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 max-w-6xl px-4 sm:px-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Link
            to="/shop"
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center"
          >
            <FaShoppingCart className="text-4xl mb-4 text-gray-800" />
            <h3 className="text-xl font-semibold">Sell</h3>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Sell your unused items and earn money easily.
            </p>
          </Link>

          <Link
            to="/exchange"
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center"
          >
            <FaExchangeAlt className="text-4xl mb-4 text-gray-800" />
            <h3 className="text-xl font-semibold">Exchange</h3>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Exchange your items for what you need.
            </p>
          </Link>

          <Link
            to="/donate"
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center"
          >
            <FaGift className="text-4xl mb-4 text-gray-800" />
            <h3 className="text-xl font-semibold">Donate</h3>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Donate and support your community.
            </p>
          </Link>

          <Link
            to="/freelance"
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center"
          >
            <FaTools className="text-4xl mb-4 text-gray-800" />
            <h3 className="text-xl font-semibold">Services</h3>
            <p className="mt-2 text-gray-700 text-sm text-center">
              Find local services near you.
            </p>
          </Link>
        </motion.div>
      </div>

      {/* Find Professionals Near You Section */}
      <div className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center px-4 sm:px-6 bg-white text-black">
        {/* Image on the left */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          <img
            src={minImage}
            alt="Professionals Near You"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>

        {/* Text on the right */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold drop-shadow-lg text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Find Professionals Near You
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 gap-8 mt-8 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="flex flex-col items-center md:items-start">
              <FaHammer className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">Carpenters</h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Custom furniture creation, repairs, and floor installation. Find
                certified carpenters near you.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaTint className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">Plumbers</h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Emergency repairs, sanitary installations, and bathroom
                renovations. Qualified plumbers at your service.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaPlug className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">
                Electricians
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Electrical installations, compliance, and repairs. Ensure the
                safety of your electrical setup.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create Your Account Section */}
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 bg-[#E0F7FA] text-black">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Create Your Account and Join the Community
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl px-4 sm:px-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <FaUserPlus className="text-6xl mb-4 text-gray-800" />
            <h3 className="text-xl sm:text-2xl font-semibold">
              Free Registration
            </h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              Enjoy quick and easy registration to access all platform features.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <FaBullhorn className="text-6xl mb-4 text-gray-800" />
            <h3 className="text-xl sm:text-2xl font-semibold">
              Personalized Ads
            </h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              Publish your ads and contact other members with ease.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <FaShieldAlt className="text-6xl mb-4 text-gray-800" />
            <h3 className="text-xl sm:text-2xl font-semibold">Secure Space</h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              Manage your personal information securely and confidentially.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Advanced Search Section */}
      <div className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center px-4 sm:px-6 bg-white text-black">
        {/* Image on the left */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          <img
            src={paImage}
            alt="Advanced Search"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>

        {/* Text on the right */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold drop-shadow-lg text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Advanced Search: Find Exactly What You're Looking For
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 gap-8 mt-8 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="flex flex-col items-center md:items-start">
              <FaSearch className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">
                Intuitive Search Bar
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Quickly find what you're looking for with our search bar and
                auto-suggestions.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaFilter className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">
                Search Filters
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Refine your results by category, location, price, condition, and
                more.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaThumbsUp className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">
                Recommendation System
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Receive personalized recommendations based on your interests.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaBell className="text-6xl mb-4 text-gray-800" />
              <h3 className="text-xl sm:text-2xl font-semibold">
                Email Alerts
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Be notified of new listings matching your search criteria.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Seamless Experience Section */}
      <div className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center px-4 sm:px-6 bg-[#E0F7FA] text-black">
        {/* Text on the left */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold drop-shadow-lg text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            Seamless Experience: Chat and Negotiate with Our Instant Messaging
          </motion.h2>

          <motion.p
            className="mt-4 max-w-2xl text-center md:text-left text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Our integrated messaging system allows you to chat in real-time with
            other members, negotiate prices, and finalize exchanges with ease.
            Enjoy a seamless and secure user experience.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 gap-8 mt-8 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="flex flex-col items-center md:items-start">
              <FaComments className="text-5xl mb-4 text-gray-800" />
              <h3 className="text-lg sm:text-xl font-semibold">
                Instant Messaging
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Chat in real-time with sellers or buyers.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaHandshake className="text-5xl mb-4 text-gray-800" />
              <h3 className="text-lg sm:text-xl font-semibold">
                Easy Negotiation
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                Negotiate prices and terms directly via messaging.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <FaShieldAlt className="text-5xl mb-4 text-gray-800" />
              <h3 className="text-lg sm:text-xl font-semibold">
                Secure and Reliable
              </h3>
              <p className="mt-2 text-gray-700 text-sm sm:text-base text-center md:text-left">
                All conversations are encrypted to ensure your privacy.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Image on the right */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          <img
            src={chatImage}
            alt="Instant Messaging"
            className="rounded-lg shadow-lg w-full max-w-lg hover:scale-105 transition-all duration-300"
          />
        </div>
      </div>

      {/* What They Say About Us Section */}
      <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 bg-white text-black">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          What They Say About Us
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-6xl px-4 sm:px-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src={user3Image} // Remplacez par une image de témoignage
              alt="User 1"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-semibold">John Doe</h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              "SpareXchange is amazing! I sold my old furniture and found a
              great plumber. Highly recommended!"
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src={user2Image} // Remplacez par une image de témoignage
              alt="User 2"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-semibold">Jane Smith</h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              "I love how easy it is to exchange items. The community is so
              friendly and helpful."
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <img
              src={userImage} // Remplacez par une image de témoignage
              alt="User 3"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-semibold">Mike Johnson</h3>
            <p className="mt-2 text-gray-700 text-sm sm:text-base text-center">
              "The instant messaging feature is fantastic. I negotiated a great
              deal for my old bike!"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
