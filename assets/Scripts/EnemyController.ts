const {ccclass, property} = cc._decorator;

enum Directions {
    TOP,
    LEFT,
    RIGHT,
    BOTTOM
}

@ccclass
export default class EnemyController extends cc.Component {

    @property(cc.Float)
    private bulletInterval: number = 0.0;

    @property(cc.Prefab)
    private bulletPrefab: cc.Prefab = null;

    private maxPositionX: number = 0;
    private maxPositionY: number = 0;
    // 4种情况，上，下，左，右
    private generateDirections: [cc.Integer] = [Directions.TOP, Directions.LEFT, Directions.RIGHT, Directions.BOTTOM];
    private isMoveOver: boolean = false;

    private timer: number = 0;

    onLoad () {
        this.maxPositionX = cc.winSize.width;
        this.maxPositionY = cc.winSize.height * 2;
    }

    start () {

    }

    update (dt) {
        if (true == this.isMoveOver) {
            this.timer += dt;
            if (this.timer >= this.bulletInterval) {
                let bullet = cc.instantiate(this.bulletPrefab);
                let positionPlayer = this.node.getPosition();
                cc.director.getScene().addChild(bullet);
                bullet.setPosition(positionPlayer.x, positionPlayer.y - 50);
                this.timer = 0;
            }
        }
    }

    public moveOver (): void {
        this.isMoveOver = true;
    }

    public setPositionAndMoveToCenter (): void {
        let direction = this.getTheDirection();
        let x = 0;
        let y = 0;
        if (direction == Directions.TOP) {
            x = Math.floor(Math.random() * cc.winSize.width);
            y = Math.floor(Math.random() * 900) + 100 + cc.winSize.height;
        } else if (direction == Directions.BOTTOM) {
            x = Math.floor(Math.random() * cc.winSize.width);
            y = -Math.floor(Math.random() * 900) - 100;
        } else if (direction == Directions.LEFT) {
            x = -Math.floor(Math.random() * 900) - 100;
            y = Math.floor(Math.random() * cc.winSize.height);
        } else if (direction == Directions.RIGHT) {
            x = Math.floor(Math.random() * 900) + 100 + cc.winSize.width;
            y = Math.floor(Math.random() * cc.winSize.height);
        }
        this.node.setPosition(x, y);

        let finalX = Math.floor(Math.random() * (cc.winSize.width - 100)) + 50;
        let finalY = Math.floor(Math.random() * cc.winSize.height / 2) + cc.winSize.height / 2;
        if (finalY > cc.winSize.height - 220) {
            finalY = cc.winSize.height - 220;
        }

        let action = cc.moveTo(1, finalX, finalY);
        let finish = cc.callFunc(this.moveOver, this);
        this.node.runAction(cc.sequence(action, finish));
    }

    public getTheDirection (): number {
        return this.generateDirections[Math.floor(Math.random() * this.generateDirections.length)];
    }
}
