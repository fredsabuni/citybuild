'use client';

import { 
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PaymentReceiptProps {
  payment: {
    id: string;
    projectName: string;
    recipient: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    dueDate: string;
    processedDate?: string;
    paymentMethod: 'ach' | 'wire' | 'check' | 'credit_card';
    description: string;
    invoiceNumber?: string;
    transactionId?: string;
    fees?: number;
  };
  onClose?: () => void;
}

export function PaymentReceipt({ payment, onClose }: PaymentReceiptProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'ach':
        return 'ACH Transfer';
      case 'wire':
        return 'Wire Transfer';
      case 'check':
        return 'Check';
      case 'credit_card':
        return 'Credit Card';
      default:
        return method;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading receipt for payment:', payment.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Payment Receipt</h2>
              <p className="text-sm text-muted-foreground">#{payment.id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Print Receipt"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Download PDF"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          {payment.status === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    Payment Completed Successfully
                  </div>
                  {payment.processedDate && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Processed on {formatDate(payment.processedDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Company Header */}
          <div className="text-center border-b border-border pb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CityBuild
            </h1>
            <p className="text-muted-foreground">Construction Procurement Platform</p>
            <p className="text-sm text-muted-foreground mt-2">
              123 Construction Ave, Builder City, BC 12345
            </p>
          </div>

          {/* Payment Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono">#{payment.id}</span>
                </div>
                {payment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono">{payment.transactionId}</span>
                  </div>
                )}
                {payment.invoiceNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span>{payment.invoiceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{getPaymentMethodName(payment.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{formatDate(payment.dueDate)}</span>
                </div>
                {payment.processedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processed Date:</span>
                    <span>{formatDate(payment.processedDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Project & Recipient</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground block">Project:</span>
                  <span className="font-medium">{payment.projectName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Recipient:</span>
                  <span className="font-medium">{payment.recipient}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Description:</span>
                  <span>{payment.description}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Amount Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Amount:</span>
                <span className="font-semibold">{formatCurrency(payment.amount)}</span>
              </div>
              {payment.fees && payment.fees > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Processing Fees:</span>
                  <span>{formatCurrency(payment.fees)}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(payment.amount + (payment.fees || 0))}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
            <p>This is an electronic receipt generated by CityBuild.</p>
            <p>For questions about this payment, please contact support@citybuild.com</p>
            <p className="mt-2">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}