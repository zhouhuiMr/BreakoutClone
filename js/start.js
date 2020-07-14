window.onload = function(){

    let scaleConfig = {
        mode : Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH
    };

    let physicsConfig = {
        default: 'arcade',
        arcade: {
            debug : true,
            debugShowStaticBody : true,
            debugShowBody : true,
            debugShowVelocity : true,
            fps : 120,
            gravity: { y: 200 },

        }
    };

    let config = {
        type: Phaser.AUTO,
        width: 360,
        height: 640,
        parent : "container",
        disableContextMenu : true,
        scale : scaleConfig,
        physics: physicsConfig,
        scene: {
            preload: preload,
            create: create,
            update : update
        }
    };

    let game = new Phaser.Game(config);

    function preload ()
    {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');

        this.load.on("progress",function(progress){
            //正在加载
        });

        this.load.on('complete', function(loader,totalComplete,totalFailed){
            //加载完成
        });
    }

    function create ()
    {

        this.add.image(10, 300, 'sky');

        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 200,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(20, 20, 'logo');

        logo.scaleX = 0.2;
        logo.scaleY = 0.2;

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }

    function update(){
        console.info(1111)
    }
};