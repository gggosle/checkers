export class Player {
    #id;
    #name;
    #color;
    #moveDir;

    constructor(id, name, color, moveDir) {
        this.#id = id;
        this.#name = name;
        this.#color = color;
        this.#moveDir = moveDir;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get color() {
        return this.#color;
    }

    get moveDir() {
        return this.#moveDir;
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            color: this.#color,
            moveDir: this.#moveDir
        };
    }

    static fromJSON(json) {
        if (!json) return null;
        return new Player(json.id, json.name, json.color, json.moveDir);
    }
}
