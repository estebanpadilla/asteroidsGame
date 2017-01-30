window.addEventListener('load', init, false);

function init() {

    var stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    let goManager = GOManager(),
        levelManager = LevelManager(),
        appManager = AppManager(goManager, levelManager);


    function update() {
        stats.begin();

        goManager.update();

        stats.end();
        requestId = requestAnimationFrame(update);
    }

    update();

    appManager.scoreTitle = document.getElementById('scoreTitle');
    appManager.levelTitle = document.getElementById('levelTitle');
    appManager.startBtn = document.getElementById('playBtn');
    appManager.title = document.getElementById('title');
    appManager.subtitle1 = document.getElementById('subtitle1');
    appManager.subtitle2 = document.getElementById('subtitle2');
    appManager.text = document.getElementById('text');
    appManager.line = document.getElementById('line');
    appManager.github = document.getElementById('github');
    appManager.twitter = document.getElementById('twitter');
    appManager.livesTitle = document.getElementById('livesTitle');
    appManager.github.addEventListener('click', appManager.onGithub, false);
    appManager.twitter.addEventListener('click', appManager.onTwitter, false);
    appManager.startBtn.onclick = startBtnClick;

    function startBtnClick(e) {
        appManager.startBtnClick(e);
        window.addEventListener('keydown', keydownHandler, false);
        window.addEventListener('keyup', keyupHandler, false);
    }

    function keydownHandler(e) {
        appManager.keydownHandler(e.keyCode);
        e.preventDefault();
        return false;
    }

    function keyupHandler(e) {
        appManager.keyupHandler(e.keyCode);
    }

    function addExplotion(go) {
        // const brust = new mojs.Burst({
        //     left: (go.position.x + (go.width / 2)),
        //     top: (go.position.y + (go.height / 2)),
        //     radius: ramdonIn(30, 100),
        //     count: ramdonIn(5, 10),
        //     opacity: { 1: 0 },
        //     fill: go.color,
        // }).play();
        const burst = new mojs.Burst({
            left: (go.position.x + (go.width / 2)),
            top: (go.position.y + (go.height / 2)),
            radius: { 0: (go.type * 50) },
            angle: { 0: randomBtween(0, 90) },
            count: randomBtween(3, 10),
            isShowEnd: false,
            children: {
                shape: 'rect',
                fill: go.color,
                radius: 5
            },
            onComplete: function () { removeEl(this.el); }
        }).play();


        const circle = new mojs.Shape({
            left: (go.position.x + (go.width / 2)),
            top: (go.position.y + (go.height / 2)),
            stroke: go.color,
            strokeWidth: { 10: randomBtween(10, (go.type * 10)) },
            fill: 'none',
            scale: { .2: 1 },
            opacity: { 1: 0 },
            // isForce3d: true,
            isShowEnd: false,
            radius: randomBtween(40, (go.type * 60)),
            easing: 'cubic.out',
            delay: randomBtween(100, 200),
            onComplete: function () { removeEl(this.el); }
        }).play();


    }

    var removeEl = function removeEl(node) { node.parentNode.removeChild(node); }

    // function levelCompleted() {
    //     // cleanBullets();
    //     setTimeout(startNewLevel, 2000);
    //     level++;
    //     levelData = [];
    //     let asteroidBase = 5
    //     asteroidCounter = level + asteroidBase;
    //     showAlientTime = asteroidBase * 3;

    //     for (let i = 0; i < asteroidCounter; i++) {
    //         levelData.push(ramdonIn(4, 1));
    //     }
    // }

    function startNewLevel() {

        // if (level < levels.length) {
        // levelTitle.firstChild.nodeValue = '' + (level);
        // addAsteroids();

        // } else {
        // gameEnd();
        // }



    }

    function continuePlayig() {
        lives--;
        livesTitle.innerText = '' + lives;
        ship.showInvisible();
    }

    //Construction methods
    function ramdonColor() {
        let value = randomBtween(1, 11);
        switch (value) {
            case 1:
                return red;
                break;
            case 2:
                return lightblue;
                break;
            case 3:
                return creme;
                break;
            case 4:
                return red;
                break;
            case 5:
                return red;
                break;
            case 6:
                return lightblue;
                break;
            case 7:
                return creme;
                break;
            case 8:
                return red;
                break;
            case 9:
                return creme;
                break;
            case 10:
                return red;
                break;
            default:
                return lightblue;
                break;
        }
    }

    function ramdonDirection() {
        let value = randomBtween(1, 11);
        switch (value) {
            case 1:
                return 90;
                break;
            case 2:
                return -90;
                break;
            case 3:
                return 90;
                break;
            case 4:
                return -90;
                break;
            case 5:
                return 90;
                break;
            case 6:
                return -90;
                break;
            case 7:
                return 90;
                break;
            case 8:
                return -90;
                break;
            case 9:
                return 90;
                break;
            case 10:
                return -90;
                break;
            default:
                return 90;
                break;
        }
    }



}
