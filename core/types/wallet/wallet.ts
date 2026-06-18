export interface Wallet {
    totalBalance: number;
    outstandingBalance: number;
    availableBalance: number;
    paymentBalance: number;
  }

export interface PaymentAccount {
    rut: string;
    holderName: string;
    email: string;
    bank: string;
    accountType: string;
    accountNumber: string;
}

export interface Payment {
    paymentId: string;
    userId: string;
    account: PaymentAccount | null;
    payment: number;
    voucher: string;
    transactionIds: string[];
    createdDate: string;
    updatedDate: string;
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

export interface WeeklyCommission {
    transactionId: string;
    commission: number;
}

export interface WeeklyEarningDay {
    date: string;
    totalCommission: number;
    totalAmount: number;
    commissions: WeeklyCommission[];
}

export interface WeeklyEarnings {
    days: WeeklyEarningDay[];
    finalCommissions: number;
    finalAmount: number;
    lastDay: string;
}

export interface MonthlyCommission {
    transactionId: string;
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
