import {GAME_CONFIG} from "../constants.js";
import {PlayerTimes} from "./interfaces";

export class TimerModel {
    #playerTimes: PlayerTimes = { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME };
    #activePlayer = 1;

    constructor(initialTimes: PlayerTimes | null = null) {
        if (initialTimes) {
            this.#playerTimes = { ...initialTimes };
        }
    }

    get playerTimes(): PlayerTimes {
        return { ...this.#playerTimes };
    }

    get activePlayer(): number {
        return this.#activePlayer;
    }

    setActivePlayer(playerNum: number): void {
        this.#activePlayer = playerNum;
    }

    decrementActivePlayer(): number {
        this.#playerTimes[this.#activePlayer]--;
        return this.#playerTimes[this.#activePlayer];
    }

    getTime(playerNum: number): number {
        return this.#playerTimes[playerNum];
    }

    setTime(playerNum: number, seconds: number): void {
        this.#playerTimes[playerNum] = seconds;
    }

    reset(): void {
        this.#playerTimes = { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME };
        this.#activePlayer = 1;
    }
}
