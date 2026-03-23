import {GAME_CONFIG} from "../constants.js";

export class TimerModel {
    #playerTimes = { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME };
    #activePlayer = 1;

    constructor(initialTimes = null) {
        if (initialTimes) {
            this.#playerTimes = { ...initialTimes };
        }
    }

    get playerTimes() {
        return { ...this.#playerTimes };
    }

    get activePlayer() {
        return this.#activePlayer;
    }

    setActivePlayer(playerNum) {
        this.#activePlayer = playerNum;
    }

    decrementActivePlayer() {
        this.#playerTimes[this.#activePlayer]--;
        return this.#playerTimes[this.#activePlayer];
    }

    getTime(playerNum) {
        return this.#playerTimes[playerNum];
    }

    setTime(playerNum, seconds) {
        this.#playerTimes[playerNum] = seconds;
    }

    reset() {
        this.#playerTimes = { 1: GAME_CONFIG.DEFAULT_GAME_TIME, 2: GAME_CONFIG.DEFAULT_GAME_TIME };
        this.#activePlayer = 1;
    }
}
