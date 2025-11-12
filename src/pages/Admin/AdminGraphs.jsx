import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import "./AdminGraphs.css";

const COLORS = ["#1a237e", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da"];

export default function AdminGraphs() {
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [ordersGrowth, setOrdersGrowth] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());

      const productSales = {};
      const productRevenue = {};
      const dateRevenue = {};
      const dateOrders = {};
      const paymentMethods = {};

      data.forEach((order) => {
        const orderDate = new Date(order.createdAt?.seconds * 1000).toLocaleDateString();

        if (!dateRevenue[orderDate]) dateRevenue[orderDate] = 0;
        if (!dateOrders[orderDate]) dateOrders[orderDate] = 0;
        dateRevenue[orderDate] += order.total || 0;
        dateOrders[orderDate] += 1;

        order.items.forEach((item) => {
          if (!productSales[item.name]) productSales[item.name] = 0;
          if (!productRevenue[item.name]) productRevenue[item.name] = 0;
          productSales[item.name] += item.quantity;
          productRevenue[item.name] += item.price * item.quantity;
        });

        if (!paymentMethods[order.paymentMethod]) paymentMethods[order.paymentMethod] = 0;
        paymentMethods[order.paymentMethod] += order.total || 0;
      });

      setSalesData(
        Object.keys(productSales).map((name) => ({
          name,
          quantity: productSales[name],
        }))
      );

      setRevenueData(
        Object.keys(productRevenue).map((name) => ({
          name,
          value: productRevenue[name],
        }))
      );

      setTrendData(
        Object.keys(dateRevenue).map((date) => ({
          date,
          revenue: dateRevenue[date],
        }))
      );

      setOrdersGrowth(
        Object.keys(dateOrders).map((date) => ({
          date,
          orders: dateOrders[date],
        }))
      );

      setPaymentData(
        Object.keys(paymentMethods).map((method) => ({
          name: method,
          value: paymentMethods[method],
        }))
      );

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="loading">Loading analytics...</p>;

  return (
    <div className="admin-graphs">
      <h2 className="dashboard-title">📊 Sales & Revenue Analytics</h2>

      {/* Bar Chart - Top Selling Products */}
      <div className="chart-card">
        <h3>Top Selling Products (by Quantity)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#3949ab" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Revenue per Product */}
      <div className="chart-card">
        <h3>Revenue Distribution by Product</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={revenueData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {revenueData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Revenue Trends */}
      <div className="chart-card">
        <h3>Revenue Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#1a237e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart - Orders Growth */}
      <div className="chart-card">
        <h3>Orders Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={ordersGrowth}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#5c6bc0" fill="#9fa8da" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart - Payment Methods */}
      <div className="chart-card">
        <h3>Payment Methods Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={paymentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={5}
            >
              {paymentData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
