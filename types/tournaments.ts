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
    participants: Participant[];
    reward_type: RewardType;
    reward_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface NewTournament extends Omit<Tournament, 'id' | 'organizer' | 'organizer_id' | 'game' | 'participants' | 'created_at' | 'updated_at'> {
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