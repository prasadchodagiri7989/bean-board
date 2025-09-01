export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  cost: number; // cost per unit
  price: number; // selling price per unit
  isMenuItem: boolean; // can be added to an order
  lowStockThreshold: number;
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  served: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

export interface Table {
  id: number;
  status: 'Free' | 'Occupied';
  orderId: string | null;
}

export interface Sale {
  id: string;
  order: Order;
  date: Date;
  totalRevenue: number;
  totalCost: number;
  profit: number;
}
