/// <reference path="phaser/phaser.d.ts"/>

import Physics = Phaser.Physics;
class mainState extends Phaser.State {
    //game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private UFO_SIZE = 75;
    //private UFO_SPEED = 200;
    private MAX_SPEED = 250; // pixels/second
    private ACCELERATION = 750; // pixels/second/second

    preload():void {
        super.preload();

        this.load.image('ufo', 'assets/UFO.png');
        this.load.image('pickup', 'assets/Pickup.png');
        this.load.image('background', 'assets/Background.png');

        this.physics.startSystem(Physics.ARCADE);
    }

    create():void {
        super.create();
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
        this.cursor = this.input.keyboard.createCursorKeys()
        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(0.7);
    }

    update():void {
        super.update();
        this.game.debug.bodyInfo(this.ufo, 0, 0);
        //Quitamos la velocidad por acceleracion, de forma que el movimiento sea mas natural
        //this.ufo.body.velocity.x = 0;
        //this.ufo.body.velocity.y = 0;

        if (this.cursor.left.isDown) {
            //this.ufo.body.velocity.x = -this.UFO_SPEED;
            this.ufo.body.acceleration.x = -this.ACCELERATION;
        } else if (this.cursor.right.isDown) {
            //this.ufo.body.velocity.x = this.UFO_SPEED;
            this.ufo.body.acceleration.x = this.ACCELERATION;
        } else if (this.cursor.up.isDown) {
            //this.ufo.body.velocity.y = -this.UFO_SPEED;
            this.ufo.body.acceleration.y = -this.ACCELERATION;
        } else if (this.cursor.down.isDown) {
            //this.ufo.body.velocity.y = this.UFO_SPEED;
            this.ufo.body.acceleration.y = this.ACCELERATION;
        }
        else {
            this.ufo.body.velocity.x = 0;
            this.ufo.body.velocity.y = 0;
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }
    }
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
