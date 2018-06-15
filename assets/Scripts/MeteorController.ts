const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Float)
    private meteorSpeed: number = 0;

    @property(cc.Float)
    private rotationPerFrame: number = 0;

    private meteorMaxPositionX: number = 0;
    private meteorMaxPositionY: number = 0;

    onLoad () {
        this.meteorMaxPositionX = cc.winSize.width;
        this.meteorMaxPositionY = cc.winSize.height + 100;
    }

    // start () {
    // }

    public randomTheMeteor (): void {
        this.node.setPosition(this.getRandomMeteorPosition());
    }

    public getRandomMeteorPosition (): cc.Vec2 {
        let position = this.node.getPosition();
        position.x = Math.random() * this.meteorMaxPositionX;
        position.y = (Math.random() + 1) * this.meteorMaxPositionY;
        return position;
    }

    update (dt) {
        let positionY = this.node.getPositionY() - this.meteorSpeed;
        this.node.setPositionY(positionY);
        if (positionY < -100) {
            this.node.removeFromParent();
        }
    }

    lateUpdate (dt) {
        this.node.rotation += this.rotationPerFrame;
    }
}
