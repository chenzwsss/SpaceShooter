const {ccclass, property} = cc._decorator;

@ccclass
export default class BackgroundController extends cc.Component {

    @property(cc.Float)
    backgroundSpeed: number = null;

    @property
    backgroundSize: cc.Size = null;

    onLoad () {
        this.backgroundSize = this.node.getContentSize();
    }

    // start () { }

    update (dt) {
        let positionY = this.node.getPositionY() - this.backgroundSpeed;
        if (positionY < -this.backgroundSize.height) {
            this.node.setPositionY(this.backgroundSize.height - this.backgroundSpeed)
        } else {
            this.node.setPositionY(positionY);
        }
    }
}
