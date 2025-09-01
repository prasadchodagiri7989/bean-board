'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';
import { Card } from '../ui/card';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onEdit }: InventoryTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">On Menu</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isLowStock = item.stock <= item.lowStockThreshold;
            return (
              <TableRow key={item.id} className={isLowStock ? 'bg-destructive/10' : ''}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-center">
                    {isLowStock ? (
                        <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                        <Badge variant="outline" className="text-black border-accent">In Stock</Badge>
                    )}
                </TableCell>
                <TableCell className="text-right font-mono">{item.stock}</TableCell>
                <TableCell className="text-right font-mono">Rs {item.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">Rs {item.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={item.isMenuItem ? 'default' : 'secondary'}>
                    {item.isMenuItem ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
