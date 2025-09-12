// This marks the component as a Client Component in Next.js
"use client";

import { useEffect, useState } from 'react';

// Define types for our data for better code safety
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

export default function DashboardPage() {
  // State for summary data
  const [summary, setSummary] = useState<SummaryData | null>(null);
  // State for top customers data
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  // Combined loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch all data when the component loads
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both sets of data in parallel
        const [summaryRes, customersRes] = await Promise.all([
          fetch('/api/insights/summary'),
          fetch('/api/insights/top-customers')
        ]);

        if (!summaryRes.ok || !customersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const summaryData: SummaryData = await summaryRes.json();
        const topCustomersData: Customer[] = await customersRes.json();

        setSummary(summaryData);
        setTopCustomers(topCustomersData);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []); // The empty array [] means this effect runs once on mount

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'white', backgroundColor: '#111' }}>
      <h1>Xeno Insights Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
          <h2>Total Customers</h2>
          <p style={{ fontSize: '2rem' }}>{summary?.totalCustomers}</p>
        </div>
        <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
          <h2>Total Orders</h2>
          <p style={{ fontSize: '2rem' }}>{summary?.totalOrders}</p>
        </div>
        <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
          <h2>Total Revenue</h2>
          <p style={{ fontSize: '2rem' }}>₹{summary?.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Top Customers Table */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Top 5 Customers by Spend</h2>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Email</th>
              <th style={{ border: '1px solid #444', padding: '8px', textAlign: 'left' }}>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map(customer => (
              <tr key={customer.id}>
                <td style={{ border: '1px solid #444', padding: '8px' }}>{customer.firstName} {customer.lastName}</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>{customer.email}</td>
                <td style={{ border: '1px solid #444', padding: '8px' }}>₹{customer.totalSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}