export interface Wallet {
    totalBalance: number;
    outstandingBalance: number;
    availableBalance: number;
    paymentBalance: number;
  }

  export interface WalletRecord {
    amount: number;
    createdDate: string;
    historicalId: string;
    status: string;
    type: string;
    updatedDate: string;
    walletDetail: any[];
  }

export interface MonthlyCommission {
    transactionId: string;
    approvalDate: string;
    commission: number;
}

export interface MonthlyEarningMonth {
    month: string;
    totalCommission: number;
    totalAmount: number;
    commissions: MonthlyCommission[];
}

export interface MonthlyEarnings {
    months: MonthlyEarningMonth[];
    finalCommissions: number;
    finalAmount: number;
    lastMonth: string;
}
