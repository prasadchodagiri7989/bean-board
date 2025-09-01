'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Table } from '@/lib/types';

interface TableCardProps {
  table: Table;
  onClick: () => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  const isOccupied = table.status === 'Occupied';
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        isOccupied ? 'bg-primary/20 border-primary/50' : 'bg-card'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-headline">
          <span>Table {table.id}</span>
          <span
            className={cn(
              'text-sm font-semibold px-3 py-1 rounded-full',
              isOccupied
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent text-accent-foreground'
            )}
          >
            {table.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center h-20 text-muted-foreground">
            {isOccupied ? (
                <p>Order in progress...</p>
            ) : (
                <p>Click to start a new order.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
