// This marks the component as a Client Component in Next.js
"use client";

import { useEffect, useState } from 'react';

// Define a type for our summary data for better code safety
type SummaryData = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function DashboardPage() {
  // State to store the data we fetch from our API
  const [data, setData] = useState<SummaryData | null>(null);
  // State to handle loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when the component loads
  useEffect(() => {
    // Define an async function inside the effect
    const fetchData = async () => {
      try {
        // We use a relative path here, which works for both local and deployed environments
        const response = await fetch('/api/insights/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const summaryData: SummaryData = await response.json();
        setData(summaryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array [] means this effect runs once on mount

  // Render a loading message
  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  // Render an error message if the fetch failed
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the dashboard with the fetched data
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Xeno Insights Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Total Customers</h2>
          <p style={{ fontSize: '2rem' }}>{data?.totalCustomers}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Total Orders</h2>
          <p style={{ fontSize: '2rem' }}>{data?.totalOrders}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Total Revenue</h2>
          <p style={{ fontSize: '2rem' }}>₹{data?.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </main>
  );
}