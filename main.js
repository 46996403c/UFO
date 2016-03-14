/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Physics = Phaser.Physics;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.UFO_SIZE = 75;
        //private UFO_SPEED = 200;
        this.MAX_SPEED = 300; // pixels/second
        this.ACCELERATION = 800; // pixels/second/second
        this.DRAG = 200; // pixels/second
        this.acceleracionAngular = 50;
        this.maxAcceleracionAngular = 100;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('ufo', 'assets/UFO.png');
        this.load.image('pickup', 'assets/Pickup.png');
        this.load.image('background', 'assets/Background.png');
        this.physics.startSystem(Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        var background;
        background = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / background.height;
        background.scale.setTo(scale, scale);
        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        //this.ufo.scale.setTo(scale - 0.05, scale - 0.05);
        this.ufo.width = this.ufo.height = this.UFO_SIZE;
        this.ufo.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.ufo, Physics.ARCADE);
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); //coordenadas X, Y
        this.cursor = this.input.keyboard.createCursorKeys();
        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(0.8); //Valor entre 0.0 y 1.0
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); //x,y
        this.ufo.body.angularDrag = this.maxAcceleracionAngular;
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.game.debug.bodyInfo(this.ufo, 0, 0);
        this.moverUFO();
    };
    mainState.prototype.moverUFO = function () {
        //Quitamos la velocidad por acceleracion, de forma que el movimiento sea mas natural
        // el - del -this es por los valores de x, y, -x, -y
        //this.ufo.body.velocity.x = 0;
        //this.ufo.body.velocity.y = 0;
        if (this.cursor.left.isDown) {
            //this.ufo.body.velocity.x = -this.UFO_SPEED;
            this.ufo.body.acceleration.x = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        }
        else if (this.cursor.right.isDown) {
            //this.ufo.body.velocity.x = this.UFO_SPEED;
            this.ufo.body.acceleration.x = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        }
        else if (this.cursor.up.isDown) {
            //this.ufo.body.velocity.y = -this.UFO_SPEED;
            this.ufo.body.acceleration.y = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        }
        else if (this.cursor.down.isDown) {
            //this.ufo.body.velocity.y = this.UFO_SPEED;
            this.ufo.body.acceleration.y = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        }
        else {
            //this.ufo.body.velocity.x = 0;
            //this.ufo.body.velocity.y = 0;
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }
        //this.ufo.body.angularAcceleration = this.ufo.body.acceleration.x;
        //this.ufo.body.angularAcceleration = this.ufo.body.acceleration.y;
    };
    ;
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map