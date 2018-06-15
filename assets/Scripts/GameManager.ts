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

    @property(cc.Float)
    private movePerFrame: number = 0;

    @property(cc.Integer)
    private lifeCostPerFrame: number = 0;

    @property(cc.Integer)
    private lifeAddedPerMeteor: number = 0;

    @property(cc.Integer)
    private lifeCostPerBullet: number = 0;

    @property([cc.Prefab])
    private enemyPrefabs: cc.Prefab[] = [];

    @property(cc.Float)
    private enemyGenerateInterval: number = 0;

    @property(cc.Label)
    private labelLog: cc.Label = null;

    @property(cc.Label)
    private labelEnergy: cc.Label = null;

    private timer: number = 0;
    private distanceTimer: number = 0;
    private movedDistance: number = 0;
    private lifeBarCurrent: number = 0;
    private lifeBarMax: number = 0;
    private gameOver: boolean = false;
    private enemyTimer: number = 0;

    private eventManager: cc.EventTarget = null;

    onLoad () {
        this.lifeBarMax = this.lifeBar.totalLength;
        this.eventManager = EventManager.getInstance();
        this.initializeTouchEvent();
        this.initializeEventListener();
    }

    public onTouchStart (event: cc.Event.EventTouch): boolean {
        return true;
    }

    public onTouchMove (event: cc.Event.EventTouch): void {
        let targetDelta = event.getDelta();
        this.player.getComponent("PlayerController").fixPlayerPosition(targetDelta);
        if (targetDelta.x > 0) {
            this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.RIGHT);
        } else {
            this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.LEFT);
        }
    }

    public onTouchEnd (event: cc.Event.EventTouch): void {
        this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.STRAIGHT);
    }

    public onTouchCancel (event: cc.Event.EventTouch): void {
        this.player.getComponent("PlayerController").setPlayerStatus(PlayerMoveStatus.STRAIGHT);
    }

    public updateLifeBar (): void {
        this.lifeBar.progress = parseFloat((this.lifeBarCurrent / this.lifeBarMax).toFixed(1));
        this.labelEnergy.string = this.lifeBarCurrent.toString() + "/" + this.lifeBarMax.toString();
    }

    public labelActionOver (): void {
        this.labelLog.string = "";
    }

    public doLabelLogAction (): void {
        this.labelLog.node.stopAllActions();
        let delayTime = cc.delayTime(0.5);
        let finish = cc.callFunc(this.labelActionOver, this);
        this.labelLog.node.runAction(cc.sequence(delayTime, finish))
    }

    public onMeteorCollider (event: cc.Event.EventCustom): void {
        this.lifeBarCurrent += this.lifeAddedPerMeteor;
        this.labelLog.string = "+" + this.lifeAddedPerMeteor.toString();
        this.labelLog.node.color = cc.Color.GREEN;
        this.doLabelLogAction();
        if (this.lifeBarCurrent > this.lifeBarMax) {
            this.lifeBarCurrent = this.lifeBarMax;
        }
        this.updateLifeBar();
    }

    public onBulletCollider (event: cc.Event.EventCustom): void {
        this.lifeBarCurrent -= this.lifeCostPerBullet;
        this.labelLog.string = "-" + this.lifeCostPerBullet.toString();
        this.labelLog.node.color = cc.Color.RED;
        this.doLabelLogAction();
        if (this.lifeBarCurrent < 0) {
            this.lifeBarCurrent = 0;
        }
        this.updateLifeBar();
    }

    public initializeEventListener (): void {
        this.eventManager.on('METEOR_ON_COLLIDER', this.onMeteorCollider, this);
        this.eventManager.on('BULLET_ON_COLLIDER', this.onBulletCollider, this);
    }

    public initializeTouchEvent (): void {
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start () {
        this.initializeGameStatus();
    }

    onDestroy (): void {
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
        this.labelLog.string = "";
    }

    public getRandomEnemyPrefab (): cc.Prefab {
        return this.enemyPrefabs[Math.floor(Math.random() * this.enemyPrefabs.length)];
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
            this.enemyTimer += dt;

            if (this.distanceTimer >= this.distanceChangeInterval) {
                this.movedDistance += this.movePerFrame;
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

            if (this.enemyTimer >= this.enemyGenerateInterval) {
                let enemyNode = cc.instantiate(this.getRandomEnemyPrefab());
                cc.director.getScene().addChild(enemyNode);
                enemyNode.getComponent("EnemyController").setPositionAndMoveToCenter();
                this.enemyTimer = 0;
            }
        }
    }

    public onBtnGameRestart (): void {
        this.initializeGameStatus();
    }
}
