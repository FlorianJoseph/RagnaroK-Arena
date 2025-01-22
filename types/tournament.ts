import type { Profile } from "./profile";
import type { Game } from "./game";

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

export interface Participant {
    id: number;
    user_id: string;
    user: Profile;
    tournament_id: number;
    tournament: Tournament;
    score: number;
    created_at: Date;
}


export enum RewardType {
    coins = "Pièces",
    tickets = "Tickets",
    real_money = "Argent réel"
}