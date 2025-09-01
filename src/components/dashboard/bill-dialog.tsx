'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface BillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  billDetails: string | null;
  tableId: number | null;
}

export function BillDialog({
  isOpen,
  onClose,
  billDetails,
  tableId,
}: BillDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bill for Table {tableId}</DialogTitle>
          <DialogDescription>
            Here is the detailed bill. Please review before proceeding with payment.
          </DialogDescription>
        </DialogHeader>
        {billDetails ? (
          <div className="prose prose-sm dark:prose-invert max-h-[50vh] overflow-y-auto rounded-md border bg-muted/50 p-4 font-mono text-foreground whitespace-pre-wrap">
            {billDetails}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p>No bill to display.</p>
          </div>
        )}
        <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2" />
              Print Bill
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
