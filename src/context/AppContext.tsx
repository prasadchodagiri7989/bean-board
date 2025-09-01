'use client';

import { createContext, useReducer, type ReactNode } from 'react';
import type { Table, Order, InventoryItem, Sale } from '@/lib/types';
import { MOCK_INVENTORY, MOCK_TABLES, MOCK_SALES } from '@/lib/mock-data';

interface AppState {
  tables: Table[];
  orders: Order[];
  inventory: InventoryItem[];
  sales: Sale[];
}

type Action =
  | { type: 'CREATE_ORDER'; payload: { tableId: number } }
  | { type: 'ADD_ITEM_TO_ORDER'; payload: { orderId: string; itemId: string } }
  | { type: 'REMOVE_ITEM_FROM_ORDER'; payload: { orderId:string; itemId: string } }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { orderId: string; itemId: string; quantity: number } }
  | { type: 'MARK_ITEM_AS_SERVED'; payload: { orderId: string; itemId: string } }
  | { type: 'CLEAR_TABLE'; payload: { tableId: number } }
  | { type: 'ADD_INVENTORY_ITEM'; payload: { item: Omit<InventoryItem, 'id'> } }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: { item: InventoryItem } };

const initialState: AppState = {
  tables: MOCK_TABLES,
  orders: [],
  inventory: MOCK_INVENTORY,
  sales: MOCK_SALES,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'CREATE_ORDER': {
      const { tableId } = action.payload;
      const newOrderId = `order-${Date.now()}`;
      const newOrder: Order = {
        id: newOrderId,
        items: [],
        total: 0,
        createdAt: new Date(),
      };
      return {
        ...state,
        orders: [...state.orders, newOrder],
        tables: state.tables.map((table) =>
          table.id === tableId
            ? { ...table, status: 'Occupied', orderId: newOrderId }
            : table
        ),
      };
    }

    case 'ADD_ITEM_TO_ORDER': {
      const { orderId, itemId } = action.payload;
      const inventoryItem = state.inventory.find((i) => i.id === itemId);
      if (!inventoryItem) return state;

      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return state;
      
      const existingItem = order.items.find((i) => i.itemId === itemId);

      let updatedItems;
      if (existingItem) {
        updatedItems = order.items.map((item) =>
          item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [
          ...order.items,
          { itemId, name: inventoryItem.name, quantity: 1, price: inventoryItem.price, served: false },
        ];
      }

      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, items: updatedItems } : o
        ),
      };
    }
    
    case 'REMOVE_ITEM_FROM_ORDER': {
      const { orderId, itemId } = action.payload;
      return {
        ...state,
        orders: state.orders.map(o => 
          o.id === orderId 
            ? { ...o, items: o.items.filter(item => item.itemId !== itemId) }
            : o
        ),
      };
    }

    case 'UPDATE_ITEM_QUANTITY': {
        const { orderId, itemId, quantity } = action.payload;
        if (quantity <= 0) { // Remove if quantity is 0 or less
            return appReducer(state, { type: 'REMOVE_ITEM_FROM_ORDER', payload: { orderId, itemId } });
        }
        return {
            ...state,
            orders: state.orders.map(o =>
                o.id === orderId
                    ? { ...o, items: o.items.map(item => item.itemId === itemId ? { ...item, quantity } : item) }
                    : o
            ),
        };
    }

    case 'MARK_ITEM_AS_SERVED': {
      const { orderId, itemId } = action.payload;
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === orderId
            ? { ...o, items: o.items.map(item => item.itemId === itemId ? { ...item, served: true } : item) }
            : o
        ),
      };
    }

    case 'CLEAR_TABLE': {
      const { tableId } = action.payload;
      const tableToClear = state.tables.find(t => t.id === tableId);
      if (!tableToClear || !tableToClear.orderId) return state;

      const orderToFinalize = state.orders.find(o => o.id === tableToClear.orderId);
      if (!orderToFinalize) return state;

      // Deduct from inventory
      let updatedInventory = [...state.inventory];
      let totalCost = 0;
      orderToFinalize.items.forEach(orderItem => {
        const inventoryIndex = updatedInventory.findIndex(invItem => invItem.id === orderItem.itemId);
        if (inventoryIndex !== -1) {
          updatedInventory[inventoryIndex] = {
            ...updatedInventory[inventoryIndex],
            stock: updatedInventory[inventoryIndex].stock - orderItem.quantity,
          };
          totalCost += updatedInventory[inventoryIndex].cost * orderItem.quantity;
        }
      });
      
      // Create a sale record
      const totalRevenue = orderToFinalize.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        order: orderToFinalize,
        date: new Date(),
        totalRevenue,
        totalCost,
        profit: totalRevenue - totalCost,
      };

      return {
        ...state,
        inventory: updatedInventory,
        sales: [...state.sales, newSale],
        tables: state.tables.map(t => t.id === tableId ? { ...t, status: 'Free', orderId: null } : t),
        // Optionally remove the order, or keep it for history
        // orders: state.orders.filter(o => o.id !== tableToClear.orderId),
      };
    }

    case 'ADD_INVENTORY_ITEM': {
      const newItem: InventoryItem = {
        ...action.payload.item,
        id: `inv-${Date.now()}`
      };
      return {
        ...state,
        inventory: [...state.inventory, newItem]
      };
    }

    case 'UPDATE_INVENTORY_ITEM': {
      return {
        ...state,
        inventory: state.inventory.map(item => item.id === action.payload.item.id ? action.payload.item : item)
      };
    }

    default:
      return state;
  }
}


export const AppContext = createContext<{
  state: AppState;
  createOrder: (tableId: number) => void;
  addItemToOrder: (orderId: string, itemId: string) => void;
  removeItemFromOrder: (orderId: string, itemId: string) => void;
  updateItemQuantity: (orderId: string, itemId: string, quantity: number) => void;
  markItemAsServed: (orderId: string, itemId: string) => void;
  clearTable: (tableId: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
} | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const createOrder = (tableId: number) => dispatch({ type: 'CREATE_ORDER', payload: { tableId } });
  const addItemToOrder = (orderId: string, itemId: string) => dispatch({ type: 'ADD_ITEM_TO_ORDER', payload: { orderId, itemId } });
  const removeItemFromOrder = (orderId: string, itemId: string) => dispatch({ type: 'REMOVE_ITEM_FROM_ORDER', payload: { orderId, itemId } });
  const updateItemQuantity = (orderId: string, itemId: string, quantity: number) => dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { orderId, itemId, quantity } });
  const markItemAsServed = (orderId: string, itemId: string) => dispatch({ type: 'MARK_ITEM_AS_SERVED', payload: { orderId, itemId } });
  const clearTable = (tableId: number) => dispatch({ type: 'CLEAR_TABLE', payload: { tableId } });
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => dispatch({ type: 'ADD_INVENTORY_ITEM', payload: { item } });
  const updateInventoryItem = (item: InventoryItem) => dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: { item } });

  return (
    <AppContext.Provider
      value={{
        state,
        createOrder,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity,
        markItemAsServed,
        clearTable,
        addInventoryItem,
        updateInventoryItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
