import type { Profile } from "./profiles";
import type { Game } from "./games";

export interface Tournament {
    id: number;
    title: string;
    organizer_id: string;
    organizer: Profile;
    prix_entree: number;
    date: Date;
    game_id: number;
    game: Game;
    format: string;
    participants: Participant[];
    reward_type: RewardType;
    reward_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface NewTournament {
    title: string;
    prix_entree: number;
    date: Date;
    game_id: number;
    format: string;
    reward_type: RewardType;
    reward_amount: number;
}

export interface Organizer {
    id: number;
    user_id: string;
    email: string;
    username?: string;
    avatar_url: string;
}

export interface Participant {
    id: number;
    user_id: string;
    username: string;
    avatar_url: string;
}

export enum RewardType {
    coins = "Pièces",
    tickets = "Tickets",
    real_money = "Argent réel"
}

export enum FormatType {
    single_elimination = "Élimination simple",
    double_elimination = "Élimination double",
    free_for_all = "Free for all",
} 