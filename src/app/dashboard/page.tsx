'use client'; // Required for charts and interactive elements

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, DollarSign, Award } from 'lucide-react';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart'; // Assuming chart tooltip is used

// Dummy Data - Replace with actual data fetching
const monthlySummaryData = {
  netThisMonth: 1500.75,
  totalExpenses: 2500.25,
  totalIncome: 4000.00,
  bestSavingMonth: 'May 2024',
  tldr: 'Income steady, expenses slightly higher due to unexpected car repair. Still managed to save a decent amount.',
};

const netWorthData = [
  { month: 'Jan', netWorth: 5000 },
  { month: 'Feb', netWorth: 5500 },
  { month: 'Mar', netWorth: 5300 },
  { month: 'Apr', netWorth: 6000 },
  { month: 'May', netWorth: 6800 },
  { month: 'Jun', netWorth: 7200 },
];

const expenseCategoryData = [
  { name: 'Mercado', value: 800, fill: 'hsl(var(--chart-1))' },
  { name: 'Luxos', value: 450, fill: 'hsl(var(--chart-2))' },
  { name: 'Farmácia', value: 150, fill: 'hsl(var(--chart-3))' },
  { name: 'Transporte', value: 300, fill: 'hsl(var(--chart-4))' },
  { name: 'Outros', value: 800.25, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
  }
};


export default function DashboardPage() {
  // TODO: Fetch real data using hooks (e.g., useDashboardData())

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySummaryData.netThisMonth.toFixed(2)}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySummaryData.totalExpenses.toFixed(2)}</div>
             {/* <p className="text-xs text-muted-foreground">+10.5% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySummaryData.totalIncome.toFixed(2)}</div>
            {/* <p className="text-xs text-muted-foreground">+5.2% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Saving Month</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{monthlySummaryData.bestSavingMonth}</Badge>
            {/* <p className="text-xs text-muted-foreground">Achieved R$ XXXX savings</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Net Worth Over Time</CardTitle>
            <CardDescription>Monthly progression of your net worth.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
             <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={netWorthData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                    <ChartTooltip
                       cursor={false}
                       content={<ChartTooltipContent indicator="dot" />}
                     />
                    <Line type="monotone" dataKey="netWorth" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
             <CardDescription>Breakdown of spending this month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center p-0">
             <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                       content={<ChartTooltipContent nameKey="name" hideLabel />}
                     />
                    <Pie
                      data={expenseCategoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={2}
                      labelLine={false}
                    //   label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    //      const RADIAN = Math.PI / 180;
                    //      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    //      const x  = cx + radius * Math.cos(-midAngle * RADIAN);
                    //      const y = cy  + radius * Math.sin(-midAngle * RADIAN);
                    //      return (
                    //        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
                    //        	{`${(percent * 100).toFixed(0)}%`}
                    //        </text>
                    //      );
                    //    }}
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly TL;DR & Full Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
             <CardTitle>Monthly TL;DR</CardTitle>
             <CardDescription>A quick summary of this month's finances.</CardDescription>
            </div>
          <Button variant="outline" onClick={() => alert('Open Full Report Sidebar')}>
             Full Report
           </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{monthlySummaryData.tldr}</p>
        </CardContent>
      </Card>
    </div>
  );
}
