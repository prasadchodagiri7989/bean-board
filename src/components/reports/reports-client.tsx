'use client';
import { useContext, useMemo } from 'react';
import { AppContext } from '@/context/AppContext';
import { subDays, format, startOfDay } from 'date-fns';
import KpiCards from './kpi-cards';
import SalesChart from './sales-chart';
import TopItemsChart from './top-items-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsClient() {
  const context = useContext(AppContext);

  if (!context) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
        </div>
    );
  }

  const { state } = context;

  const {
    totalRevenue,
    totalProfit,
    totalOrders,
    dailySalesData,
    topItemsData,
  } = useMemo(() => {
    const sales = state.sales;
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalRevenue, 0);
    const totalProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);
    const totalOrders = sales.length;

    // Process daily sales for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
    const dailySalesMap = new Map<string, { revenue: number, profit: number }>();
    
    last7Days.forEach(day => {
        dailySalesMap.set(format(startOfDay(day), 'yyyy-MM-dd'), { revenue: 0, profit: 0 });
    });

    sales.forEach(sale => {
        const dayKey = format(startOfDay(sale.date), 'yyyy-MM-dd');
        if (dailySalesMap.has(dayKey)) {
            const current = dailySalesMap.get(dayKey)!;
            dailySalesMap.set(dayKey, {
                revenue: current.revenue + sale.totalRevenue,
                profit: current.profit + sale.profit
            });
        }
    });
    
    const dailySalesData = Array.from(dailySalesMap.entries())
        .map(([date, data]) => ({
            date: format(new Date(date), 'MMM d'),
            revenue: data.revenue,
            profit: data.profit
        }))
        .reverse();

    // Process top selling items
    const itemCounts = new Map<string, { name: string, quantity: number, revenue: number }>();
    sales.forEach(sale => {
      sale.order.items.forEach(item => {
        const current = itemCounts.get(item.itemId) || { name: item.name, quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += item.quantity * item.price;
        itemCounts.set(item.itemId, current);
      });
    });

    const topItemsData = Array.from(itemCounts.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((item, index) => ({...item, fill: `hsl(var(--chart-${index + 1}))`}));


    return { totalRevenue, totalProfit, totalOrders, dailySalesData, topItemsData };
  }, [state.sales]);

  return (
    <div className="space-y-6">
      <KpiCards
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        totalOrders={totalOrders}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <SalesChart data={dailySalesData} />
            </CardContent>
        </Card>
        <Card className="col-span-3">
             <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
                <TopItemsChart data={topItemsData} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
