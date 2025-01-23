import type { Wallet } from "./wallet";
import type { Tournament, Participant } from "./tournament";
import type { Member } from "./clan";

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
    wallet: Wallet[];
    participant: Participant[];
    members: Member[];
    tournament: Tournament[];
}