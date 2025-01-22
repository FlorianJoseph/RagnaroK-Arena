import type { Profile } from "./profile";

export interface Clan {
    id: number;
    name: string;
    members: Member[];
    created_at: Date;
    updated_at: Date;
}

export interface Member {
    id: number;
    clan_id: number;
    clan: Clan;
    user_id: string;
    user: Profile;
}