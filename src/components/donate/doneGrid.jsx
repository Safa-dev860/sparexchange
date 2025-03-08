import DoneCard from "./DoneCard";

const DoneGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {items.length > 0 ? (
        items.map((item) => <DoneCard key={item.id} item={item} />)
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No items found.
        </p>
      )}
    </div>
  );
};
export default DoneGrid;
