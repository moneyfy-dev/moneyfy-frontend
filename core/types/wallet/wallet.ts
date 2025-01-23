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
