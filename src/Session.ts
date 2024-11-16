class Session {
    private sessionKey: string = 'SessionJS';
    private sessionId: string;
    private newUser: boolean = false;

    constructor() {
        const storedSessionId = localStorage.getItem(this.sessionKey);

        if (storedSessionId) {
            this.sessionId = storedSessionId;
        } else {
            this.sessionId = this.generateRandomBase64String(22);
            localStorage.setItem(this.sessionKey, this.sessionId);
            this.newUser = true;
        }
    }

    private generateRandomBase64String(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters[randomIndex];
        }

        return result;
    }

    public getSessionId(): string {
        return this.sessionId;
    }

    public isNewUser(): boolean {
        return this.newUser;
    }
}