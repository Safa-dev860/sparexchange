// components/ExchangeCard.js
import { Link } from "react-router-dom";
const ExchangeCard = ({ item }) => {
  return (
    <Link to={`/exchanges/${item.id}`} className="block">
      <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition">
        <img
          src={item.images[0] || "default-image.jpg"}
          alt={item.itemOffered}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-semibold mt-2">{item.itemOffered}</h2>
        <p className="text-gray-600">by {item.owner.name}</p>
        <p className="text-green-700 font-bold">
          Wanted: {item.itemWanted || "Open to offers"}
        </p>
        <p className="text-gray-400 text-sm">Condition: {item.condition}</p>
        <button className="mt-2 bg-green-700 text-white hover:bg-green-800 hover:shadow-md px-4 py-2 rounded-md w-full">
          Make Offer
        </button>
      </div>
    </Link>
  );
};

export default ExchangeCard;
