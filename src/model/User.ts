
/**
 * Represents a user behind the browser
 */
export class User {
    public readonly id: string;

    constructor(params: {
        id: string
    }) {
        this.id = params.id;
    }
}