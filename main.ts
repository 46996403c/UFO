/// <reference path="phaser/phaser.d.ts"/>

import Physics = Phaser.Physics;
class mainState extends Phaser.State {
    //game: Phaser.Game;
    private ufo:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;
    private UFO_SIZE = 75;

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
    }

    update():void {
        super.update();
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
