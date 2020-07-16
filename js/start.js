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

    let gameObject = {
        ground : null,
        plankContainer: null,
        plankLeft : null,
        plankRight : null,
        plank : null
    };

    let cursorsObject = {
        cursors : null
    };

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
        this.physics.world.setBoundsCollision(true, true, true, true);

        //初始化木板
        initPlank(this);

        //初始化按键操作
        initCursors(this);
    }

    function update(){

    }

    /**
     *  初始化承接小球的木板
     *  @param scene
     *
     *  @since 2020.07.15
     *  @author zhouhui
     */
    function initPlank (scene){
        const plankSideWidth = 20;
        const plankSideHeight = 30;
        const plankWidth = 80;
        const plankHeight = 5;
        const x = plankSideWidth + plankWidth / 2;
        const y =590;

        gameObject.plankLeft = scene.add.sprite(-1 * ( plankSideWidth + plankWidth ) / 2, 0, "");
        gameObject.plankLeft.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plankRight = scene.add.sprite(( plankSideWidth + plankWidth ) / 2, 0, "");
        gameObject.plankRight.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plank = scene.add.sprite(0, 0, "");
        gameObject.plank.setDisplaySize(plankWidth,plankHeight);

        let container = [gameObject.plankLeft,gameObject.plankRight,gameObject.plank];
        gameObject.plankContainer = scene.add.container(x, y, container);
        gameObject.plankContainer.setSize(80, 20);
        scene.physics.world.enable(gameObject.plankContainer);

        //地面
        const groundHeight = 20;
        gameObject.ground = scene.physics.add.sprite(config.width / 2, config.height - groundHeight / 2, "");
        gameObject.ground.setDisplaySize(config.width,groundHeight);
        gameObject.ground.body.setAllowGravity(false);
        gameObject.ground.body.setImmovable(true);

        scene.physics.add.collider(gameObject.ground,gameObject.plankContainer);
        scene.physics.add.collider(gameObject.plank,[gameObject.plankLeft,gameObject.plankRight]);
    }

    /**
     * 初始化按键操作
     * @param scene
     *
     * @since 2020.07.17
     * @author zhouhui
     */
    function initCursors(scene){
        cursorsObject.cursors = scene.input.keyboard.createCursorKeys();
        if (cursorsObject.cursors.right.isDown) {
            console.info(1111)
            gameObject.plankLeft.setVelocityX(300);
        }
    }
};