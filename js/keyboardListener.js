export class keyboardListener {
    constructor() {
        this._observers = [];
        this._playerId = null;

        this._keydown = false;

        // https://developer.mozilla.org/pt-BR/docs/Web/API/Element/addEventListener
        document.addEventListener('keydown', this._keyDownHandler.bind(this), false);
        document.addEventListener('keyup', this._keyUpHandler.bind(this), false);
        //document.addEventListener('keyup', this, false);
    }

    registerPlayerId(playerId) {
        this._playerId = playerId
    }

    subscribe(observerFunction) {
        this._observers.push(observerFunction)
    }

    _notifyAll(command) {
        for (const observerFunction of this._observers) {
            observerFunction(command);
        }
    }

    _keyDownHandler(event) {
        if (!this._keydown) {
            this._keydown = true;
            //console.log(e);
        }
    }

    _keyUpHandler(event) {
    //handleEvent(event) {
        if (this._keydown) {
            //console.log(e);
            const keyPressed = event.key;
            const command = {
                type: 'move-player',
                playerId: this._playerId,
                keyPressed
            };
            this._notifyAll(command);
            this._keydown = false;
        }
    }
    
}