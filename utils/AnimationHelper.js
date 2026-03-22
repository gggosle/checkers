import {GAME_CONFIG} from "../constants.js";

export class AnimationHelper {
    static animate(checkerElement, targetCell, onComplete, onStart) {
        if (onStart) onStart();
        
        const delta = this.#calculateDelta(checkerElement, targetCell);
        
        checkerElement.style.transition = `transform ${GAME_CONFIG.ANIMATION_DURATION}ms ease-in-out`;
        checkerElement.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
        checkerElement.style.zIndex = '100';
        
        const finishTransition = () => {
            checkerElement.style.transition = '';
            checkerElement.style.transform = '';
            checkerElement.style.zIndex = '';
            if (onComplete) onComplete();
        };

        checkerElement.addEventListener('transitionend', finishTransition, { once: true });
        
        setTimeout(() => {
            if (checkerElement.style.transition !== '') {
                finishTransition();
            }
        }, GAME_CONFIG.ANIMATION_DURATION + 50);
    }

    static #calculateDelta(checkerElement, targetCell) {
        const startRect = checkerElement.getBoundingClientRect();
        const endRect = targetCell.getBoundingClientRect();
        
        return {
            x: (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2),
            y: (endRect.top + endRect.height / 2) - (startRect.top + startRect.width / 2)
        };
    }
}
