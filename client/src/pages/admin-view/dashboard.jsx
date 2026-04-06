import StatCard from "@/components/admin-view/stat-card";
import { Card, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { BaggageClaim, FileClock, ListTodo, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalPendingOrders: 0,
    topSellingProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard/get`
        );
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="lg:ml-[260px] mt-[60px]">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        <StatCard
          title={"Total Users"}
          value={stats.totalUsers}
          icon={<UserRound />}
        />
        <StatCard
          title={"Total Products"}
          value={stats.totalProducts}
          icon={<ListTodo />}
        />
        <StatCard
          title={"Total Orders"}
          value={stats.totalOrders}
          icon={<BaggageClaim />}
        />
        <StatCard
          title={"Total Pending Orders"}
          value={stats.totalPendingOrders}
          icon={<FileClock />}
        />
      </div>
      <div className="mb-10">
        <h3 className="font-bold text-lg mb-6">Top Selling Products</h3>
        {stats.topSellingProducts.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {stats.topSellingProducts.map((product, index) => (
              <Card
                key={index}
                className="border border-gray-200 shadow-sm cursor-pointer px-6"
              >
                <div>
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full object-cover"
                  />
                </div>
                <div className="product-details">
                  <CardTitle>{product.productName}</CardTitle>
                  <p className="text-sm mt-2">{product.totalQuantity} units</p>
                </div>
              </Card>
            ))}
          </ul>
        ) : (
          <p>No top-selling products available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
