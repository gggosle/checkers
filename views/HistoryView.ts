import {CSS_HISTORY} from "../constants.js";
import { MoveEntry } from '../models/interfaces';

export class HistoryView {
    #listElement: HTMLElement | null;
    #onMoveClick: (move: MoveEntry | null) => void;
    #selectedIndex = -1;

    constructor(onMoveClick: (move: MoveEntry | null) => void) {
        this.#listElement = document.getElementById(CSS_HISTORY.LIST_ID);
        this.#onMoveClick = onMoveClick;
    }

    render(moveHistory: MoveEntry[]): void {
        if (!this.#listElement) return;
        this.#listElement.innerHTML = '';
        this.#selectedIndex = -1;
        
        moveHistory.forEach((move, index) => {
            const li = document.createElement('li');
            li.className = CSS_HISTORY.ITEM_CLASS;
            li.textContent = move.notation;
            li.dataset.index = String(index);
            
            li.addEventListener('click', () => {
                this.#handleMoveClick(index, move);
            });
            
            this.#listElement!.appendChild(li);
        });
        
        const container = this.#listElement.parentElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    #handleMoveClick(index: number, move: MoveEntry): void {
        if (!this.#listElement) return;
        const items = this.#listElement.querySelectorAll(`.${CSS_HISTORY.ITEM_CLASS}`);
        
        if (this.#selectedIndex === index) {
            this.#selectedIndex = -1;
            items[index].classList.remove(CSS_HISTORY.SELECTED_CLASS);
            this.#onMoveClick(null);
        } else {
            if (this.#selectedIndex !== -1 && items[this.#selectedIndex]) {
                items[this.#selectedIndex].classList.remove(CSS_HISTORY.SELECTED_CLASS);
            }
            this.#selectedIndex = index;
            items[index].classList.add(CSS_HISTORY.SELECTED_CLASS);
            this.#onMoveClick(move);
        }
    }
}
