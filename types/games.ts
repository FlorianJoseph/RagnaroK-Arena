import type { Tournament } from "./tournaments";

export interface Game {
    id: number;
    name: string;
    categorie: CategoryType;
    tournament: Tournament[];
}

export enum CategoryType {
    FPS = "FPS",
    PartyGames = "Party Games",
    Combat = "Combat",
}