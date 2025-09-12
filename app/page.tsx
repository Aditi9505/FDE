// We need to check the user's session, so this remains a Client Component
"use client";

import { useEffect, useState } from 'react';
// Note: In a real app, you would handle authentication properly with NextAuth.js
// For this demo, we are keeping the data fetching public.

// --- Type Definitions ---
type SummaryData = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalSpent: number;
};

// --- SVG Icon Components ---
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 01-3 5.197" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const RevenueIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
  </svg>
);

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="bg-gray-700 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  </div>
);

// --- Main Dashboard Page Component ---
export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [summaryRes, customersRes] = await Promise.all([
          fetch('/api/insights/summary'),
          fetch('/api/insights/top-customers'),
        ]);
        if (!summaryRes.ok || !customersRes.ok) throw new Error('Failed to fetch dashboard data');

        const summaryData = await summaryRes.json();
        const topCustomersData = await customersRes.json();

        setSummary(summaryData);
        setTopCustomers(topCustomersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Xeno Insights Dashboard</h1>
        <p className="text-gray-400">Welcome to your Shopify data overview.</p>
      </header>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Customers" value={summary?.totalCustomers ?? 0} icon={<UsersIcon />} />
        <StatCard title="Total Orders" value={summary?.totalOrders ?? 0} icon={<OrdersIcon />} />
        <StatCard title="Total Revenue" value={`₹${(summary?.totalRevenue ?? 0).toFixed(2)}`} icon={<RevenueIcon />} />
      </div>

      {/* Top Customers Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Top 5 Customers by Spend</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.length > 0 ? (
                topCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-4">{customer.firstName} {customer.lastName}</td>
                    <td className="p-4 text-gray-400">{customer.email}</td>
                    <td className="p-4 text-right font-mono">₹{customer.totalSpent.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">No customer data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}