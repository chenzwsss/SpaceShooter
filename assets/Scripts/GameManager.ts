import EventManager from "./EventManager";

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

    @property(cc.Float)
    private distanceChangeInterval: number = 0;

    @property(cc.Label)
    private labelDistance: cc.Label = null;

    @property(cc.ProgressBar)
    private lifeBar: cc.ProgressBar = null;

    @property(cc.Node)
    private gameOverNode: cc.Node = null;

    private timer: number = 0;
    private distanceTimer: number = 0;
    private movedDistance: number = 0;
    private lifeBarCurrent: number = 0;
    private lifeBarMax: number = 0;
    private gameOver: boolean = false;

    private eventManager: cc.EventTarget = null;

    onLoad () {
        this.lifeBarMax = this.lifeBar.totalLength;
        this.eventManager = EventManager.getInstance();
        this.initializeTouchEvent()
        this.initializeEventListener();
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

    private updateLifeBar (): void {
        this.lifeBar.progress = parseFloat((this.lifeBarCurrent / this.lifeBarMax).toFixed(1));
    }

    private onMeteorCollider (event: cc.Event.EventCustom): void {
        this.lifeBarCurrent += 200;
        if (this.lifeBarCurrent > this.lifeBarMax) {
            this.lifeBarCurrent = this.lifeBarMax;
        }
        this.updateLifeBar();
    }

    private initializeEventListener (): void {
        let self = this;
        this.eventManager.on('METEOR_ON_COLLIDER', this.onMeteorCollider, this);
    }

    private initializeTouchEvent (): void {
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start () {
        this.initializeGameStatus();
    }

    onDestroy(): void {
        this.eventManager.targetOff(this);
    }

    public initializeGameStatus (): void {
        this.gameOver = false;
        this.gameOverNode.active = false;
        this.lifeBarCurrent = this.lifeBarMax;
        this.updateLifeBar();
        this.timer = 0;
        this.distanceTimer = 0;
        this.movedDistance = 0;
    }

    update (dt) {
        if (false == this.gameOver) {
            this.lifeBarCurrent -= 2;
            this.updateLifeBar();
            if (this.lifeBarCurrent <= 0) {
                this.gameOver = true;
                this.gameOverNode.active = true;
                return;
            }
            this.timer += dt;
            this.distanceTimer += dt;
            if (this.distanceTimer >= this.distanceChangeInterval) {
                this.movedDistance += 0.1;
                this.distanceTimer = 0;
            }
            let disStr = this.movedDistance.toFixed(1);
            this.labelDistance.string = disStr + "KM";

            if (this.timer >= this.meteorInterval) {
                let meteorNode = cc.instantiate(this.meteorPrefab);
                cc.director.getScene().addChild(meteorNode);
                meteorNode.getComponent("MeteorController").randomTheMeteor();
                this.timer = 0;
            }
        }
    }

    public onBtnGameRestart (): void {
        this.initializeGameStatus();
    }
}
