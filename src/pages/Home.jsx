import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    // <ProtectedComponent>
    //   <div className="flex flex-col items-center justify-center h-screen text-center">
    //     <h1 className="text-4xl font-bold text-blue-700 mb-6">
    //       Welcome to Our Multi-Service Platform
    //     </h1>
    //     <p className="text-gray-600 mb-6">
    //       Buy, Sell, Exchange, Donate, and Offer Services in one place.
    //     </p>
    //     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    //       <Link
    //         to="/sell"
    //         className="bg-blue-500 text-white px-6 py-3 rounded-lg"
    //       >
    //         Sell Items
    //       </Link>
    //       <Link
    //         to="/exchange"
    //         className="bg-green-500 text-white px-6 py-3 rounded-lg"
    //       >
    //         Exchange Goods
    //       </Link>
    //       <Link
    //         to="/donate"
    //         className="bg-yellow-500 text-white px-6 py-3 rounded-lg"
    //       >
    //         Donate
    //       </Link>
    //       <Link
    //         to="/freelance"
    //         className="bg-purple-500 text-white px-6 py-3 rounded-lg"
    //       >
    //         Freelance Services
    //       </Link>
    //       <Link
    //         to="/transport"
    //         className="bg-red-500 text-white px-6 py-3 rounded-lg"
    //       >
    //         Transport Services
    //       </Link>
    //     </div>
    //   </div>
    // </ProtectedComponent>
    <div className="flex flex-col items-center justify-center h-screen text-center mx-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Welcome to Our Multi-Service Platform
      </h1>
      <p className="text-gray-600 mb-6">
        Buy, Sell, Exchange, Donate, and Offer Services in one place.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          to="/sell"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Sell Items
        </Link>
        <Link
          to="/exchange"
          className="bg-green-500 text-white px-6 py-3 rounded-lg"
        >
          Exchange Goods
        </Link>
        <Link
          to="/donate"
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg"
        >
          Donate
        </Link>
        <Link
          to="/freelance"
          className="bg-purple-500 text-white px-6 py-3 rounded-lg"
        >
          Freelance Services
        </Link>
        <Link
          to="/transport"
          className="bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Transport Services
        </Link>
      </div>
    </div>
  );
};

export default Home;
