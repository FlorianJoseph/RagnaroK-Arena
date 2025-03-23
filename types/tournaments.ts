import type { Profile } from "./profiles";
import type { Game } from "./games";

export interface Tournament {
    id: number;
    title: string;
    organizer_id: string;
    organizer: Profile;
    entry_fee: number;
    date: Date;
    game_id: number;
    games: Game;
    format: string;
    participants: Participant[];
    reward_type: RewardType;
    reward_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface Match {
    bracket_id?: number;
    winner_id: string | null;
    index: number;
    round: number,
    player1?: Participant;
    player2?: Participant;
}

export interface Bracket {
    id?: number;
    tournament_id: number;
    matches: Match[];
    is_losers_bracket: boolean;
}

export interface NewTournament {
    title: string;
    entry_fee: number;
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
    Pièces = "Pièces",
    Tickets = "Tickets",
    Euros = "Euros"
}

export enum FormatType {
    single_elimination = "Élimination simple",
    double_elimination = "Élimination double",
    free_for_all = "Free for all",
}