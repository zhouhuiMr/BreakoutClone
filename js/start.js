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
        plank : null,
        ball : null
    };

    let cursorsObject = {
        cursors : null,
        dragDistanceThreshold : 16,
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

        //创建小球
        initBall(this);

        //初始化木板
        initPlank(this);

        //初始化按键操作
        initCursors(this);

        //进行碰撞检测对象
        this.physics.add.collider(gameObject.ground, gameObject.plankContainer);
        this.physics.add.collider(gameObject.ball, gameObject.plankContainer, ballHitPlank, null, this);
        this.physics.add.collider(gameObject.ball, gameObject.ground, ballHitGround, null, this);
    }

    function update(){
        //按键控制
        gameObject.plankContainer.body.setVelocityX(0);
        if (cursorsObject.cursors.right.isDown) {
            gameObject.plankContainer.body.setVelocityX(300);
        }else if(cursorsObject.cursors.left.isDown){
            gameObject.plankContainer.body.setVelocityX(-300);
        }
    }

    /**
     * 创建小球对象
     * @param scene 场景对象
     */
    function initBall(scene){
        gameObject.ball = scene.physics.add.sprite(config.width / 2, config.height / 2, "");
        gameObject.ball.setDisplaySize(30, 30);
        gameObject.ball.body.setCollideWorldBounds(true);
        gameObject.ball.body.setAllowGravity(false);
        gameObject.ball.body.setBounce(1, 1);
        gameObject.ball.body.setVelocity(0, 300);
    }

    /**
     *  初始化承接小球的木板
     *  @param scene 场景对象
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
        const y =600;

        gameObject.plankLeft = scene.add.sprite(-1 * ( plankSideWidth + plankWidth ) / 2, 0, "");
        gameObject.plankLeft.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plankRight = scene.add.sprite(( plankSideWidth + plankWidth ) / 2, 0, "");
        gameObject.plankRight.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plank = scene.add.sprite(0, 0, "");
        gameObject.plank.setDisplaySize(plankWidth,plankHeight);

        let container = [gameObject.plankLeft,gameObject.plankRight,gameObject.plank];
        gameObject.plankContainer = scene.add.container(config.width / 2, y, container);
        gameObject.plankContainer.setSize(plankWidth + plankSideWidth * 2, 17);
        scene.physics.world.enable(gameObject.plankContainer);
        gameObject.plankContainer.body.setCollideWorldBounds(true);
        gameObject.plankContainer.body.setOffset(0,7);
        //设置事件范围
        gameObject.plankContainer.setInteractive({draggable: true});
        gameObject.plankContainer.input.hitArea.setTo(0, -10, plankWidth + plankSideWidth * 2 , plankSideHeight);

        //地面
        const groundHeight = 20;
        gameObject.ground = scene.physics.add.sprite(config.width / 2, config.height - groundHeight / 2, "");
        gameObject.ground.setDisplaySize(config.width,groundHeight);
        gameObject.ground.body.setAllowGravity(false);
        gameObject.ground.body.setImmovable(true);

    }

    /**
     * 初始化按键操作
     * @param scene 场景对象
     *
     * @since 2020.07.17
     * @author zhouhui
     */
    function initCursors(scene){
        //按键
        cursorsObject.cursors = scene.input.keyboard.createCursorKeys();
        //拖动
        scene.input.dragDistanceThreshold = cursorsObject.dragDistanceThreshold;
        scene.input.setDraggable(gameObject.plankContainer);
        gameObject.plankContainer.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
        });
    }

    /**
     * 小球与木板进行碰撞事件
     * @param ball 小球
     * @param plank 平板
     *
     * @since 2020.07.18
     * @author zhouhui
     */
    function ballHitPlank(ball, plank){
        let diff = ball.x - plank.x;
        ball.setVelocity(diff * 5, -300);
    }

    /**
     * 小球与地面的碰撞
     * @param ball 小球
     * @param ground 地面
     *
     * @since 2020.07.18
     * @author zhouhui
     */
    function ballHitGround(ball,ground){
        ball.setVelocity(0, 0);
    }
};