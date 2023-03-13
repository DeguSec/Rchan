export class AIControllerDebugger {
    debugMode = false;

    log(log: any) {
        if(this.debugMode)
            console.log(new Date(), log);
    }

    toggleDebug() {
        this.debugMode =! this.debugMode;
    }
}