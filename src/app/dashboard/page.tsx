
'use client'; // Required for charts and interactive elements

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts'; // Import Tooltip directly from recharts
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, DollarSign, Award } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart'; // ChartContainer is still useful


// Dummy Data - Replace with actual data fetching (e.g., from global state/context)
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

// Simplified chart config, as Tooltip content is handled differently now
const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
  }
};


// Custom Tooltip Content for Charts (Optional but recommended for styling)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Access the full data point payload
    const value = payload[0].value;
    const name = payload[0].name; // 'netWorth' or category name

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        {label && <p className="font-medium mb-1">{label}</p>}
        {name === 'netWorth' && <p className="text-muted-foreground">{`Net Worth: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>}
        {data.name && data.value && <p className="text-muted-foreground">{`${data.name}: R$ ${data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>}

      </div>
    );
  }

  return null;
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
            <div className="text-2xl font-bold">R$ {monthlySummaryData.netThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySummaryData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
             {/* <p className="text-xs text-muted-foreground">+10.5% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" /> {/* Use specific color */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySummaryData.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
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
          <CardContent className="h-[300px] p-0 pl-2 pr-4 pb-2"> {/* Added padding for axis labels */}
             <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={netWorthData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }} // Adjusted margins
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} domain={['dataMin - 500', 'dataMax + 500']}/>
                     {/* Use RechartsTooltip directly */}
                    <RechartsTooltip
                       cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }}
                       content={<CustomTooltip />} // Use custom styled tooltip
                     />
                    <Line type="monotone" dataKey="netWorth" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'hsl(var(--background))', stroke: 'hsl(var(--chart-1))' }}/>
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
                    {/* Use RechartsTooltip directly */}
                    <RechartsTooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                      content={<CustomTooltip />} // Use custom styled tooltip
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
                      // Removed inline label rendering for cleaner look
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="hsl(var(--background))" strokeWidth={1}/> // Added stroke for separation
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={40} iconSize={10} />
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
          <Button variant="outline" onClick={() => alert('Open Full Report Sidebar - Functionality Pending')}>
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
