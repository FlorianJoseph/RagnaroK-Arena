import type { Tournament } from "./tournaments";

export interface Game {
    id: number;
    name: string;
    image_url: string;
    category: CategoryType;
    tournament: Tournament[];
}

export enum CategoryType {
    FPS = "FPS",
    PartyGames = "Party Games",
    Combat = "Combat",
}