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
  // Print only the bill content
  const handlePrint = () => {
    const printContents = document.getElementById('bill-print-content');
    if (!printContents) return window.print();
    const printWindow = window.open('', '', 'height=600,width=400');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Bill Receipt</title>');
      printWindow.document.write('<style>body{font-family:monospace;white-space:pre;} pre{font-size:16px;}</style>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(printContents.outerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

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
          <pre id="bill-print-content" className="max-h-[50vh] overflow-y-auto rounded-md border bg-muted/50 p-4 font-mono text-foreground whitespace-pre-wrap">
            {billDetails}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p>No bill to display.</p>
          </div>
        )}
        <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2" />
              Print Bill
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
