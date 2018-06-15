const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletController extends cc.Component {

    @property(cc.Float)
    private bulletSpeed: number = 0;

    // onLoad () { }

    // start () { }

    update (dt) {
        let positionY = this.node.getPositionY() - this.bulletSpeed;
        this.node.setPositionY(positionY);
        if (positionY < 0) {
            this.node.removeFromParent();
        }
    }
}
