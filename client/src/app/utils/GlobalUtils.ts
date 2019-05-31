export class GlobalUtils {
    constructor(){}

    static generateRandomNumberByRange(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }
}