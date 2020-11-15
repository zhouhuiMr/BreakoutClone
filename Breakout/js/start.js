/**
 *  游戏分为四个场景，
 *  1、游戏加载；2、菜单界面；3、游戏场景；
 *  4、游戏结束场景
 *
 *  @author zhouhui
 */
window.onload = function(){
    /**
     *  游戏中的状态的控制
     */
    let gameStatus = {
        processStatus : -1,//游戏过程中的状态，-1、初始化；0、初始化完成可以开始；1、进行中；2、暂停；3、结束；4、成功
        gameOut : false,
    };

    /**
     * 游戏中的数据参数
     */
    let gameProperties = {
        Ball_VelocityX : 400,
        Ball_VelocityY : 400,
        Plank_Move_VelocityX : 240,
        Plank_Move_VelocityY : 0,

        plankSideWidth : 20,
        plankSideHeight : 40,
        plankWidth : 60,
        plankHeight : 20,
        plankLife : 2,

        groundHeight : 100,
        plankContainer_body_height : 22,

        ballWidth : 20,

        cannonHeight : 50,
        score : 0,
        curScore : 0,
        maxScore : 999,
        maxScoreLength : 3,
        isUseSound : false
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
            debug : false,
            debugShowStaticBody : true,
            debugShowBody : true,
            debugShowVelocity : true,
            fps : 120,
            gravity: { y: 200 },
        }
    };

    /**
     * 游戏中的对象
     */
    let gameObject = {
        ground : null,
        plankContainer: null,
        plankLeft : null,
        plankRight : null,
        plank : null,
        ball : null,
        dragZone : null,
        platform : null,

        cannonContainer : null,
        cannonBody : null,
        cannonWheel : null,
        cannonTween : null,

        honeycomb : null,

        treeContainer : null,

        branchGroup : null,

        title : null,
        cloud : null,
        backGroundColor : null,
        buttonStart : null,
        buttonReStart : null,
        playBall : null,

        lifeContainer : null,
        scoreBoard : null,

        soundButton : null,
        ballHitBranch : null,
        ballHitPlank : null,
        shootSound : null,
        backSound : null,
        deadSound : null,
    };

    let cursorsObject = {
        cursors : null,
        dragDistanceThreshold : 16,
    };


    /**
     *  加载的文件资源
     *  @since 2020.08.02
     *  @author zhouhui
     */
    let resourcesLoad = function ()
    {

        this.load.atlas('resources', 'resources/resources.png', 'resources/resources.json');

        this.load.audio('BGM', ['resources/sound/BGM.mp3']);
        this.load.audio('ballHitBranch', ['resources/sound/ballHitBranch.mp3']);
        this.load.audio('ballHitPlank', ['resources/sound/ballHitPlank.mp3']);
        this.load.audio('shoot', ['resources/sound/shoot.mp3']);

        var progress = this.add.graphics();

        this.load.on("progress",function(value){
            //正在加载
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, config.height / 2, config.width * value, 60);
        });

        this.load.on('complete', function(loader,totalComplete,totalFailed){
            //加载完成
            progress.destroy();
        });
    };

    /**
     *  初始化动画
     *  @param scene 场景对象
     *
     *  @since 2020.07.21
     *  @author zhouhui
     */
    let initAnimation = function (scene){
        scene.anims.create({
            key : "bearLeft",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'bear1_',suffix:'.png',start:1, end: 4, zeroPad: 3 }),
            repeat: -1,
            frameRate : 16
        });

        scene.anims.create({
            key : "bearRight",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'bear2_',suffix:'.png',start:1, end: 4, zeroPad: 3 }),
            repeat: -1,
            frameRate : 16
        });

        scene.anims.create({
            key : "ball",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'ball1_',suffix:'.png',start:1, end: 5, zeroPad: 3 }),
            repeat: -1,
            frameRate : 16
        });

        scene.anims.create({
            key : "playBall",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'bear3_',suffix:'.png',start:1, end: 8, zeroPad: 3 }),
            repeat: -1,
            frameRate : 16
        });

        scene.anims.create({
            key : "cannonFire",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'cannon1_',suffix:'.png',start:1, end: 6, zeroPad: 3 }),
            repeat: 0,
            frameRate : 8
        });

        scene.anims.create({
            key : "lifeBroken",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'life1_',suffix:'.png',start:0, end: 5, zeroPad: 3 }),
            repeat: 0,
            frameRate : 18
        });

        scene.anims.create({
            key : "plankUp",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'plank1_',suffix:'.png',start:1, end: 3, zeroPad: 3 }),
            repeat: 0,
            frameRate : 20
        });

        scene.anims.create({
            key : "honeycomb",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'honeycomb1_',suffix:'.png',start:0, end: 5, zeroPad: 3 }),
            repeat: -1,
            frameRate : 6
        });

        scene.anims.create({
            key : "branchBreak1",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'branch1_',suffix:'.png',start:3, end: 7, zeroPad: 3 }),
            repeat: 0,
            frameRate : 16
        });

        scene.anims.create({
            key : "branchBreak2",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'branch2_',suffix:'.png',start:3, end: 7, zeroPad: 3 }),
            repeat: 0,
            frameRate : 16
        });

        scene.anims.create({
            key : "branchBreak3",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'branch3_',suffix:'.png',start:3, end: 7, zeroPad: 3 }),
            repeat: 0,
            frameRate : 16
        });

        scene.anims.create({
            key : "branchBreak4",
            frames : scene.anims.generateFrameNames('resources', { prefix: 'branch4_',suffix:'.png',start:1, end: 5, zeroPad: 3 }),
            repeat: 0,
            frameRate : 16
        });

    };

    /**
     *  文件加载的场景
     *
     *  @since 2020.08.02
     *  @author zhouhui
     */
    let preLoader = new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function(){
            Phaser.Scene.call(this, { key: 'preloader' });
        },
        preload : resourcesLoad,
        create : function(){
            initAnimation(this);

            this.scene.start('mainmenu');
        }
    });

    /**
     *  主要菜单场景
     *
     *  @since 2020.08.02
     *  @author zhouhui
     */
    let mainMenu = new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function(){
            Phaser.Scene.call(this, { key: 'mainmenu' });
        },
        create : function(){

            initBackgroundSound(this);
            if(gameProperties.isUseSound){
                gameObject.backSound.play();
            }

            //初始化背景
            initBackGround(this);

            //初始化按钮
            initButton(this);

            //创建地面对象
            initGround(this);

            //初始化是否开启音乐的按钮
            initSoundButton(this);
        },
        update : function(){
            gameObject.cloud.tilePositionX += 0.2;
            if(gameObject.playBall.x > config.width + 30){
                gameObject.playBall.x = -20;
            }else{
                gameObject.playBall.x += 0.4;
            }
        }
    });

    /**
     *  主要游戏场景
     *
     *  @since 2020.08.02
     *  @author zhouhui
     */
    let mainGame = new Phaser.Class({
            Extends: Phaser.Scene,
            initialize: function () {
                Phaser.Scene.call(this, {key: 'maingame'});
            },
            create: function () {
                this.physics.world.setBoundsCollision(true, true, true, true);

                this.input.on('gameout', function () {
                    gameStatus.gameOut = false;
                });

                this.input.on('gameover', function () {
                    gameStatus.gameOut = true;
                });

                //背景颜色
                gameObject.backGroundColor = this.add.tileSprite(0,-1,config.width,config.height,"resources","background1-001.jpg");
                gameObject.backGroundColor.setOrigin(0,0);

                //初始化碰撞声音
                initMainGameSound(this);

                //创建地面
                initGround(this);

                //初始化木板
                initPlank(this);

                //初始化树木
                initTree(this);

                //初始化树枝
                initBranch(this);

                //初始化蜂窝
                initHoneycomb(this);

                //初始化生命值
                initLife(this);

                //创建小球
                initBall(this);

                //创建火炮
                initCannon(this);

                //初始化计分器
                initScoreBoard(this);

                //初始化是否开启声音的按钮
                initSoundButton(this);

                //初始化重新开始的按键
                initReStartButton(this);

                //初始化按键操作
                initCursors(this);


                //进行碰撞检测对象
                this.physics.add.collider(gameObject.ground, gameObject.plankContainer);
                this.physics.add.collider(gameObject.ball, gameObject.plankContainer, ballHitPlank, null, this);
                this.physics.add.collider(gameObject.ball, gameObject.ground, ballHitGround, null, this);
                this.physics.add.collider(gameObject.ball, gameObject.branchGroup, ballHitBranch, null, this);
                this.physics.add.collider(gameObject.ball, gameObject.honeycomb, ballHitHoneycomb, null, this);
                this.physics.add.collider(gameObject.honeycomb, gameObject.ground, honeycombHitGround, null, this);
                this.physics.add.collider(gameObject.honeycomb, gameObject.plankContainer, honeycombHitPlank, null, this);

            },
            update: function () {
                if(gameObject.plankContainer.data.values.life <= 0){
                    //游戏结束
                    gameStatus.processStatus = 3;
                    gameObject.plankContainer.body.setEnable(false);
                    gameObject.buttonReStart.setVisible(true);
                    gameObject.buttonReStart.setActive(true);
                }

                if(gameStatus.processStatus == 1){
                    gameObject.plankContainer.body.setVelocityX(0);
                    if (cursorsObject.cursors.right.isDown) {
                        gameObject.plankContainer.body.setVelocityX(gameProperties.Plank_Move_VelocityX);
                    }else if(cursorsObject.cursors.left.isDown){
                        gameObject.plankContainer.body.setVelocityX(-1 * gameProperties.Plank_Move_VelocityX);
                    }
                    gameObject.ball.angle += 1;
                }else if(gameStatus.processStatus == 2){
                    //游戏暂停了
                    resetBall(this);
                }else if(gameStatus.processStatus == 4){
                    this.scene.start('endMenu');
                }

                if(gameProperties.score != gameProperties.curScore && gameProperties.curScore < gameProperties.maxScore){
                    gameProperties.curScore += 1;
                    scoreChangeAnim(this);
                }
            }
        }
    );

    /**
     *  结束的场景
     *
     *  @since 2020.08.02
     *  @author zhouhui
     */
    let endMenu = new Phaser.Class({
        Extends: Phaser.Scene,
        initialize: function(){
            Phaser.Scene.call(this, { key: 'endMenu' });
        },
        create : function(){
            gameStatus.processStatus = 0;
            //初始化背景
            initEndSceneBackGround(this);

            //初始化分数
            initEndScoreBoard(this);

            //创建地面对象
            initGround(this);
        },
        update : function(){
            gameObject.cloud.tilePositionX += 0.2;
        }
    });

    /**
     *  游戏的全局配置
     *
     *  @since 2020.08.02
     *  @author zhouhui
     */
    let config = {
        type: Phaser.AUTO,
        width: 360,
        height: 640,
        parent : "container",
        disableContextMenu : true,
        scale : scaleConfig,
        physics: physicsConfig,
        scene: [preLoader,mainMenu,mainGame,endMenu]
    };

    let game = new Phaser.Game(config);

    /**
     *  游戏的背景音乐
     *
     *  @since 2020.08.23
     *  @author zhouhui
     */
    function initBackgroundSound(scene){
        gameObject.backSound = scene.sound.add("BGM",{
            loop : true
        });
    }

    /**
     *  重置小球和木板的位置
     *  @param scene 场景对象
     *
     *  @since 2020.08.08
     *  @author zhouhui
     */
    function resetBall(scene){
        scene.tweens.makeActive(gameObject.cannonTween);
        gameObject.plankContainer.x = config.width / 2;
    }

    /**
     *  计分板数字变化效果
     *  @param scene 场景对象
     *
     *  @since 2020.08.09
     *  @author zhouhui
     */
    function scoreChangeAnim(scene){
        const curScoreStr = gameProperties.curScore.toString();
        for(var i=0;i<curScoreStr.length;i++){
            const curNum = curScoreStr.substr(i,1);
            const numSite = gameProperties.maxScoreLength - (curScoreStr.length - i);
            const number = gameObject.scoreBoard.getAt(numSite);
            number.setTexture("resources", "number1_00"+curNum+".png");
        }
    }

    /**
     *  初始化背景
     *  @param scene
     */
    function initBackGround(scene){
        //背景颜色
        gameObject.backGroundColor = scene.add.tileSprite(0,-1,config.width,config.height,"resources","background1-001.jpg");
        gameObject.backGroundColor.setOrigin(0,0);

        //云彩
        gameObject.cloud = scene.add.tileSprite(0,0,config.width,config.height,"resources","cloud.png");
        gameObject.cloud.setOrigin(0,0);

        //标题
        gameObject.title = scene.add.sprite(config.width / 2, config.height / 5,"resources","title.png");

        //拍皮球的小熊
        gameObject.playBall = scene.add.sprite(-20, config.height - gameProperties.groundHeight - 20,"resources","bear3_001.png");
        gameObject.playBall.anims.play('playBall',false);
    }

    /**
     *  初始化按钮
     *  @param scene
     */
    function initButton(scene){
        gameObject.buttonStart = scene.add.sprite(config.width / 2, 2 * config.height / 3, "resources", "button1.png");
        gameObject.buttonStart.setInteractive();

        gameObject.buttonStart.on('pointerover',function(){
            gameObject.buttonStart.setTint(0xFFDAB9);
            gameObject.buttonStart.setAlpha(0.75);
        });
        gameObject.buttonStart.on('pointerdown', function () {
            //销毁背景音乐
            gameObject.backSound.destroy();
            // var el = document.documentElement;
            // var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            // if(typeof rfs != "undefined" && rfs) {
            //     rfs.call(el);
            // }
            scene.scene.start('maingame');
            // scene.scene.start('endMenu');
        });
        gameObject.buttonStart.on('pointerout',function(){
            gameObject.buttonStart.setTint(0xffffff);
            gameObject.buttonStart.setAlpha(1);
        });
    }

    /**
     *  初始化背景
     *  @param scene
     */
    function initEndSceneBackGround(scene){
        //背景颜色
        gameObject.backGroundColor = scene.add.tileSprite(0,-1,config.width,config.height,"resources","background1-001.jpg");
        gameObject.backGroundColor.setOrigin(0,0);

        //云彩
        gameObject.cloud = scene.add.tileSprite(0,0,config.width,config.height,"resources","cloud.png");
        gameObject.cloud.setOrigin(0,0);

    }

    /**
     * 初始化是否开启声音按钮
     * @param scene 场景对象
     *
     * @since 2020.08.23
     * @author zhouhui
     */
    function initSoundButton(scene){
        if(gameProperties.isUseSound){
            gameObject.soundButton = scene.add.sprite(config.width - 40, 30, "resources", "sound1.png");
        }else{
            gameObject.soundButton = scene.add.sprite(config.width - 40, 30, "resources", "sound2.png");
        }
        gameObject.soundButton.setDisplaySize(30,30);
        gameObject.soundButton.setInteractive();

        gameObject.soundButton.on('pointerover',function(){

        });
        gameObject.soundButton.on('pointerdown', function () {
            if(gameProperties.isUseSound){
                gameProperties.isUseSound = false;
                gameObject.soundButton.setTexture("resources", "sound2.png");
                if(gameObject.backSound != null){
                    // gameObject.backSound.pause();
                }
            }else{
                gameProperties.isUseSound = true;
                gameObject.soundButton.setTexture("resources", "sound1.png");
                if(gameObject.backSound != null){
                    // gameObject.backSound.play();
                }
            }
        });
        gameObject.soundButton.on('pointerout',function(){

        });

    }

    /**
     *  初始化按钮
     *  @param scene
     */
    function initReStartButton(scene){
        gameObject.buttonReStart = scene.add.sprite(config.width / 2, 2 * config.height / 3, "resources", "button2.png");
        gameObject.buttonReStart.setInteractive();
        gameObject.buttonReStart.setVisible(false);
        gameObject.buttonReStart.setActive(false);

        //重置分数
        gameProperties.curScore = 0;
        gameProperties.score = 0;

        gameObject.buttonReStart.on('pointerover',function(){
            gameObject.buttonReStart.setTint(0xFFDAB9);
            gameObject.buttonReStart.setAlpha(0.75);
        });
        gameObject.buttonReStart.on('pointerdown', function () {
            // var el = document.documentElement;
            // var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            // if(typeof rfs != "undefined" && rfs) {
            //     rfs.call(el);
            // }
            scene.scene.start('maingame');
        });
        gameObject.buttonReStart.on('pointerout',function(){
            gameObject.buttonReStart.setTint(0xffffff);
            gameObject.buttonReStart.setAlpha(1);
        });
    }

    /**
     * 创建地面对象
     * @param scene 场景对象
     */
    function initGround(scene){
        //地面
        const groundHeight = gameProperties.groundHeight;
        gameObject.ground = scene.physics.add.sprite(config.width / 2, config.height - groundHeight / 2, "resources", "breakout-ground.png");
        gameObject.ground.setDisplaySize(config.width,groundHeight);
        gameObject.ground.body.setAllowGravity(false);
        gameObject.ground.body.setImmovable(true);
    }

    /**
     * 创建小球对象
     * @param scene 场景对象
     */
    function initBall(scene){
        let y = config.height - gameProperties.groundHeight - gameProperties.plankSideHeight;
        gameObject.ball = scene.physics.add.sprite(config.width / 2, y, "resources", "ball1_001.png");
        gameObject.ball.setOrigin(0.5,0.5);
        gameObject.ball.setDisplaySize(gameProperties.ballWidth, gameProperties.ballWidth);
        gameObject.ball.body.setCircle(gameProperties.ballWidth / 2);
        gameObject.ball.body.setCollideWorldBounds(true);
        gameObject.ball.body.setAllowGravity(false);
        gameObject.ball.body.setAllowDrag(false);
        gameObject.ball.body.setBounce(1, 1);
        gameObject.ball.body.setFriction(0, 0);
        gameObject.ball.body.setMaxSpeed(400);
        //gameObject.ball.body.setVelocity(0, 300);
        gameObject.ball.anims.play('ball',false);
        gameObject.ball.setVisible(false);
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
        const y = config.height - gameProperties.groundHeight - plankSideHeight / 2;

        const plankContainer_body_height = gameProperties.plankContainer_body_height;

        gameObject.plankLeft = scene.add.sprite(-1 * ( plankSideWidth + plankWidth ) / 2 + 2, 0, "resources", "bear1_002.png");
        gameObject.plankLeft.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plankRight = scene.add.sprite(( plankSideWidth + plankWidth ) / 2 - 2, 0, "resources", 'bear2_002.png');
        gameObject.plankRight.setDisplaySize(plankSideWidth, plankSideHeight);

        gameObject.plank = scene.add.sprite(0, -5, "resources", "plank1_001.png");
        gameObject.plank.setDisplaySize(plankWidth,plankHeight);

        let container = [gameObject.plankLeft,gameObject.plankRight,gameObject.plank];
        gameObject.plankContainer = scene.add.container(config.width / 2, y, container);
        gameObject.plankContainer.setSize(plankWidth + plankSideWidth / 2, plankContainer_body_height);
        scene.physics.world.enable(gameObject.plankContainer);
        gameObject.plankContainer.body.setCollideWorldBounds(true);
        gameObject.plankContainer.body.setOffset(0,9);
        gameObject.plankContainer.body.setFriction(0, 0);
        //设置生命值
        gameObject.plankContainer.setData("life",gameProperties.plankLife);
        // //设置事件范围
        gameObject.plankContainer.setInteractive({draggable: true});
        // gameObject.plankContainer.input.hitArea.setTo(0, 0 , config.width , config.height);

        //设置能够拖动的范围
        gameObject.dragZone =  scene.add.zone(0,0,config.width,config.height);
        gameObject.dragZone.setOrigin(0);
        gameObject.dragZone.setInteractive();
    }

    /**
     *  初始化火炮对象
     *  @param scene 场景对象
     *
     *  @since 2020.07.15
     *  @author zhouhui
     */
    function initCannon(scene){
        const y = config.height - gameProperties.groundHeight;

        gameObject.cannonBody = scene.add.sprite(0, 0, "resources", "cannon1_001.png");
        gameObject.cannonBody.setOrigin(0.1,1);
        gameObject.cannonBody.angle = -30;

        gameObject.cannonBody.on('animationcomplete', function(){
            gameObject.ball.body.setVelocity(300, -200);
            if(gameProperties.isUseSound){
                gameObject.shootSound.play();
            }
            // gameObject.ball.setPosition(60,500);
            // gameObject.ball.body.setVelocity(0, -200);
            if(!gameObject.ball.anims.isPlaying){
                gameObject.ball.anims.play();
            }

            //开始游戏
            gameStatus.processStatus = 1;

            if(gameObject.cannonTween.isPaused()){
                gameObject.cannonTween.resume();
            }
        });


        gameObject.cannonWheel = scene.add.sprite(5, -7, "resources", "cannon_wheel.png");
        //gameObject.cannonWheel.setOrigin(0.5,0.5);

        let container = [gameObject.cannonBody,gameObject.cannonWheel];
        gameObject.cannonContainer = scene.add.container(-40, y, container);

        gameObject.cannonTween = scene.tweens.add({
            targets: gameObject.cannonContainer,
            x: 30,
            ease: 'Power1',
            duration: 2000,
            yoyo: true,
            repeat: 0,
            onStart: function () {

            },
            onYoyo: function(){
                gameObject.cannonTween.pause();
                gameObject.cannonBody.anims.play("cannonFire",true);
                gameObject.ball.x = gameObject.cannonContainer.x + 5;
                gameObject.ball.y = config.height - gameProperties.groundHeight - 2 * gameProperties.plankSideHeight / 3;
                gameObject.ball.setVisible(true);
            },
            onComplete: function () {
                gameObject.cannonBody.setTexture("resources", "cannon1_001.png");
            },
            onUpdate : function(){
                if(gameObject.cannonTween.progress <= 0.5){
                    gameObject.cannonWheel.angle += 1;
                }else{
                    gameObject.cannonWheel.angle -= 1;
                }
            }
        });
    }

    /**
     *  初始化火炮对象
     *  @param scene 场景对象
     *
     *  @since 2020.08.09
     *  @author zhouhui
     */
    function initLife(scene){
        const container = [];
        for(var i=0;i<gameProperties.plankLife;i++){
            const life = scene.add.sprite(i * 30 , 0, "resources", 'life1_001.png');
            life.setData("lifeBroken",function(){
               life.anims.play("lifeBroken",true);
            });
            life.on('animationcomplete', function(){
                life.setVisible(false);
                life.setTexture("resources", "life1_001.png");
            });
            container.push(life);
        }
        gameObject.lifeContainer = scene.add.container(20, 20, container);
    }

    /**
     *  初始化计分板
     *  @param scene 场景对象
     *
     *  @since 2020.08.09
     *  @author zhouhui
     */
    function initScoreBoard(scene){
        const container = [];
        gameProperties.maxScoreLength = gameProperties.maxScore.toString().length;
        for(var i=0;i<gameProperties.maxScoreLength;i++){
            const num = scene.add.sprite(i * 18 , 0, "resources", 'number1_000.png');
            container.push(num);
        }
        gameObject.scoreBoard = scene.add.container(20, 50, container);
    }

    /**
     *  初始化结束场景的计分板
     *  @param scene 场景对象
     *
     *  @since 2020.08.20
     *  @author zhouhui
     */
    function initEndScoreBoard(scene){
        gameObject.buttonStart = scene.add.sprite(config.width / 2, config.height / 2, "resources", "board1.png");
        gameObject.buttonStart.setInteractive();

        const container = [];
        let showScore = 0;
        if(gameProperties.maxScore <= gameProperties.score){
            showScore = gameProperties.maxScore;
        }else{
            showScore = gameProperties.score;
        }
        gameProperties.maxScoreLength = gameProperties.maxScore.toString().length;
        for(let i=0;i<gameProperties.maxScoreLength;i++){
            const num = scene.add.sprite((i-1) * 18 , 30, "resources", 'number1_000.png');
            container.push(num);
        }
        gameObject.scoreBoard = scene.add.container(config.width / 2, config.height / 2, container);

        const curScoreStr = showScore.toString();
        for(let i=0;i<curScoreStr.length;i++){
            const curNum = curScoreStr.substr(i,1);
            const numSite = gameProperties.maxScoreLength - (curScoreStr.length - i);
            const number = gameObject.scoreBoard.getAt(numSite);
            number.setTexture("resources", "number1_00"+curNum+".png");
        }

        //按钮
        const backMenu = scene.add.sprite(config.width / 2 - 40, config.height / 2 + 90, "resources", "bcakButton2.png");
        backMenu.setInteractive();
        backMenu.on('pointerdown', function () {
            scene.scene.start('mainmenu');
        });

        const backMainGame = scene.add.sprite(config.width / 2 + 40, config.height / 2 + 90, "resources", "bcakButton1.png");
        backMainGame.setInteractive();
        backMainGame.on('pointerdown', function () {
            scene.scene.start('maingame');
        });
    }

    /**
     *  初始化蜂窝
     *  @param scene 场景对象
     *
     *  @since 2020.08.09
     *  @author zhouhui
     */
    function initHoneycomb(scene){
        gameObject.honeycomb = scene.physics.add.sprite(config.width / 2, 18, "resources", "honeycomb1_001.png");
        gameObject.honeycomb.anims.play("honeycomb",true);
        gameObject.honeycomb.body.setSize(30,40);
        gameObject.honeycomb.body.setAllowGravity(false);
        gameObject.honeycomb.body.setImmovable(true);
        gameObject.honeycomb.setData("grade",50);
    }

    /**
     *  初始化背景树木
     *  @param scene 场景对象
     *
     *  @since 2020.08.11
     *  @author zhouhui
     */
    function initTree(scene){
        const leftTree = scene.add.sprite(-config.width / 2 + 20, 50, "resources", "tree1_001.png");
        const rightTree = scene.add.sprite(config.width / 2 - 20, 60, "resources", "tree1_002.png");
        const container = [leftTree,rightTree];
        gameObject.treeContainer = scene.add.container(config.width / 2, 0, container);
    }

    /**
     *  初始化树枝
     *  @param scene 场景对象
     *
     *  @since 2020.08.11
     *  @author zhouhui
     */
    function initBranch(scene){
        gameObject.branchGroup = scene.add.group();
        for(let j = 0; j < 4; j ++){
            for(let i = 0; i < 6; i ++){
                let item = null;
                if(j <= 1){
                    const index = Phaser. Math.Between(1,3);
                    item = scene.physics.add.sprite(i * 60 + 30, 80 + j * 13,"resources" ,"branch"+index+"_001.png");

                    item.setData("index",index);
                    item.setData("grade",12);
                    item.setData("life",2);
                }else{
                    item = scene.physics.add.sprite(i * 60 + 30, 80 + j * 13,"resources" ,"branch4_001.png");

                    item.setData("index",4);
                    item.setData("grade",5);
                    item.setData("life",1);
                }
                item.body.setAllowGravity(false);
                item.body.setSize(60,10);
                item.body.setImmovable(true);
                item.body.setFriction(0, 0);

                item.on('animationcomplete', function(){
                    item.destroy();
                });

                gameObject.branchGroup.add(item);
            }
        }

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
        gameObject.dragZone.on('pointerdown', function (pointer) {
            keyDown_playAnimation();
        });

        gameObject.dragZone.on('pointermove', function (pointer) {
            if(gameStatus.processStatus != 1){
                return;
            }
            if(pointer.wasTouch || pointer.isDown){
                gameObject.plankContainer.x = pointer.x;
            }
        });
        gameObject.dragZone.on('pointerup', function (pointer) {
            keyUp_pauseAnimation();
        });
        gameObject.dragZone.on('pointerupoutside', function (pointer) {
            keyUp_pauseAnimation();
        })
    }

    /**
     *  播放动画
     *
     *  @since 2020.07.22
     *  @author zhouhui
     */
    function keyDown_playAnimation(){
        if(gameStatus.processStatus != 1){
            return;
        }
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
     * 初始化声音对象
     * @param scene 场景对象
     *
     * @since 2020.08.23
     * @author zhouhui
     */
    function initMainGameSound(scene){
        gameObject.ballHitBranch = scene.sound.add("ballHitBranch");
        gameObject.ballHitPlank = scene.sound.add("ballHitPlank");
        gameObject.shootSound = scene.sound.add("shoot");
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
        if(gameProperties.isUseSound){
            gameObject.ballHitPlank.play();
        }
        if(plank.body.touching.up){
            gameObject.plank.anims.play("plankUp",true);
            let diff = ball.x - plank.x;
            if(diff == 0){
                ball.body.setVelocity(20 * Math.random() - 10, -300);
            }else{
                if(Math.abs(diff) < 10){
                    ball.body.setVelocity(diff * 20, -300);
                }else{
                    ball.body.setVelocity(diff * 10, -300);
                }
            }
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
        if(gameStatus.processStatus == 1){
            ball.body.setVelocity(0, 0);
            ball.anims.pause();
            const life = gameObject.plankContainer.getData("life");
            if(life - 1 >= 0){
                gameObject.lifeContainer.getAt(life-1).getData("lifeBroken")();
            }
            gameObject.plankContainer.setData("life",life - 1);
            gameStatus.processStatus = 2;
        }
    }

    /**
     * 小球与上方木板碰撞
     * @param ball 小球
     * @param ground 地面
     *
     * @since 2020.08.18
     * @author zhouhui
     */
    function ballHitBranch(ball,branch){
        if(gameProperties.isUseSound){
            gameObject.ballHitBranch.play();
        }
        //碰撞上面或者下面才有效果
        if(branch.body.touching.up || branch.body.touching.down){
            //生命值
            const life = branch.getData("life");
            const index = branch.getData("index");
            if(life - 1 > 0){
                branch.setData("life",life - 1);
                if(life - 1 == 1){
                    branch.setTexture("resources", "branch"+index+"_002.png");
                }
            }else{
                //消除得分
                gameProperties.score += branch.getData("grade");
                branch.anims.play("branchBreak"+index,true);
                branch.body.setAllowGravity(true);
                //branch.body.setImmovable(false);
                branch.body.setEnable(false);
            }
        }

    }

    /**
     * 小球与蜂窝进行碰撞
     * @param ball 小球
     * @param honeycomb 蜂窝
     *
     * @since 2020.08.18
     * @author zhouhui
     */
    function ballHitHoneycomb(ball,honeycomb){
        if(gameObject.branchGroup.children.size == 0){
            ball.destroy();
            honeycomb.body.setAllowGravity(true);
            honeycomb.body.setImmovable(false);
            if(honeycomb.anims.isPlaying){
                honeycomb.anims.pause();
                honeycomb.setTexture("resources", "honeycomb2_001.png");
            }
        }
    }

    /**
     * 蜂窝碰撞地面
     * @param honeycomb 小球
     * @param ground 地面
     *
     * @since 2020.08.19
     * @author zhouhui
     */
    function honeycombHitGround(honeycomb,ground){
        honeycomb.destroy();
        window.setTimeout(function(){
            gameStatus.processStatus = 4;
        },3000);
    }

    /**
     * 蜂窝碰撞木板
     * @param honeycomb 小球
     * @param ground 地面
     *
     * @since 2020.08.19
     * @author zhouhui
     */
    function honeycombHitPlank(honeycomb,plank){
        if( plank.body.touching.up ){
            gameProperties.score += honeycomb.getData("grade");
            honeycomb.destroy();
            window.setTimeout(function(){
                gameStatus.processStatus = 4;
            },3000);
        }
    }
};