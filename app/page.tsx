// Client Component for interactivity
"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, ShoppingCart, DollarSign } from 'lucide-react';

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

type MonthlySale = {
  month: string;
  totalSales: number;
};

// --- Main Dashboard Page Component ---
export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [summaryRes, customersRes, monthlySalesRes] = await Promise.all([
          fetch('/api/insights/summary'),
          fetch('/api/insights/top-customers'),
          fetch('/api/insights/monthly-sales'),
        ]);
        if (!summaryRes.ok || !customersRes.ok || !monthlySalesRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const summaryData = await summaryRes.json();
        const topCustomersData = await customersRes.json();
        const monthlySalesData = await monthlySalesRes.json();

        setSummary(summaryData);
        setTopCustomers(topCustomersData);
        setMonthlySales(monthlySalesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">A quick overview of your store's performance.</p>
      </header>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(summary?.totalRevenue ?? 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary?.totalCustomers ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary?.totalOrders ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sales Analytics Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                  <Line type="monotone" dataKey="totalSales" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Customers Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">₹{customer.totalSpent.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}