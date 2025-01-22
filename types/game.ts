import type { Tournament } from "./tournament";

export interface Game {
    id: number;
    nom: string;
    categorie: CategoryType;
    tournament: Tournament[];
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
