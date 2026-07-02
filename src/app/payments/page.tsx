"use client";

import React, { useState } from "react";
import { useParentAuth } from "@/context/parent-auth-context";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Receipt,
  Download,
  Loader2,
  Laptop,
  Wallet,
  Coins
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockDatabase, Invoice } from "@/data/mockData";
import { USE_MOCK_DATA } from "@/config/app-config";

function PaymentsContent() {
  const { activeChild } = useParentAuth();
  const { toast } = useToast();
  
  // Manage invoices in local state for interactiveness
  const [invoices, setInvoices] = useState<Invoice[]>(USE_MOCK_DATA ? mockDatabase.invoices : []);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"connect_ips" | "esewa" | "khalti" | "card">("connect_ips");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Calculate invoice sums
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0);

  const handleOpenCheckout = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsCheckoutOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);

    // Simulate gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update state locally
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          status: "paid" as const,
          datePaid: new Date().toISOString().split("T")[0]
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setIsProcessing(false);
    setIsCheckoutOpen(false);
    setSelectedInvoice(null);

    toast({
      title: "Payment Successful",
      description: `Invoice ${selectedInvoice.id} of NPR ${selectedInvoice.amount.toLocaleString()} has been paid successfully via ${paymentMethod.replace("_", " ").toUpperCase()}.`,
    });
  };

  const handleDownloadReceipt = (invoiceId: string) => {
    toast({
      title: "Downloading Receipt",
      description: `Receipt PDF for invoice ${invoiceId} is being downloaded... (Demo only)`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Fee & Payment Management
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
          Clear tuition fees securely and download digital tax invoices/receipts.
        </p>
      </div>

      {/* Financial Indicators Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Billed */}
        <Card className="border-gray-300 shadow-sm bg-white">
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Billed</CardTitle>
            <Receipt className="h-4.5 w-4.5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-gray-900">
              NPR {totalInvoiced.toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">Billed this academic year</p>
          </CardContent>
        </Card>

        {/* Total Paid */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-300 shadow-sm">
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-green-700 uppercase tracking-wider">Total Paid</CardTitle>
            <CheckCircle className="h-4.5 w-4.5 text-green-650" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-green-900">
              NPR {totalPaid.toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm text-green-700 font-bold">Settled invoices</p>
          </CardContent>
        </Card>

        {/* Total Balance Due */}
        <Card className={cn(
          "shadow-sm transition-all border",
          totalOutstanding > 0 
            ? "bg-gradient-to-br from-red-50 to-rose-50/60 border-red-300" 
            : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300"
        )}>
          <CardHeader className="pb-1.5 flex flex-row items-center justify-between">
            <CardTitle className={cn(
              "text-xs font-bold uppercase tracking-wider",
              totalOutstanding > 0 ? "text-red-750" : "text-blue-755"
            )}>Balance Outstanding</CardTitle>
            {totalOutstanding > 0 ? <AlertCircle className="h-4.5 w-4.5 text-red-500" /> : <CheckCircle className="h-4.5 w-4.5 text-blue-500" />}
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-extrabold",
              totalOutstanding > 0 ? "text-red-900" : "text-blue-900"
            )}>
              NPR {totalOutstanding.toLocaleString()}
            </div>
            <p className={cn(
              "text-xs sm:text-sm font-bold",
              totalOutstanding > 0 ? "text-red-700" : "text-blue-755"
            )}>
              {totalOutstanding > 0 ? "Due date: June 30, 2026" : "All dues cleared. Excellent!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Ledger Card */}
      <Card className="border-gray-300 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-800">Invoices & Statements Ledger</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Click Pay Now on pending items to settle fees with demo gateways.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50/25 text-xs font-bold text-gray-500 uppercase select-none">
                  <th className="py-3 px-3 sm:px-6">Invoice ID</th>
                  <th className="py-3 px-3 sm:px-6">Description</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Amount (NPR)</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Due Date</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Status</th>
                  <th className="py-3 px-3 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 text-xs sm:text-sm">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-secondary/15 transition-colors">
                    <td className="py-2.5 sm:py-4 px-3 sm:px-6 font-bold text-gray-800">{inv.id}</td>
                    <td className="py-2.5 sm:py-4 px-3 sm:px-6 font-bold text-gray-650">{inv.description}</td>
                    <td className="py-2.5 sm:py-4 px-3 sm:px-6 text-center font-extrabold text-gray-900">
                      NPR {inv.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 sm:py-4 px-3 sm:px-6 text-center text-gray-500 font-bold">
                      {inv.dueDate}
                    </td>
                    <td className="py-2.5 sm:py-4 px-3 sm:px-6 text-center">
                      {inv.status === "paid" ? (
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-300 rounded-full font-bold text-[10px] sm:text-xs">
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border border-red-300 rounded-full font-bold animate-pulse text-[10px] sm:text-xs">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="py-2.5 sm:py-4 px-3 sm:px-6 text-right">
                      {inv.status === "paid" ? (
                        <Button 
                          onClick={() => handleDownloadReceipt(inv.id)}
                          variant="ghost" 
                          size="sm" 
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 rounded-xl flex items-center gap-1 ml-auto border border-transparent hover:border-gray-200"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Receipt</span>
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleOpenCheckout(inv)}
                          size="sm" 
                          className="text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm px-4 ml-auto border border-red-600"
                        >
                          Pay Now
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CHECKOUT SIMULATION DIALOG */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white border border-gray-300">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-gray-800">Secure Fee Checkout</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
              Confirm your transaction details below. Select a local Nepalese payment partner.
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 pt-2">
              {/* Payment Summary Box */}
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-300 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">Fee Description:</span>
                  <span className="font-extrabold text-gray-800">{selectedInvoice.description}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">Invoice Reference:</span>
                  <span className="font-mono text-gray-850 font-extrabold">{selectedInvoice.id}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                  <span className="text-gray-500 font-extrabold">Total Amount:</span>
                  <span className="text-base sm:text-lg font-extrabold text-blue-700">
                    NPR {selectedInvoice.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-gray-800">Choose Gateway Provider</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* ConnectIPS */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("connect_ips")}
                    className={cn(
                      "p-3.5 border-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold",
                      paymentMethod === "connect_ips" 
                        ? "border-blue-500 bg-blue-50/20 text-blue-800 shadow" 
                        : "border-gray-350 hover:bg-secondary/40 text-gray-600"
                    )}
                  >
                    <Laptop className="h-5 w-5 text-blue-600 shrink-0" />
                    <span>connectIPS</span>
                  </button>

                  {/* eSewa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("esewa")}
                    className={cn(
                      "p-3.5 border-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold",
                      paymentMethod === "esewa" 
                        ? "border-green-500 bg-green-50/20 text-green-800 shadow" 
                        : "border-gray-350 hover:bg-secondary/40 text-gray-600"
                    )}
                  >
                    <Wallet className="h-5 w-5 text-green-650 shrink-0" />
                    <span>eSewa Wallet</span>
                  </button>

                  {/* Khalti */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("khalti")}
                    className={cn(
                      "p-3.5 border-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold",
                      paymentMethod === "khalti" 
                        ? "border-purple-500 bg-purple-50/20 text-purple-800 shadow" 
                        : "border-gray-350 hover:bg-secondary/40 text-gray-600"
                    )}
                  >
                    <Coins className="h-5 w-5 text-purple-600 shrink-0" />
                    <span>Khalti Wallet</span>
                  </button>

                  {/* Card payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "p-3.5 border-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold",
                      paymentMethod === "card" 
                        ? "border-indigo-500 bg-indigo-50/20 text-indigo-800 shadow" 
                        : "border-gray-355 hover:bg-secondary/40 text-gray-600"
                    )}
                  >
                    <CreditCard className="h-5 w-5 text-indigo-600 shrink-0" />
                    <span>Credit / Debit</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 flex flex-col sm:flex-row border-t border-gray-300 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
              className="rounded-xl border-gray-300 text-xs sm:text-sm font-bold text-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 px-6 border border-blue-600"
            >
              {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
              {isProcessing ? "Redirecting Gateway..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <PaymentsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
