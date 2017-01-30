function GOManager() {
    if (!(this instanceof GOManager)) {
        return new GOManager();
    }

    this.appManager = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.xmlns = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(this.xmlns, 'svg');
    this.svg.setAttribute('id', 'rootsvvg');
    this.svg.setAttribute('width', window.innerWidth);
    this.svg.setAttribute('height', window.innerHeight);
    this.svg.style.left = 0;
    this.svg.style.top = 0;
    document.body.appendChild(this.svg);

    //objects
    this.goCounter = 0;
    this.ship = null;
    this.poolAsteroids = new Map();
    this.poolBullets = new Map();
    this.poolAliens = new Map;
    this.poolAlienBullets = new Map();

    this.alientTimer = 0;
}

GOManager.prototype.update = function () {
    for (let bullet of this.poolBullets.values()) {
        bullet.update();

        if (!bullet.isRemove) {
            for (let asteroid of this.poolAsteroids.values()) {
                if (hitPointOnRect(bullet.position.x, bullet.position.y, asteroid.getBounds())) {
                    bullet.remove();
                    // this.addAsteroidOnBulletHit(asteroid);
                    break;
                }
            }
        }

        if (!bullet.isRemove) {
            for (let alien of this.poolAliens.values()) {
                if (hitPointOnRect(bullet.position.x, bullet.position.y, alien.getBounds())) {
                    bullet.remove();
                    // this.appManager.updateScoreTitle(alien.price);
                    alien.remove();
                    break;
                }
            }
        }
    }

    for (let asteroid of this.poolAsteroids.values()) {

        if (this.ship != null) {
            if (!this.ship.isInvisible) {
                if (hitRectOnRect(asteroid.getBounds(), this.ship.getBounds())) {
                    this.addAsteroidOnBulletHit(asteroid);
                    // if (this.appManager.shipHit()) {
                    // this.ship.reset();
                    // }
                    break;
                }
            }
        }

        asteroid.update();
    }

    for (let alien of this.poolAliens.values()) {
        alien.update();
    }

    for (let bullet of this.poolAlienBullets.values()) {
        bullet.update();
        /*
        if (this.ship != null) {
            if (!this.ship.isInvisible) {
                if (!bullet.isRemove) {
                    if (this.ship != null) {
                        if (hitPointOnRect(bullet.position.x, bullet.position.y, this.ship.getBounds())) {
                            // gameEnd();
                            break;
                        }
                    }
                }
            }
        }
        */
    }

    if (this.ship != null) {
        this.ship.update();
    }
}

//Add Methods
GOManager.prototype.addShip = function () {
    this.ship = Ship(this.goCounter, Vector(window.innerWidth / 2, window.innerHeight / 2), 40, 40, this.appManager.shipColor, this, this.svg);
}

GOManager.prototype.addBullet = function () {
    let shootPosition = Vector((this.ship.position.x + (this.ship.width / 2) - 5), (this.ship.position.y + (this.ship.height / 2) - 3));
    this.goCounter++;
    let bullet = Bullet(this.goCounter, shootPosition, this.ship.angle, (7 + this.ship.velocityMag), this.ship.color, this, false, this.svg);
    this.poolBullets.set(this.goCounter, bullet);
}

GOManager.prototype.addAlienBullet = function (alien) {

    let position;
    let direction = 0;
    if (alien.shootUp) {
        direction = randomBtween(260, 315);
        position = Vector(alien.position.x + (alien.width / 2), alien.position.y);
    } else {
        direction = randomBtween(45, 110);
        position = Vector(alien.position.x + (alien.width / 2), (alien.position.y + alien.height));
    }

    // let shootPosition = Vector(alien.position.x, alien.position.y);
    this.goCounter++;
    let bullet = Bullet(this.goCounter, position, direction, randomBtween(2, 5), alien.color, this, true, this.svg);
    this.poolAlienBullets.set(this.goCounter, bullet);
}

GOManager.prototype.addAsteroids = function (levelData) {

    let time = 0;
    for (var i = 0; i < levelData.length; i++) {

        // levelAlienTimer.push(time);
        let y = -100;
        let x = 0;

        if (i % 2 == 0) {
            x = randomBtween(20, ((this.width / 2) - 200));

        } else {
            x = randomBtween(((this.width / 2) + 100), (this.width - 20));
        }

        if (i % 3 == 0) {
            y = this.height;
        }

        this.goCounter++;
        let asteroid = Asteroid(this.goCounter, Vector(x, y), randomBtween(-90, 90), randomBtween(1, 3), levelData[i], this.appManager.asteroidColor, this, this.svg);
        this.poolAsteroids.set(this.goCounter, asteroid);
    }

    this.startAlienAttack();
}

GOManager.prototype.addAsteroidOnBulletHit = function (asteroid) {

    this.appManager.updateScoreTitle(asteroid.price);

    if (asteroid.type == 3 || asteroid.type == 4) {
        this.goCounter++;
        let asteroid1 = Asteroid(this.goCounter, Vector(asteroid.position.x, asteroid.position.y), randomBtween(0, 360), randomBtween(1, 4), 2, this.appManager.asteroidColor, this, this.svg);
        this.poolAsteroids.set(this.goCounter, asteroid1);

        this.goCounter++;
        let asteroid2 = Asteroid(this.goCounter, Vector(asteroid.position.x, asteroid.position.y), randomBtween(0, 360), randomBtween(2, 5), 2, this.appManager.asteroidColor, this, this.svg);
        this.poolAsteroids.set(this.goCounter, asteroid2);
    } else if (asteroid.type == 2) {
        this.goCounter++;
        let asteroid1 = Asteroid(this.goCounter, Vector(asteroid.position.x, asteroid.position.y), randomBtween(0, 360), randomBtween(1, 3), 1, this.appManager.asteroidColor, this, this.svg);
        this.poolAsteroids.set(this.goCounter, asteroid1);

        this.goCounter++;
        let asteroid2 = Asteroid(this.goCounter, Vector(asteroid.position.x, asteroid.position.y), randomBtween(0, 360), randomBtween(1, 3), 1, this.appManager.asteroidColor, this, this.svg);
        this.poolAsteroids.set(this.goCounter, asteroid2);
    }

    asteroid.remove();

    if (this.poolAsteroids.size == 0) {
        this.appManager.startNewLevel();
    }

}

GOManager.prototype.addAlien = function () {


    let y = 0;
    let x = 0;
    let direction = 0;

    let i = randomBtween(0.20);
    if (i % 2 == 0) {
        x = 0;
        y = randomBtween(50, this.height - 50);
        direction = randomBtween(-45, 45);
    } else {
        y = randomBtween(50, this.height - 50);
        x = this.width;
        direction = randomBtween(-145, -225);

    }

    let position = Vector(x, y);

    this.goCounter++;
    let alien = Alien(this.goCounter, position, direction, randomBtween(1, 3), randomBtween(1, 3), this.appManager.alienColor, this, this.svg);
    this.poolAliens.set(this.goCounter, alien);

}

//Remove Methods
GOManager.prototype.removeBullet = function (go) {
    this.poolBullets.delete(go.id);
    go = null;
}

GOManager.prototype.removeAlienBullet = function (go) {
    this.poolAlienBullets.delete(go.id);
    go = null;
}

GOManager.prototype.removeAsteroid = function (go) {
    // addExplotion(go);
    this.poolAsteroids.delete(go.id)
    go = null;
}

GOManager.prototype.removeAlien = function (go) {
    // addExplotion(go);
    this.poolAliens.delete(go.id);
    go = null;
}

GOManager.prototype.removeShip = function (go) {
    go = null;
    this.ship = null;
}

GOManager.prototype.cleanForNewLevel = function () {
    this.cleanAsteroids();
    this.cleanAliens();
    this.cleanBullets();
    this.cleanAlienBullets();
}

GOManager.prototype.clean = function () {
    this.cleanAsteroids();
    this.cleanAliens();
    this.cleanBullets();
    this.cleanAlienBullets();
    this.removeShip();
}

GOManager.prototype.cleanAsteroids = function () {
    this.poolAsteroids.forEach(function (asteroid) {
        asteroid.remove();
    }, this);
}

GOManager.prototype.cleanBullets = function () {
    this.poolBullets.forEach(function (bullet) {
        bullet.remove();
    }, this);
}

GOManager.prototype.cleanAlienBullets = function () {
    this.poolAlienBullets.forEach(function (bullet) {
        bullet.remove();
    }, this);
}

GOManager.prototype.cleanAliens = function () {
    this.poolAsteroids.forEach(function (alien) {
        alien.remove();
    }, this);
}

GOManager.prototype.startAlienAttack = function () {

    let time = this.poolAsteroids.size * 2000;
    if (time < 15000) {
        time = 20000;
    }

    console.log(time);


    this.addAlien();
    let _this = this;
    this.alientTimer = setTimeout(function () {
        _this.startAlienAttack();
    }, time);
}