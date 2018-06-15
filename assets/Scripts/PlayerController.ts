import EventManager from "./EventManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {

    @property([cc.SpriteFrame])
    private playerSpriteFrames: cc.SpriteFrame[] = [];

    @property(cc.Float)
    private bulletInterval: number = 0.0;

    @property(cc.Prefab)
    private bulletPrefab: cc.Prefab = null;

    private timer: number = 0;
    private eventManager: cc.EventTarget = null;

    onLoad () {
        this.eventManager = EventManager.getInstance();
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    }

    start () {

    }

    public setPlayerStatus (status: number): void {
        this.getComponent(cc.Sprite).spriteFrame = this.playerSpriteFrames[status];
    }

    public fixPlayerPosition (delta: cc.Vec2) {
        let nodePosition = this.node.getPosition();
        this.node.setPosition(nodePosition.x + delta.x, nodePosition.y + delta.y);
    }

    onCollisionEnter (other: cc.Collider, self: cc.Collider): void {
        if (other.tag == 0) {
            other.node.active = false;
            this.eventManager.emit('METEOR_ON_COLLIDER');
        }
    }

    // update (dt) {
    //     this.timer += dt;
    //     if (this.timer >= this.bulletInterval) {
    //         let bullet = cc.instantiate(this.bulletPrefab);
    //         let positionPlayer = this.node.getPosition();
    //         bullet.setPosition(positionPlayer.x, positionPlayer.y + 50);
    //         cc.director.getScene().addChild(bullet);
    //         this.timer = 0;
    //     }
    // }
}
