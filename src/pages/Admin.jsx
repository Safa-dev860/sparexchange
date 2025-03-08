import React, { useState } from "react";
import Reports from "../components/account/Reports";
import Analytics from "../components/account/Analytics";
import Notifications from "../components/account/Notifications";
import Overview from "../components/account/Overview";
import DashboardNav from "../components/account/DashboardNav";

const AdminPage = () => {
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
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 md:p-8">
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

export default AdminPage;
