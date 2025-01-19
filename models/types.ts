// Profile
export interface Profile {
    id: number;
    user_id: string; // UUID as string
    email: string;
    username?: string;
    full_name?: string;
    website?: string;
    created_at: Date;
    updated_at: Date;
    wallet: Wallet[];
    participant: Participant[];
    members: Member[];
    tournament: Tournament[];
}

// Wallet
export interface Wallet {
    id: number;
    user_id: string; // UUID as string
    user: Profile;
    coins: number;
    tickets: number;
    balance: number; // Real money (Decimal)
    transactions: Transaction[];
}

// Transaction
export interface Transaction {
    id: number;
    wallet_id: number;
    wallet: Wallet;
    amount: number; // Amount of coins, tickets, or real money
    currency: CurrencyType;
    created_at: Date;
}

// Clan
export interface Clan {
    id: number;
    name: string;
    members: Member[];
    created_at: Date;
    updated_at: Date;
}

// Member
export interface Member {
    id: number;
    clan_id: number;
    clan: Clan;
    user_id: string; // UUID as string
    user: Profile;
}

// Game
export interface Game {
    id: number;
    nom: string;
    categorie: CategoryType;
    tournament: Tournament[];
}

// Tournament
export interface Tournament {
    id: number;
    title: string;
    organizer_id: string;
    organizer: Profile;
    prix_entree: number;
    date: Date;
    game_id: number;
    game: Game;
    participants: Participant[];
    reward_type: RewardType;
    reward_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface NewTournament extends Omit<Tournament, 'id' | 'organizer' | 'organizer_id' | 'game' | 'participants' | 'created_at' | 'updated_at'> {
}

// Participant
export interface Participant {
    id: number;
    user_id: string;
    user: Profile;
    tournament_id: number;
    tournament: Tournament;
    score: number;
    created_at: Date;
}

// Enums
export enum CurrencyType {
    coins = "Pièces",
    tickets = "Tickets",
    real_money = "Argent réel"
}

export enum RewardType {
    coins = "Pièces",
    tickets = "Tickets",
    real_money = "Argent réel"
}

export enum CategoryType {
    action = "Action",
    aventure = "Aventure",
    fps = "FPS",
    rpg = "RPG",
    strategie = "Stratégie",
    sport = "Sport",
    party_games = "Party Games",
    simulation = "Simulation",
    autre = "Autre"
}
