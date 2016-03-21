/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Physics = Phaser.Physics;
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.UFO_SIZE = 75;
        this.MAX_SPEED = 300; // pixels/second
        this.ACCELERATION = 800; // pixels/second/second
        this.DRAG = 200; // pixels/second
        this.acceleracionAngular = 50;
        this.maxAcceleracionAngular = 100;
        this.BOUNCE = 0.4;
        this.ANGULAR_DRAG = this.DRAG * 1.3;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('ufo', 'assets/UFO_small.png');
        this.load.image('pickup', 'assets/Pickup_small.png');
        /*
        this.load.image('background', 'assets/Background.png');
        this.load.image('center', 'assets/center.png');
        this.load.image('up', 'assets/up.png');
        this.load.image('down', 'assets/down.png');
        this.load.image('left', 'assets/left.png');
        this.load.image('right', 'assets/right.png');
        */
        this.game.load.tilemap('tilemap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/Background_small.png');
        this.physics.startSystem(Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.createWalls();
        this.createPlayer();
        this.createPickupObjects();
        //this.world.scale.setTo(1.25);
        this.camera.follow(this.ufo, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
        this.cursor = this.input.keyboard.createCursorKeys();
    };
    mainState.prototype.createWalls = function () {
        /*
        this.walls = this.add.group();
        this.walls.enableBody = true;
        var wall_up = this.add.sprite(0, 0, 'up', null, this.walls);
        var wall_left = this.add.sprite(0, wall_up.height, 'left', null, this.walls);
        var center = this.add.sprite(wall_left.width, wall_up.height, 'center', null);
        */
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('Background_small', 'tiles');
        //var wall_right = this.add.sprite(wall_left.width + center.width, wall_up.height, 'right', null, this.walls);
        //var wall_down = this.add.sprite(0, wall_up.height + center.height, 'down', null, this.walls);
        var background = this.map.createLayer('background');
        this.walls = this.map.createLayer('walls');
        //this.walls.setAll('body.immovable', true);
        this.map.setCollisionBetween(1, 100, true, 'walls');
    };
    ;
    mainState.prototype.createPlayer = function () {
        this.pickups = this.add.group();
        this.pickups.enableBody = true;
        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.ufo, Physics.ARCADE);
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); //coordenadas X, Y
        //this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(this.BOUNCE); //Valor entre 0.0 y 1.0
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); //x,y
        //this.ufo.body.angularDrag = this.maxAcceleracionAngular;
        this.ufo.body.angularDrag = this.ANGULAR_DRAG;
    };
    ;
    mainState.prototype.createPickupObjects = function () {
        this.pickups = this.add.group();
        this.pickups.enableBody = true;
        this.map.createFromObjects('pickups', 101, 'pickup', 0, true, false, this.pickups);
        /*
        var positions:Point[]=[
            new Point(300, 95),
            new Point(190, 135), new Point(410, 135),
            new Point(120, 200), new Point(480, 200),
            new Point(95, 300), new Point(505, 300),
            new Point(120, 405), new Point(480, 405),
            new Point(190, 465), new Point(410, 465),
            new Point(300, 505),
        ];
        for (var i=0;i<positions.length;i++){
            var position = positions[i];
            var pickup = new Pickup (this.game, position.x, position.y, 'pickup');
            this.add.existing(pickup);
            pickup.scale.setTo(0, 0);
            this.add.tween(pickup.scale).to({x:1, y:1}, 300).start();
            this.pickups.add(pickup);
        }
        */
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        //this.game.debug.bodyInfo(this.ufo, 0, 0);
        //this.game.debug.spriteInputInfo(this.center_aux, 32, 32);
        this.moverUFO();
        this.physics.arcade.collide(this.ufo, this.walls);
        this.physics.arcade.overlap(this.ufo, this.pickups, this.getPickup, null, this);
    };
    mainState.prototype.getPickup = function (ufo, pickup) {
        var tween = this.add.tween(pickup.scale).to({ x: 0, y: 0 }, 50);
        tween.onComplete.add(function () {
            pickup.kill();
        });
        tween.start();
    };
    mainState.prototype.moverUFO = function () {
        //Quitamos la velocidad por acceleracion, de forma que el movimiento sea mas natural
        // el - del -this es por los valores de x, y, -x, -y
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        }
        else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        }
        else if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        }
        else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        }
        else {
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }
    };
    ;
    return mainState;
})(Phaser.State);
var Pickup = (function (_super) {
    __extends(Pickup, _super);
    function Pickup(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.anchor.setTo(0.5, 0.5);
    }
    Pickup.prototype.update = function () {
        _super.prototype.update.call(this);
        this.angle += 1;
    };
    return Pickup;
})(Phaser.Sprite);
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