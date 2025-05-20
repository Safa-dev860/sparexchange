import React, { useState } from "react";
import DashboardNav from "../account/DashboardNav";
import Overview from "../account/Overview";
import Notifications from "../account/Notifications";
import Analytics from "../account/Analytics";
import Reports from "../account/Reports";

const ClientDashbord = () => {
  // Regular dashboard data
  const [activeNav, setActiveNav] = useState("Overview");

  const totalRevenue = 45231.89;
  const subscriptionCount = 2350;
  const salesCount = 12234;
  const activeUsers = 573;

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

  const analyticsData = [
    { metric: "User Engagement", value: 85, trend: "+15%" },
    { metric: "Conversion Rate", value: 45, trend: "+8%" },
    { metric: "Bounce Rate", value: 20, trend: "-5%" },
  ];

  const reportsData = [
    {
      report: "Monthly Sales Report",
      date: "Feb 09, 2023",
      status: "Completed",
    },
    { report: "User Activity Report", date: "Feb 05, 2023", status: "Pending" },
    { report: "Revenue Forecast", date: "Jan 25, 2023", status: "Completed" },
  ];

  const notificationsData = [
    {
      message: "New sale from Olivia Martinez - $1,999.00",
      time: "2 hours ago",
    },
    { message: "Subscription renewal for 50 users", time: "5 hours ago" },
    { message: "System maintenance scheduled for tomorrow", time: "1 day ago" },
  ];
  return (
    <>
      <DashboardNav activeNav={activeNav} setActiveNav={setActiveNav} />
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
    </>
  );
};

export default ClientDashbord;
