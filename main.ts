/// <reference path="phaser/phaser.d.ts"/>

import Physics = Phaser.Physics;
import Point = Phaser.Point;

class mainState extends Phaser.State {
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private UFO_SIZE = 75;
    private MAX_SPEED = 300; // pixels/second
    private ACCELERATION = 800; // pixels/second/second
    private DRAG = 200; // pixels/second
    private acceleracionAngular = 50;
    private maxAcceleracionAngular = 100;
    private walls:Phaser.Group;
    private BOUNCE:number = 0.4;
    private ANGULAR_DRAG:number = this.DRAG * 1.3;
    private pickup:Phaser.Sprite;
    private center_aux;

    preload():void {
        super.preload();
        this.load.image('ufo', 'assets/UFO_small.png');
        this.load.image('pickup', 'assets/Pickup_small.png');
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
        this.createWalls();
        this.createPlayer();
        this.createPickupObjects();
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    private createWalls() {
        this.walls = this.add.group();
        this.walls.enableBody = true;
        var wall_up = this.add.sprite(0, 0, 'up', null, this.walls);
        var wall_left = this.add.sprite(0, wall_up.height, 'left', null, this.walls);
        var center = this.add.sprite(wall_left.width, wall_up.height, 'center', null);
        this.center_aux = this.add.sprite(wall_left.width, wall_up.height, 'center', null);
        this.center_aux.inputEnabled = true;
        var wall_right = this.add.sprite(wall_left.width + center.width, wall_up.height, 'right', null, this.walls);
        var wall_down = this.add.sprite(0, wall_up.height + center.height, 'down', null, this.walls);
        this.walls.setAll('body.immovable', true);
    };

    private createPlayer(){
        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.ufo, Physics.ARCADE);
        this.ufo.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); //coordenadas X, Y
        this.ufo.body.collideWorldBounds = true;
        this.ufo.body.bounce.set(this.BOUNCE); //Valor entre 0.0 y 1.0
        this.ufo.body.drag.setTo(this.DRAG, this.DRAG); //x,y
        //this.ufo.body.angularDrag = this.maxAcceleracionAngular;
        this.ufo.body.angularDrag = this.ANGULAR_DRAG;
    };

    private createPickupObjects():void{
        this.pickup = new Pickup(this.game, this.world.centerX, this.world.centerY, 'pickup');
        this.add.existing(this.pickup);
        var positions:Point[]=[
            new Point(300, 125), new Point(300, 475),
            new Point(125, 300), new Point(475, 300),
            new Point(175, 175), new Point(425, 175),
            new Point(175, 425), new Point(425, 425),
        ];
        for (var i=0;i<positions.length;i++){
            var position = positions[i];
            this.pickup = new Pickup(this.game, position.x, position.y, 'pickup');
            this.add.existing(this.pickup);
        }
    }

    update():void {
        super.update();
        //this.game.debug.bodyInfo(this.ufo, 0, 0);
        this.game.debug.spriteInputInfo(this.center_aux, 32, 32);
        this.moverUFO();
        this.physics.arcade.collide(this.ufo, this.walls);
    }

    private moverUFO() {
        //Quitamos la velocidad por acceleracion, de forma que el movimiento sea mas natural
        // el - del -this es por los valores de x, y, -x, -y
        if (this.cursor.left.isDown) {
            this.ufo.body.acceleration.x = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        } else if (this.cursor.right.isDown) {
            this.ufo.body.acceleration.x = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        } else if (this.cursor.up.isDown) {
            this.ufo.body.acceleration.y = -this.ACCELERATION;
            this.ufo.body.angularAcceleration = -this.acceleracionAngular;
        } else if (this.cursor.down.isDown) {
            this.ufo.body.acceleration.y = this.ACCELERATION;
            this.ufo.body.angularAcceleration = this.acceleracionAngular;
        }
        else {
            this.ufo.body.acceleration.x = 0;
            this.ufo.body.acceleration.y = 0;
        }
    };
}

class Pickup extends Phaser.Sprite{
    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture){
        super(game, x, y, key);
        this.anchor.setTo(0.5, 0.5);
    }
    update():void{
        super.update();
        this.angle += 1;
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
