window.addEventListener('load', init, false);

function init() {

    var stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '' + 100 + 'px';

    let goManager = GOManager(),
        levelManager = LevelManager(),
        appManager = AppManager(goManager, levelManager);

    function update() {
        stats.begin();

        if (!appManager.isShowingInformation) {
            goManager.update();
        }
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
    appManager.information = document.getElementById('information');
    appManager.informationView = document.getElementById('informationView');
    appManager.informationPath = document.getElementById('informationPath');
    appManager.livesTitle = document.getElementById('livesTitle');
    appManager.github.addEventListener('click', appManager.onGithub, false);
    appManager.twitter.addEventListener('click', appManager.onTwitter, false);
    appManager.information.onclick = onInformation;
    appManager.informationView.style.opacity = 0;
    appManager.startBtn.onclick = startBtnClick;


    function onInformation(e) {
        console.log('in');
        appManager.onInformation(e);
    }

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

    function showGameInformation(e) {

    }
}
