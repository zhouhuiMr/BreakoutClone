window.onload = function(){

    /**
     *  游戏中的状态的控制
     */
    let gameStatus = {
        processStatus : -1,//游戏过程中的状态，-1、初始化；0、初始化完成可以开始；1、进行中；2、暂停；3、结束
    };

    /**
     * 游戏中的数据参数
     */
    let gameProperties = {
        Ball_VelocityX : 300,
        Ball_VelocityY : 300,
        Plank_Move_VelocityX : 240,
        Plank_Move_VelocityY : 0,

        plankSideWidth : 20,
        plankSideHeight : 40,
        plankWidth : 80,
        plankHeight : 5,

        groundHeight : 20,
        plankContainer_body_height : 22,
    };

    /**
     *  游戏缩放模式的控制
     */
    let scaleConfig = {
        mode : Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH
    };

    /**
     * 物理属性的配置
     */
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

    /**
     *  游戏的全局配置
     */
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

    /**
     * 游戏中的对象
     */
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

        this.load.atlas('bear', 'resources/bear.png', 'resources/bear.json');

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

        //初始化动画
        initAnimation(this);

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

        if(gameStatus.processStatus == 0){
            gameObject.ball.body.x = gameObject.plankContainer.body.center.x - gameObject.ball.body.width / 2;
        }
        if(gameStatus.processStatus >= 0){
            gameObject.plankContainer.body.setVelocityX(0);
            if (cursorsObject.cursors.right.isDown) {
                gameObject.plankContainer.body.setVelocityX(gameProperties.Plank_Move_VelocityX);
            }else if(cursorsObject.cursors.left.isDown){
                gameObject.plankContainer.body.setVelocityX(-1 * gameProperties.Plank_Move_VelocityX);
            }
        }
    }

    /**
     * 创建小球对象
     * @param scene 场景对象
     */
    function initBall(scene){
        let y = config.height - gameProperties.groundHeight - gameProperties.plankSideHeight;
        gameObject.ball = scene.physics.add.sprite(config.width / 2, y, "");
        gameObject.ball.setDisplaySize(30, 30);
        gameObject.ball.setCircle(15);
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
        const plankSideWidth = gameProperties.plankSideWidth;
        const plankSideHeight = gameProperties.plankSideHeight;
        const plankWidth = gameProperties.plankWidth;
        const plankHeight = gameProperties.plankHeight;
        const x = plankSideWidth + plankWidth / 2;
        const y = 600;

        const plankContainer_body_height = gameProperties.plankContainer_body_height;

        gameObject.plankLeft = scene.add.sprite(-1 * ( plankSideWidth + plankWidth ) / 2, 0, "bear", "bear1_002.png");
        gameObject.plankLeft.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plankRight = scene.add.sprite(( plankSideWidth + plankWidth ) / 2, 0, "bear", 'bear2_002.png');
        gameObject.plankRight.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plank = scene.add.sprite(0, 0, "");
        gameObject.plank.setDisplaySize(plankWidth,plankHeight);

        let container = [gameObject.plankLeft,gameObject.plankRight,gameObject.plank];
        gameObject.plankContainer = scene.add.container(config.width / 2, y, container);
        gameObject.plankContainer.setSize(plankWidth + plankSideWidth * 2, plankContainer_body_height);
        scene.physics.world.enable(gameObject.plankContainer);
        gameObject.plankContainer.body.setCollideWorldBounds(true);
        gameObject.plankContainer.body.setOffset(0,10);
        //设置事件范围
        gameObject.plankContainer.setInteractive({draggable: true});
        gameObject.plankContainer.input.hitArea.setTo(0, -10, plankWidth + plankSideWidth * 2 , plankSideHeight);

        //地面
        const groundHeight = gameProperties.groundHeight;
        gameObject.ground = scene.physics.add.sprite(config.width / 2, config.height - groundHeight / 2, "");
        gameObject.ground.setDisplaySize(config.width,groundHeight);
        gameObject.ground.body.setAllowGravity(false);
        gameObject.ground.body.setImmovable(true);


    }

    /**
     *  初始化动画
     *  @param scene 场景对象
     *
     *  @since 2020.07.21
     *  @author zhouhui
     */
    function initAnimation(scene){
        scene.anims.create({
            key : "bearLeft",
            frames : scene.anims.generateFrameNames('bear', { prefix: 'bear1_',suffix:'.png',start:0, end: 4, zeroPad: 3 }),
            repeat: -1,
            frameRate : 16
        });

        scene.anims.create({
            key : "bearRight",
            frames : scene.anims.generateFrameNames('bear', { prefix: 'bear2_',suffix:'.png',start:0, end: 4, zeroPad: 3 }),
            repeat: -1,
            frameRate : 16
        });
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
        scene.input.keyboard.on('keydown-RIGHT', function (event) {
            keyDown_playAnimation();
        });
        scene.input.keyboard.on('keydown-LEFT', function (event) {
            keyDown_playAnimation();
        });

        scene.input.keyboard.on('keyup-RIGHT', function (event) {
            keyUp_pauseAnimation();
        });

        scene.input.keyboard.on('keyup-LEFT', function (event) {
            keyUp_pauseAnimation();
        });

        //拖动
        scene.input.dragDistanceThreshold = cursorsObject.dragDistanceThreshold;
        scene.input.setDraggable(gameObject.plankContainer);

        gameObject.plankContainer.on('dragstart', function (pointer, dragX, dragY) {
            keyDown_playAnimation();
        });

        gameObject.plankContainer.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
        });

        gameObject.plankContainer.on('dragend', function (pointer, dragX, dragY) {
            keyUp_pauseAnimation();
        });
    }

    /**
     *  播放动画
     *
     *  @since 2020.07.22
     *  @author zhouhui
     */
    function keyDown_playAnimation(){
        if(!gameObject.plankLeft.anims.isPlaying){
            gameObject.plankLeft.anims.play('bearLeft',false);
        }
        if(!gameObject.plankRight.anims.isPlaying){
            gameObject.plankRight.anims.play('bearRight',false);
        }
    }

    /**
     *  暂停动画播放
     *
     *  @since 2020.07.22
     *  @author zhouhui
     */
    function keyUp_pauseAnimation(){
        if(gameObject.plankLeft.anims.isPlaying){
            gameObject.plankLeft.anims.pause()
        }
        if(gameObject.plankRight.anims.isPlaying){
            gameObject.plankRight.anims.pause();
        }
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
        if(gameStatus.processStatus == -1){
            ball.body.setVelocity(0, 0);
            ball.body.setFrictionX(1);
            gameStatus.processStatus = 0;
            return;
        }
        if(plank.body.touching.up){
            let diff = ball.x - plank.x;
            ball.body.setVelocity(diff * 5, -300);
        }
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
        ball.body.setVelocity(0, 0);
        ball.body.setImmovable(true);
    }
};