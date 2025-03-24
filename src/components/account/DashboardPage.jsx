// // components/NotificationPage.jsx
// import React, { useState } from "react";

// // Correct export syntax - either use 'export default' or 'export const'
// const Dashboard = () => {
//   const exampleNotifications = [
//     {
//       id: "n1",
//       sender: {
//         id: "buyer1",
//         name: "Jane Smith",
//         email: "jane@example.com",
//         profileUrl: "https://via.placeholder.com/50x50?text=Jane",
//       },
//       category: "Footwear",
//       productName: "Low allow beige leather shoes",
//       status: "in_progress",
//     },
//     {
//       id: "n2",
//       sender: {
//         id: "buyer2",
//         name: "Mike Johnson",
//         email: "mike@example.com",
//         profileUrl: "https://via.placeholder.com/50x50?text=Mike",
//       },
//       category: "Footwear",
//       productName: "Green leather shoes",
//       status: "confirmed",
//     },
//   ];

//   const [notifications, setNotifications] = useState(exampleNotifications);
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   const statusStyles = {
//     in_progress: {
//       bg: "bg-blue-100",
//       text: "text-blue-700",
//       border: "border-blue-200",
//     },
//     confirmed: {
//       bg: "bg-green-100",
//       text: "text-green-700",
//       border: "border-green-200",
//     },
//     rejected: {
//       bg: "bg-red-100",
//       text: "text-red-700",
//       border: "border-red-200",
//     },
//   };

//   const updateStatus = (id, newStatus) => {
//     setNotifications((prev) =>
//       prev.map((notif) =>
//         notif.id === id ? { ...notif, status: newStatus } : notif
//       )
//     );
//     setActiveDropdown(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           {/* Header */}
//           <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
//             <h1 className="text-2xl font-bold text-white">Notifications</h1>
//             <p className="text-sm text-blue-100">
//               {notifications.length} new notifications
//             </p>
//           </div>

//           {/* Notification List */}
//           <div className="divide-y divide-gray-200">
//             {notifications.length === 0 ? (
//               <div className="py-12 text-center">
//                 <p className="text-gray-500">No notifications to display</p>
//               </div>
//             ) : (
//               notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
//                 >
//                   <div className="flex items-center space-x-4">
//                     {/* Avatar */}
//                     <div className="flex-shrink-0">
//                       <img
//                         src={notification.sender.profileUrl}
//                         alt={notification.sender.name}
//                         className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
//                       />
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {notification.sender.name}
//                           </p>
//                           <p className="text-xs text-gray-500 truncate">
//                             {notification.sender.email}
//                           </p>
//                         </div>
//                         <div className="relative">
//                           <button
//                             onClick={() =>
//                               setActiveDropdown(
//                                 activeDropdown === notification.id
//                                   ? null
//                                   : notification.id
//                               )
//                             }
//                             className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
//                           >
//                             <svg
//                               className="h-5 w-5"
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//                             </svg>
//                           </button>
//                           {activeDropdown === notification.id && (
//                             <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
//                               <button
//                                 onClick={() =>
//                                   updateStatus(notification.id, "confirmed")
//                                 }
//                                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
//                               >
//                                 Confirm
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   updateStatus(notification.id, "rejected")
//                                 }
//                                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="mt-1 flex items-center space-x-2">
//                         <span className="text-xs text-gray-600">
//                           {notification.category}
//                         </span>
//                         <span className="text-xs text-gray-400">•</span>
//                         <span className="text-xs text-gray-600 truncate">
//                           {notification.productName}
//                         </span>
//                       </div>
//                       <div className="mt-2">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             statusStyles[notification.status].bg
//                           } ${statusStyles[notification.status].text} ${
//                             statusStyles[notification.status].border
//                           }`}
//                         >
//                           {notification.status.replace("_", " ")}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Footer */}
//           {notifications.length > 0 && (
//             <div className="px-6 py-3 bg-gray-50 text-right">
//               <button
//                 onClick={() => setNotifications([])}
//                 className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Clear All
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard; // Export at the bottom
import React, { useState } from "react";
import Reports from "./Reports";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import Overview from "./Overview";
import DashboardNav from "./DashboardNav";

const Dashboard = () => {
  // State to track the active navigation item
  const [activeNav, setActiveNav] = useState("Overview");

  // Sample data for the dashboard (shared across sections)
  const totalRevenue = 45231.89;
  const subscriptionCount = 2350;
  const salesCount = 12234;
  const activeUsers = 573;

  // Sample data for the bar chart (monthly revenue)
  const chartData = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 4500 },
    { month: "Mar", revenue: 6000 },
    { month: "Apr", revenue: 5500 },
    { month: "May", revenue: 3000 },
    { month: "Jun", revenue: 4000 },
    { month: "Jul", revenue: 3500 },
    { month: "Aug", revenue: 2000 },
    { month: "Sep", revenue: 5000 },
    { month: "Oct", revenue: 4500 },
    { month: "Nov", revenue: 5500 },
    { month: "Dec", revenue: 6000 },
  ];

  // Sample recent sales data
  const recentSales = [
    {
      name: "Olivia Martinez",
      email: "olivia.martinez@email.com",
      amount: 1999.0,
    },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39.0 },
    {
      name: "Isabella Nguyen",
      email: "isabellanguyen@email.com",
      amount: 299.0,
    },
    { name: "William Kim", email: "will@email.com", amount: 99.0 },
    { name: "Sofia Davis", email: "sofia@email.com", amount: 39.0 },
  ];

  // Sample analytics data (for Analytics section)
  const analyticsData = [
    { metric: "User Engagement", value: 85, trend: "+15%" },
    { metric: "Conversion Rate", value: 45, trend: "+8%" },
    { metric: "Bounce Rate", value: 20, trend: "-5%" },
  ];

  // Sample reports data (for Reports section)
  const reportsData = [
    {
      report: "Monthly Sales Report",
      date: "Feb 09, 2023",
      status: "Completed",
    },
    { report: "User Activity Report", date: "Feb 05, 2023", status: "Pending" },
    { report: "Revenue Forecast", date: "Jan 25, 2023", status: "Completed" },
  ];

  // Sample notifications data (for Notifications section)
  const notificationsData = [
    {
      message: "New sale from Olivia Martinez - $1,999.00",
      time: "2 hours ago",
    },
    { message: "Subscription renewal for 50 users", time: "5 hours ago" },
    { message: "System maintenance scheduled for tomorrow", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 md:p-8 mt-24">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Jan 20, 2023 - Feb 09, 2023
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-200">
            Download
          </button>
        </div>
      </div> */}

      {/* Navigation */}
      <DashboardNav activeNav={activeNav} setActiveNav={setActiveNav} />
      {/* Dynamic Content Based on Active Nav */}
      {activeNav === "Overview" && (
        <Overview
          chartData={chartData}
          recentSales={recentSales}
          totalRevenue={totalRevenue}
          subscriptionCount={subscriptionCount}
          salesCount={salesCount}
          activeUsers={activeUsers}
        />
      )}

      {activeNav === "Analytics" && <Analytics analyticsData={analyticsData} />}

      {activeNav === "Reports" && <Reports reportsData={reportsData} />}

      {activeNav === "Notifications" && (
        <Notifications notificationsData={notificationsData} />
      )}
    </div>
  );
};

export default Dashboard;
