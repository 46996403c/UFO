/// <reference path="phaser/phaser.d.ts"/>

import Physics = Phaser.Physics;
class mainState extends Phaser.State {
    //game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private UFO_SIZE = 75;
    //private UFO_SPEED = 200;
    private MAX_SPEED = 300; // pixels/second
    private ACCELERATION = 800; // pixels/second/second
    private DRAG = 200; // pixels/second
    private acceleracionAngular = 50;
    private maxAcceleracionAngular = 100;
    private walls:Phaser.Group;

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/UFO_small.png');
        this.load.image('pickup', 'assets/Pickup.png');
        this.load.image('background', 'assets/Background.png');
        this.load.image('center', 'assets/center.png');
        this.load.image('up', 'assets/up.png');
        this.load.image('down', 'assets/down.png');
        this.load.image('left', 'assets/left.png');
        this.load.image('right', 'assets/right.png');
        this.physics.startSystem(Physics.ARCADE);
    }

    create():void {
        super.create();
        //var background;
        this.walls = this.add.group();
        this.walls.enableBody = true;

        var wall_up = this.add.sprite(0, 0, 'up', null, this.walls);
        var wall_left = this.add.sprite(0, wall_up.height, 'left', null, this.walls);
        /*
        background = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / background.height;
        background.scale.setTo(scale, scale);
        */
        var center = this.add.sprite(wall_left.width, wall_up.height, 'center', null);
        var wall_right = this.add.sprite(wall_left.width + center.width, wall_up.height, 'right', null, this.walls);
        var wall_down = this.add.sprite(0, wall_up.height + center.height, 'down', null, this.walls);

        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        //this.ufo.scale.setTo(scale - 0.05, scale - 0.05);
        //this.ufo.width = this.ufo.height = this.UFO_SIZE;
        this.ufo.anchor.setTo(0.5, 0.5);

        this.physics.enable(this.ufo, Physics.ARCADE);
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); //coordenadas X, Y
        this.cursor = this.input.keyboard.createCursorKeys()
        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(0.8); //Valor entre 0.0 y 1.0
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); //x,y
        this.ufo.body.angularDrag = this.maxAcceleracionAngular;
    }

    update():void {
        super.update();
        this.game.debug.bodyInfo(this.ufo, 0, 0);
        this.moverUFO();
    }

    private moverUFO() {
        //Quitamos la velocidad por acceleracion, de forma que el movimiento sea mas natural
        // el - del -this es por los valores de x, y, -x, -y
        //this.ufo.body.velocity.x = 0;
        //this.ufo.body.velocity.y = 0;

        if (this.cursor.left.isDown) {
            //this.ufo.body.velocity.x = -this.UFO_SPEED;
            this.ufo.body.acceleration.x = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        } else if (this.cursor.right.isDown) {
            //this.ufo.body.velocity.x = this.UFO_SPEED;
            this.ufo.body.acceleration.x = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        } else if (this.cursor.up.isDown) {
            //this.ufo.body.velocity.y = -this.UFO_SPEED;
            this.ufo.body.acceleration.y = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        } else if (this.cursor.down.isDown) {
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
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
