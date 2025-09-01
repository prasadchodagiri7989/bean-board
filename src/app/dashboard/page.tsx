'use client';

import { TableGrid } from '@/components/dashboard/table-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your café's tables and orders.
        </p>
      </header>
      <TableGrid />
    </div>
  );
}
