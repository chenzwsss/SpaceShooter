const {ccclass, property} = cc._decorator;

@ccclass
export default class EventManager extends cc.EventTarget {

    private static instance: EventManager = null;

    public static getInstance (): EventManager {
        if (null == this.instance) {
            this.instance = new EventManager();
        }
        return this.instance;
    }
}
