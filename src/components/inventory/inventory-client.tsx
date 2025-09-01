'use client';
import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { InventoryTable } from './inventory-table';
import { PlusCircle } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { InventoryDialog } from './inventory-dialog';
import type { InventoryItem } from '@/lib/types';

export function InventoryClient() {
  const context = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  if (!context) {
    return <div>Loading inventory...</div>;
  }
  
  const { state } = context;

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddItem}>
          <PlusCircle className="mr-2" />
          Add New Item
        </Button>
      </div>
      <InventoryTable items={state.inventory} onEdit={handleEditItem} />
      <InventoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={editingItem}
      />
    </div>
  );
}
