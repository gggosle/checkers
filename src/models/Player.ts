export class Player {
    #id: number;
    #name: string;
    #color: string;
    #moveDir: number;

    constructor(id: number, name: string, color: string, moveDir: number) {
        this.#id = id;
        this.#name = name;
        this.#color = color;
        this.#moveDir = moveDir;
    }

    get id(): number {
        return this.#id;
    }

    get name(): string {
        return this.#name;
    }

    get color(): string {
        return this.#color;
    }

    get moveDir(): number {
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

    static fromJSON(json: { id: number; name: string; color: string; moveDir: number } | null): Player | null {
        if (!json) return null;
        return new Player(json.id, json.name, json.color, json.moveDir);
    }
}
