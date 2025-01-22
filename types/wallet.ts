import type { Profile } from "./profile";

export interface Wallet {
    id: number;
    user_id: string; // UUID as string
    user: Profile;
    coins: number;
    tickets: number;
    balance: number; // Real money (Decimal)
    transactions: Transaction[];
}

export interface Transaction {
    id: number;
    wallet_id: number;
    wallet: Wallet;
    amount: number; // Amount of coins, tickets, or real money
    currency: CurrencyType;
    created_at: Date;
}

export enum CurrencyType {
    coins = "Pièces",
    tickets = "Tickets",
    real_money = "Argent réel"
} 