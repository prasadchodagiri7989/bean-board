'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KpiCardsProps {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
}

const KpiCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className="text-xs text-muted-foreground flex items-center">
            {changeType === 'increase' ? (
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500"/>
            ) : (
                <ArrowDownRight className="h-4 w-4 mr-1 text-red-500"/>
            )}
          {change} from last month
        </p>
      )}
    </CardContent>
  </Card>
);

export default function KpiCards({
  totalRevenue,
  totalProfit,
  totalOrders,
}: KpiCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={DollarSign}
        change="+20.1%"
        changeType="increase"
      />
      <KpiCard
        title="Total Profit"
        value={`$${totalProfit.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={Package}
        change="+18.3%"
        changeType="increase"
      />
      <KpiCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        icon={ShoppingCart}
        change="-2.5%"
        changeType="decrease"
      />
    </div>
  );
}
