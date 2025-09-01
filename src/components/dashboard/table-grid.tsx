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
  const [tableCount, setTableCount] = useState<number>(10);

  const handleTableCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTableCount(Number(e.target.value));
  };

  if (!context) {
    return (
      <>
        <div className="mb-4">
          <label className="mr-2">Number of tables:</label>
          <select value={tableCount} onChange={handleTableCountChange} className="border rounded px-2 py-1">
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: tableCount }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </>
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
      <div className="mb-4">
        <label className="mr-2">Number of tables:</label>
        <select value={tableCount} onChange={handleTableCountChange} className="border rounded px-2 py-1">
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
        {state.tables.slice(0, Math.min(tableCount, state.tables.length)).map((table) => (
          <TableCard key={table.id} table={table} onClick={() => handleTableClick(table)} />
        ))}
      </div>
      <OrderModal table={selectedTable} isOpen={!!selectedTable} onClose={handleCloseModal} />
    </>
  );
}
