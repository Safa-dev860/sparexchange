const DashboardNav = ({ activeNav, setActiveNav }) => {
  return (
    <div className="mb-6">
      <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-sm font-medium">
        <li
          className={`cursor-pointer ${
            activeNav === "Overview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveNav("Overview")}
        >
          Overview
        </li>
        <li
          className={`cursor-pointer ${
            activeNav === "Analytics"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveNav("Analytics")}
        >
          Analytics
        </li>
        <li
          className={`cursor-pointer ${
            activeNav === "Reports"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveNav("Reports")}
        >
          Reports
        </li>
        <li
          className={`cursor-pointer ${
            activeNav === "Notifications"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveNav("Notifications")}
        >
          Notifications
        </li>
      </ul>
    </div>
  );
};
export default DashboardNav;
