
'use client';

import { useState, useContext, useMemo, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MinusCircle, Trash2, Loader2, FileText, UtensilsCrossed } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Table } from '@/lib/types';
import { generateBillAction } from '@/actions/generate-bill';
import { useToast } from '@/hooks/use-toast';
import { BillDialog } from './bill-dialog';

interface OrderModalProps {
  table: Table | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ table: initialTable, isOpen, onClose }: OrderModalProps) {
  const context = useContext(AppContext);
  const [isBillLoading, startBillTransition] = useTransition();
  const [billDetails, setBillDetails] = useState<string | null>(null);
  const [isBillDialogOpen, setBillDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!context) {
    throw new Error('OrderModal must be used within an AppContextProvider');
  }

  const { state, createOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity, markItemAsServed, clearTable } = context;

  const table = useMemo(() => {
    if (!initialTable) return null;
    return state.tables.find(t => t.id === initialTable.id) ?? null;
  }, [initialTable, state.tables]);

  const order = useMemo(() => {
    if (table && table.orderId) {
      return state.orders.find((o) => o.id === table.orderId);
    }
    return null;
  }, [table, state.orders]);

  const menuItems = useMemo(() => state.inventory.filter((item) => item.isMenuItem), [state.inventory]);

  const handleCreateOrder = () => {
    if (table) {
      createOrder(table.id);
    }
  };
  
  const handleGenerateBill = () => {
    if (!order) return;
    
    startBillTransition(async () => {
      const orderItemsForAI = order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const result = await generateBillAction({
        orderItems: orderItemsForAI,
        salesTaxRate: 8.5,
      });

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Bill',
          description: result.error,
        });
      } else {
        setBillDetails(result.billDetails);
        setBillDialogOpen(true);
      }
    });
  };

  const handleClearTable = () => {
    if (table) {
      clearTable(table.id);
      onClose();
      toast({
        title: `Table ${table.id} Cleared`,
        description: 'The table is now available and stock has been updated.',
      });
    }
  };

  const orderTotal = useMemo(() => {
    return order?.items.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  }, [order]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Table {table?.id}</DialogTitle>
            <DialogDescription>
              {order ? 'Manage the current order.' : 'Create a new order for this table.'}
            </DialogDescription>
          </DialogHeader>

          {!order ? (
            <div className="flex-1 flex items-center justify-center">
              <Button size="lg" onClick={handleCreateOrder}>
                <PlusCircle className="mr-2" />
                Create New Order
              </Button>
            </div>
          ) : (
            <div className="flex-1 grid md:grid-cols-2 gap-6 overflow-hidden">
              <div className="flex flex-col gap-4 overflow-hidden">
                <h3 className="font-semibold">Current Order</h3>
                <ScrollArea className="flex-1 border rounded-lg">
                  <ShadcnTable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.length > 0 ? (
                        order.items.map((item) => (
                          <TableRow key={item.itemId} className={item.served ? 'bg-green-100 dark:bg-green-900/30' : ''}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{item.name}</span>
                                {item.served && <Badge variant="outline" className="w-fit text-accent-foreground bg-accent border-accent">Served</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(order.id, item.itemId, item.quantity - 1)}>
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(order.id, item.itemId, item.quantity + 1)}>
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                               <div className="flex justify-end gap-1">
                                {!item.served && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent-foreground hover:bg-accent" onClick={() => markItemAsServed(order.id, item.itemId)}>
                                        <UtensilsCrossed className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItemFromOrder(order.id, item.itemId)}>
                                <Trash2 className="h-4 w-4" />
                                </Button>
                               </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24">
                            No items in this order yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </ShadcnTable>
                </ScrollArea>
                <div className="flex justify-between items-center font-bold text-lg p-2 rounded-lg bg-muted">
                    <span>Total</span>
                    <span className="font-mono">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 overflow-hidden">
                <h3 className="font-semibold">Menu Items</h3>
                <ScrollArea className="flex-1 border rounded-lg p-2">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {menuItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-start text-left justify-between"
                        onClick={() => addItemToOrder(order.id, item.id)}
                        disabled={item.stock <= 0}
                      >
                        <div className="w-full">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <Badge variant={item.stock > 0 ? 'secondary' : 'destructive'} className="mt-2 text-xs">
                          {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <Separator />
          <DialogFooter className="flex-wrap">
            <Button variant="destructive-outline" onClick={handleClearTable} disabled={!order}>
              <Trash2 className="mr-2" /> Clear Table & Finalize
            </Button>
            <div className="flex-1" />
            <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleGenerateBill} disabled={isBillLoading || !order || order.items.length === 0}>
                {isBillLoading ? <Loader2 className="mr-2 animate-spin" /> : <FileText className="mr-2" />}
                Generate Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <BillDialog
        isOpen={isBillDialogOpen}
        onClose={() => setBillDialogOpen(false)}
        billDetails={billDetails}
        tableId={table?.id ?? null}
      />
    </>
  );
}
