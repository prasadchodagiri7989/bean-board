import type { InventoryItem, Table, Sale, Order } from './types';
import { subDays } from 'date-fns';

export const MOCK_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  status: 'Free',
  orderId: null,
}));

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'coffee-beans-1', name: 'Espresso Beans', stock: 100, cost: 10, price: 3.5, isMenuItem: true, lowStockThreshold: 20
  },
  {
    id: 'milk-1', name: 'Whole Milk', stock: 50, cost: 2, price: 0.5, isMenuItem: false, lowStockThreshold: 10
  },
  {
    id: 'pastry-1', name: 'Croissant', stock: 30, cost: 1, price: 3, isMenuItem: true, lowStockThreshold: 5
  },
  {
    id: 'pastry-2', name: 'Muffin', stock: 25, cost: 1.2, price: 3.25, isMenuItem: true, lowStockThreshold: 5
  },
  {
    id: 'syrup-1', name: 'Vanilla Syrup', stock: 20, cost: 5, price: 0.75, isMenuItem: false, lowStockThreshold: 5
  },
  {
    id: 'tea-1', name: 'Green Tea', stock: 80, cost: 8, price: 2.5, isMenuItem: true, lowStockThreshold: 15
  },
  {
    id: 'coffee-beans-2', name: 'Decaf Beans', stock: 50, cost: 12, price: 3.5, isMenuItem: true, lowStockThreshold: 10
  },
   {
    id: 'sandwich-1', name: 'Turkey Sandwich', stock: 15, cost: 3.5, price: 8.5, isMenuItem: true, lowStockThreshold: 5
  }
];

const generateMockOrder = (id: string, items: {itemId: string; quantity: number}[]): Order => {
    const orderItems = items.map(item => {
        const invItem = MOCK_INVENTORY.find(i => i.id === item.itemId)!;
        return {
            itemId: invItem.id,
            name: invItem.name,
            quantity: item.quantity,
            price: invItem.price,
            served: true
        };
    });
    const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { id, items: orderItems, total, createdAt: new Date() };
};

export const MOCK_SALES: Sale[] = [
    {
        id: 'sale-1',
        order: generateMockOrder('order-1', [{ itemId: 'coffee-beans-1', quantity: 2 }, { itemId: 'pastry-1', quantity: 1 }]),
        date: subDays(new Date(), 1),
        totalRevenue: 10,
        totalCost: 4.5,
        profit: 5.5
    },
    {
        id: 'sale-2',
        order: generateMockOrder('order-2', [{ itemId: 'tea-1', quantity: 1 }, { itemId: 'pastry-2', quantity: 1 }]),
        date: subDays(new Date(), 2),
        totalRevenue: 5.75,
        totalCost: 1.8,
        profit: 3.95
    },
    {
        id: 'sale-3',
        order: generateMockOrder('order-3', [{ itemId: 'sandwich-1', quantity: 1 }]),
        date: subDays(new Date(), 1),
        totalRevenue: 8.5,
        totalCost: 3.5,
        profit: 5
    },
    {
        id: 'sale-4',
        order: generateMockOrder('order-4', [{ itemId: 'coffee-beans-1', quantity: 5 }, { itemId: 'pastry-1', quantity: 3 }]),
        date: subDays(new Date(), 3),
        totalRevenue: 26.5,
        totalCost: 11.5,
        profit: 15
    },
    {
        id: 'sale-5',
        order: generateMockOrder('order-5', [{ itemId: 'coffee-beans-2', quantity: 2 }]),
        date: subDays(new Date(), 4),
        totalRevenue: 7,
        totalCost: 3,
        profit: 4
    }
];
