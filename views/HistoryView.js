import {CSS_HISTORY} from "../constants.js";

export class HistoryView {
    #listElement;
    #onMoveClick;
    #selectedIndex = -1;

    constructor(onMoveClick) {
        this.#listElement = document.getElementById(CSS_HISTORY.LIST_ID);
        this.#onMoveClick = onMoveClick;
    }

    render(moveHistory) {
        this.#listElement.innerHTML = '';
        this.#selectedIndex = -1;
        
        moveHistory.forEach((move, index) => {
            const li = document.createElement('li');
            li.className = CSS_HISTORY.ITEM_CLASS;
            li.textContent = move.notation;
            li.dataset.index = index;
            
            li.addEventListener('click', () => {
                this.#handleMoveClick(index, move);
            });
            
            this.#listElement.appendChild(li);
        });
        
        const container = this.#listElement.parentElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    #handleMoveClick(index, move) {
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

    clearSelection() {
        if (this.#selectedIndex !== -1) {
            const items = this.#listElement.querySelectorAll(`.${CSS_HISTORY.ITEM_CLASS}`);
            if (items[this.#selectedIndex]) {
                items[this.#selectedIndex].classList.remove(CSS_HISTORY.SELECTED_CLASS);
            }
            this.#selectedIndex = -1;
        }
    }
}
