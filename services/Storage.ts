import {GAME_CONFIG} from "../constants.js";
import { LiveState } from '../models/interfaces';

export class Storage {
    constructor() {}
    saveToLocalStorage(stateData: LiveState): void {
        localStorage.setItem(GAME_CONFIG.LOCAL_STORAGE_STATE_KEY, JSON.stringify(stateData));
    }

    getStateFromLocalStorage(): LiveState | null {
        const item = localStorage.getItem(GAME_CONFIG.LOCAL_STORAGE_STATE_KEY);
        return item ? JSON.parse(item) : null;
    }

    clearSavedState(): void {
        localStorage.removeItem(GAME_CONFIG.LOCAL_STORAGE_STATE_KEY);
    }
}
