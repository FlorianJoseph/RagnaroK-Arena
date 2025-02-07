import type { Wallet } from "./wallets";
import type { Tournament, Participant } from "./tournaments";
import type { Member } from "./clans";

export interface Profile {
    id: number;
    user_id: string;
    email: string;
    username?: string;
    full_name?: string;
    website?: string;
    avatar_url: string;
    created_at: Date;
    updated_at: Date;
    xp: number;
    rank: string;
    wallet: Wallet[];
    participant: Participant[];
    members: Member[];
    tournament: Tournament[];
}