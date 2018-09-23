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
    this.information = null;
    this.informationView = null;
    this.livesTitle = null;
    this.isShowingInformation = false;

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

    this.informationPath;
    this.xPath = 'M51.1,0c-27.6,0-50,22.4-50,50c0,27.6,22.4,50,50,50c27.6,0,50-22.4,50-50C101.1,22.4,78.7,0,51.1,0z M74.6,65.8l-7.8,7.8L51.1,57.8L35.3,73.6l-7.8-7.8L43.3,50L27.5,34.2l7.8-7.8l15.8,15.8l15.8-15.8l7.8,7.8L58.8,50L74.6,65.8z';
    this.infoPath = 'M50,0C22.4,0,0,22.4,0,50c0,27.6,22.4,50,50,50c27.6,0,50-22.4,50-50C100,22.4,77.6,0,50,0z M55.5,75.8h-11 V39.2h11V75.8z M55.5,34.8h-11V24.7h11V34.8z';

}

AppManager.prototype.startBtnClick = function (e) {

    this.lives = 1;
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

AppManager.prototype.onInformation = function () {

    if (this.isShowingInformation) {
        this.isShowingInformation = false;
        this.informationView.style.opacity = 0;
        this.informationView.style.transition = 'opacity 0.15s ease-out';
        this.informationPath.setAttribute('d', this.infoPath);
    } else {
        this.isShowingInformation = true;
        this.informationView.style.opacity = 1;
        this.informationView.style.transition = 'opacity 0.15s ease-in';
        this.informationPath.setAttribute('d', this.xPath);
    }
}