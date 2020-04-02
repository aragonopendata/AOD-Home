export class StateInfo{
    text: string;
    state: State

    constructor (_text: string, _state: State){
        this.text=_text;
        this.state=_state;
    }
}

export enum State {
    SinDefinir=0,
    Borrador = 1 ,
    Revision = 2,
    Publicada = 3,
    Desactivada = 4,
    Versionada = 5
}