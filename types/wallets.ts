import type { Profile } from "./profiles";

export interface Wallet {
    id: number;
    user_id: string;
    user: Profile;
    coins: number;
    tickets: number;
    balance: number;
    transactions: Transaction[];
}

export interface Transaction {
    id: number;
    wallet_id: number;
    wallet: Wallet;
    amount: number;
    currency: CurrencyType;
    created_at: Date;
}

export enum CurrencyType {
    coins = "Pièces",
    tickets = "Tickets",
    real_money = "Argent réel"
} 