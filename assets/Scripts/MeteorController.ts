const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.SpriteFrame])
    private meteorFrames: cc.SpriteFrame[] = [];

    @property(cc.Float)
    private meteorSpeed: number = 0;

    private meteorMaxPositionX: number = 0;
    private meteorMaxPositionY: number = 0;

    onLoad () {
        this.meteorMaxPositionX = cc.winSize.width;
        this.meteorMaxPositionY = cc.winSize.height + 100;
    }

    start () {

    }

    public randomTheMeteor (): void {
        this.node.setPosition(this.getRandomMeteorPosition());
        this.getComponent(cc.Sprite).spriteFrame = this.getRandomMeteorFrame();
    }

    private getRandomMeteorPosition (): cc.Vec2 {
        let position = this.node.getPosition();
        position.x = Math.random() * this.meteorMaxPositionX;
        position.y = Math.random() * this.meteorMaxPositionY;
        return position;
    }

    private getRandomMeteorFrame (): cc.SpriteFrame {
        return this.meteorFrames[Math.random() * this.meteorFrames.length]
    }

    update (dt) {
        let positionY = this.node.getPositionY() - 100;
        this.node.setPositionY(positionY);
    }
}
