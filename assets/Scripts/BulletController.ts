const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletController extends cc.Component {

    @property(cc.Float)
    private bulletSpeed: number = 0;

    // onLoad () {}

    start () {

    }

    update (dt) {
        let positionY = this.node.getPositionY() + this.bulletSpeed;
        this.node.setPositionY(positionY);
        if (positionY > cc.winSize.height) {
            this.node.removeFromParent();
        }
    }
}
