import { InventoryClient } from '@/components/inventory/inventory-client';

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Inventory Management</h1>
        <p className="text-muted-foreground">
          Track and manage your stock levels.
        </p>
      </header>
      <InventoryClient />
    </div>
  );
}
