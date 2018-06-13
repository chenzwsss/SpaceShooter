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

    // onLoad () {}

    start () {

    }

    public setPlayerStatus (status: number): void {
        console.log(status);
        this.getComponent(cc.Sprite).spriteFrame = this.playerSpriteFrames[status];
    }

    public fixPlayerPosition (delta: cc.Vec2) {
        let nodePosition = this.node.getPosition();
        this.node.setPosition(nodePosition.x + delta.x, nodePosition.y + delta.y);
    }

    update (dt) {
        // this.timer += dt;
        // if (this.timer >= this.bulletInterval) {
        //     let bullet = cc.instantiate(this.bulletPrefab);
        //     let positionPlayer = this.node.getPosition();
        //     bullet.setPosition(positionPlayer.x, positionPlayer.y + 50);
        //     cc.director.getScene().addChild(bullet);
        //     this.timer = 0;
        // }
    }
}
