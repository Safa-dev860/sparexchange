import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const GigDetails = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);

  useEffect(() => {
    // Simulating fetching gig details from an API
    const fetchGigDetails = async () => {
      const data = {
        id,
        title: "Professional Website Development",
        description:
          "I will create a high-quality, responsive website using modern technologies like React, Node.js, and Tailwind CSS.",
        email: "seller@example.com",
        technology: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        deliveryTime: 5,
        images: [
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/400",
        ],
        packages: [
          {
            name: "Basic",
            price: 50,
            details: "A simple 1-page website with responsive design.",
            revisions: 2,
          },
          {
            name: "Standard",
            price: 100,
            details:
              "A 3-page website with basic animations and a contact form.",
            revisions: 4,
          },
          {
            name: "Premium",
            price: 200,
            details:
              "A full-fledged website with API integration and custom UI.",
            revisions: 6,
          },
        ],
      };
      setGig(data);
    };

    fetchGigDetails();
  }, [id]);

  if (!gig) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image Carousel */}
      <div className="overflow-x-auto whitespace-nowrap flex space-x-4 p-4 border-b">
        {gig.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Gig ${index + 1}`}
            className="w-48 h-32 rounded-md object-cover"
          />
        ))}
      </div>

      {/* Gig Info */}
      <h1 className="text-3xl font-bold mt-4">{gig.title}</h1>
      <p className="text-gray-600 mt-2">{gig.description}</p>

      {/* Details Section */}
      <div className="mt-4 space-y-2">
        <p className="text-lg">
          <strong>Email:</strong> {gig.email}
        </p>
        <p className="text-lg">
          <strong>Technology:</strong> {gig.technology.join(", ")}
        </p>
        <p className="text-lg">
          <strong>Delivery Time:</strong> {gig.deliveryTime} days
        </p>
      </div>

      {/* Packages Section */}
      <h2 className="text-2xl font-semibold mt-6">📦 Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {gig.packages.map((pkg, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">{pkg.name}</h3>
            <p className="text-gray-500">{pkg.details}</p>
            <p className="text-blue-600 font-bold text-lg mt-2">${pkg.price}</p>
            <p className="text-gray-400">Revisions: {pkg.revisions}</p>
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700">
              Select {pkg.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GigDetails;
