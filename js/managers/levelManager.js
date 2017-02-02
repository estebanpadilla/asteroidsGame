function LevelManager() {
    if (!(this instanceof LevelManager)) {
        return new LevelManager();
    }

    this.appManager = null;
    this.level = 1;
    this.levelData = [];
    this.asteroidCounter = 0;
}

LevelManager.prototype.createLevel = function () {
    this.level++;
    this.levelData = [];
    let asteroidBase = 5
    this.asteroidCounter = this.level + asteroidBase;

    for (let i = 0; i < this.asteroidCounter; i++) {
        this.levelData.push(randomBtween(4, 1));
    }

    let _this = this;
    this.timer = setTimeout(function () {
        _this.startNewLevel();
    }, 2000);
}

LevelManager.prototype.startNewLevel = function () {
    this.appManager.goManager.addAsteroids(this.levelData);
}