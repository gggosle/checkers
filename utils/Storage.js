import {GAME_CONFIG} from "../constants.js";

export class Storage {
    constructor() {}
    saveToLocalStorage(stateData) {
        localStorage.setItem(GAME_CONFIG.LOCAL_STORAGE_STATE_KEY, JSON.stringify(stateData));
    }

    getStateFromLocalStorage() {
        return JSON.parse(localStorage.getItem(GAME_CONFIG.LOCAL_STORAGE_STATE_KEY));
    }

    clearSavedState() {
        localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_STATE_KEY);
    }
}
