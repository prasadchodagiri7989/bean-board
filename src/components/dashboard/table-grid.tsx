'use client';
import { useContext, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { TableCard } from './table-card';
import { OrderModal } from './order-modal';
import type { Table } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function TableGrid() {
  const context = useContext(AppContext);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  if (!context) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
            ))}
        </div>
    );
  }

  const { state } = context;

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleCloseModal = () => {
    setSelectedTable(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
        {state.tables.map((table) => (
          <TableCard key={table.id} table={table} onClick={() => handleTableClick(table)} />
        ))}
      </div>
      <OrderModal table={selectedTable} isOpen={!!selectedTable} onClose={handleCloseModal} />
    </>
  );
}
