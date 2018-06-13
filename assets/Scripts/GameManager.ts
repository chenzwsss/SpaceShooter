const {ccclass, property} = cc._decorator;

enum PlayerMoveStatus {
    STRAIGHT,
    LEFT,
    RIGHT,
    DAMAGED
}

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    private canvas: cc.Node = null;

    @property(cc.Node)
    private player: cc.Node = null;

    @property(cc.Prefab)
    private meteorPrefab: cc.Prefab = null;

    @property(cc.Float)
    private meteorInterval: number = 0;

    private timer: number = 0;

    onLoad () {
        this.initializeTouchEvent()
    }

    private onTouchStart (event: cc.Event.EventTouch): boolean {
        return true;
    }

    private onTouchMove (event: cc.Event.EventTouch): void {
        let targetDelta = event.getDelta();
        this.player.getComponent("PlayerController").fixPlayerPosition(targetDelta);
        if (targetDelta.x > 0) {
            this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.RIGHT);
        } else {
            this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.LEFT);
        }
    }

    private onTouchEnd (event: cc.Event.EventTouch): void {
        this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.STRAIGHT);
    }

    private onTouchCancel (event: cc.Event.EventTouch): void {
        this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.STRAIGHT);
    }

    private initializeTouchEvent(): void {
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start () {

    }

    update (dt) {
        this.timer += dt;
        if (this.timer > this.meteorInterval) {
            let meteorNode = cc.instantiate(this.meteorPrefab);
            cc.director.getScene().addChild(meteorNode);
            meteorNode.getComponent("MeteorController").randomTheMeteor();
            this.timer = 0;
        }
    }
}
