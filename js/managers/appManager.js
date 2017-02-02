function AppManager(goManager, levelManager) {
    if (!(this instanceof AppManager)) {
        return new AppManager(goManager, levelManager);
    }

    this.levelManager = levelManager;
    this.levelManager.appManager = this;
    this.goManager = goManager;
    this.goManager.appManager = this;

    this.scoreTitle = null;
    this.levelTitle = null;
    this.startBtn = null;
    this.title = null;
    this.subtitle1 = null;
    this.subtitle2 = null;
    this.text = null;
    this.line = null;
    this.github = null;
    this.twitter = null;
    this.livesTitle = null;

    this.lives = 1;
    this.score = 0;
    this.scoreForLife = 0;
    this.asteroidBig = 10;
    this.asteroidMed = 15;
    this.asteroidSmall = 25;
    this.alienBig = 10;
    this.alienMed = 15;
    this.alienSmall = 5;

    this.shipColor = '#5B5B5B';
    this.asteroidColor = '#FF2F63';
    this.alienColor = '#0098AB';

    this.levelManager.createLevel();
}

AppManager.prototype.startBtnClick = function (e) {

    this.lives = 3;
    this.score = 0;
    this.scoreForLife = 0;
    this.levelManager.level = 0;

    this.startBtn.disabled = true;
    this.startBtn.style.opacity = 0;
    this.title.style.opacity = 0;
    this.subtitle1.style.opacity = 0;
    this.subtitle2.style.opacity = 0;
    this.text.style.opacity = 0;
    this.line.style.opacity = 0;

    this.startBtn.style.transition = 'opacity 0.25s ease-out';
    this.title.style.transition = 'opacity 0.25s ease-out';
    this.subtitle1.style.transition = 'opacity 0.25s ease-out';
    this.subtitle2.style.transition = 'opacity 0.25s ease-out';
    this.text.style.transition = 'opacity 0.25s ease-out';
    this.line.style.transition = 'opacity 0.25s ease-out';

    this.updateLevelTitle();
    this.updateScoreTitle(0);
    this.updateLivesTitle(0);

    this.startNewLevel();
    this.goManager.addShip();
}

AppManager.prototype.updateLevelTitle = function () {
    this.levelTitle.firstChild.nodeValue = '' + (this.levelManager.level);
}

AppManager.prototype.updateScoreTitle = function (value) {
    this.scoreForLife += value;
    this.score += value;
    this.scoreTitle.firstChild.nodeValue = '' + this.score;
    if (this.scoreForLife >= 1000) {
        this.updateLivesTitle(1);
    }
}

AppManager.prototype.updateLivesTitle = function (value) {
    this.scoreForLife = 0;
    this.lives += value;
    this.livesTitle.innerText = '' + this.lives;
}

AppManager.prototype.keydownHandler = function (key) {
    if (this.goManager.ship != null) {
        this.goManager.ship.keydownHandler(key);
    }
}

AppManager.prototype.keyupHandler = function (key) {
    if (this.goManager.ship != null) {
        this.goManager.ship.keyupHandler(key);
    }
}

AppManager.prototype.startNewLevel = function () {
    this.goManager.cleanForNewLevel();
    this.levelManager.createLevel();
    this.updateLevelTitle();
}

AppManager.prototype.shipHit = function () {

    if (this.lives == 0) {
        this.gameEnd();
    } else {
        this.goManager.ship.reset();
        this.updateLivesTitle(-1);
    }
    return true;
}


AppManager.prototype.gameEnd = function () {

    this.goManager.ship.remove();
    this.startBtn.disabled = false;
    this.startBtn.style.opacity = 1;
    this.title.style.opacity = 1;
    this.subtitle1.style.opacity = 1;
    this.subtitle2.style.opacity = 1;
    this.text.style.opacity = 1;
    this.line.style.opacity = 1;

    this.startBtn.style.transition = 'opacity 2s ease-in';
    this.startBtn.style.transitionDelay = '0.5s';
    this.title.style.transition = 'opacity 1s ease-in';
    this.subtitle1.style.transition = 'opacity 1s ease-in';
    this.subtitle2.style.transition = 'opacity 1s ease-in';
    this.text.style.transition = 'opacity 1s ease-in';
    this.line.style.transition = 'opacity 1s ease-in';
}