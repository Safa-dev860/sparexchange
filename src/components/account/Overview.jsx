const Overview = ({
  chartData,
  recentSales,
  totalRevenue,
  subscriptionCount,
  salesCount,
  activeUsers,
}) => {
  return (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-white-100 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <span className="text-gray-600 text-sm">DT</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalRevenue} DT</p>
          <p className="text-green-500 text-sm">+20% from last month</p>
        </div>

        {/* Subscriptions */}
        <div className="bg-white-100 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Subscriptions</h2>
            <span className="text-gray-600 text-sm">👤</span>
          </div>
          <p className="text-2xl font-bold mt-2">{subscriptionCount}</p>
          <p className="text-green-500 text-sm">+180% from last month</p>
        </div>

        {/* Sales */}
        <div className="bg-white-100 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sales</h2>
            <span className="text-gray-600 text-sm">📈</span>
          </div>
          <p className="text-2xl font-bold mt-2">{salesCount}</p>
          <p className="text-green-500 text-sm">+12% from last month</p>
        </div>

        {/* Active Now */}
        <div className="bg-white-100 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Now</h2>
            <span className="text-gray-600 text-sm">🔹</span>
          </div>
          <p className="text-2xl font-bold mt-2">{activeUsers}</p>
          <p className="text-green-500 text-sm">+201 since last hour</p>
        </div>
      </div>

      {/* Overview and Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview (Bar Chart) */}
        <div className="bg-white-100 rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            {chartData.map((data) => (
              <div key={data.month} className="text-center w-1/6">
                <div
                  className="bg-blue-500/50 w-8 mx-auto rounded-t"
                  style={{ height: `${(data.revenue / 6000) * 200}px` }} // Scale height relative to max revenue
                ></div>
                <p className="text-xs mt-2">{data.revenue} dt</p>
                <p className="text-xs text-gray-600">{data.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white-100 rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          <p className="text-gray-600 mb-4">You made 265 sales this month.</p>
          {recentSales.map((sale, index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center">
                  {/* Placeholder for avatar - you can use an image or icon library */}
                  <span className="text-white">{sale.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{sale.name}</p>
                  <p className="text-gray-600 text-sm">{sale.email}</p>
                </div>
              </div>
              <p className="text-green-500">+{sale.amount.toFixed(2)} DT</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview;
