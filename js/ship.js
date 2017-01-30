function Ship(id, position, width, height, color, goManager, svg) {
    if (!(this instanceof Ship)) {
        return new Ship(id, position, width, height, color, goManager, svg);
    }

    this.id = id;
    this.svg = svg;
    this.polygone;
    this.group;

    this.originalPos = Vector(position.x, position.y);
    this.position = position;
    this.width = width;
    this.height = height;
    this.color = color;
    this.angle = 0;

    this.velocityMag = 0;
    this.velocity = Vector();
    this.friction = Vector();
    this.acceleration = Vector();

    this.thrust = 0.1;
    this.frictionForce = 0.05;

    //Controls
    this.doRight = false;
    this.doLeft = false;
    this.doThrust = false;
    this.doShoot = false;
    this.doFriction = true;

    this.canShoot = true;
    this.shootCounter = 0;
    this.shootCounterLimit = 10;
    // this.addBullet = addBullet;
    // this.removeShip = removeShip;
    this.goManager = goManager;
    this.render();
    this.update();
    this.rotationAngle = 1;
    this.isInvisible = false;
    this.lastAngle = 0;
}

Ship.prototype.update = function () {

    this.velocityMag = this.velocity.magnitude();

    if (this.doRight) {
        this.angle -= this.rotationAngle;
        // this.rotate()
        // this.velocity.setComponents(this.angle, this.velocityMag);
        this.rotationAngle += 0.25;
    }

    if (this.doLeft) {
        this.angle += this.rotationAngle;
        // this.rotate();
        // this.velocity.setComponents(this.angle, this.velocityMag);
        this.rotationAngle += 0.25;
    }


    if (!this.doLeft && !this.doRight) {
        this.rotationAngle = 1;
    }

    if (this.doThrust) {
        this.lastAngle = this.angle;
        this.doFriction = true;
        this.acceleration.setComponents(this.lastAngle, this.thrust);
        this.friction.setComponents(this.lastAngle, this.frictionForce);
    } else {
        this.doThrust = false;
        this.acceleration.zero(;)
        if (this.velocityMag > -0.25 && this.velocityMag < 0.25) {
            this.velocity.zero();
            this.friction.zero();
            this.doFriction = false;
        }
    }

    // if (this.doFriction) {
    // this.friction.setComponents(this.lastAngle, this.frictionForce);
    // }

    if (this.doShoot) {
        this.shootCounter++;
        if (this.shootCounter >= this.shootCounterLimit) {
            this.canShoot = true;
            this.shootCounter = 0;
            this.goManager.addBullet();
        } else {
            this.canShoot = false;
        }
    }

    this.position.add(this.velocity.remove(this.friction).add(this.acceleration));
    this.checkBoundaries();
    this.group.setAttribute('transform', 'translate(' + this.position.x + ' ' + this.position.y + ') rotate(' + this.angle + ' ' + ((this.width / 2) - 4) + ' ' + (this.height / 2) + ')');
}

Ship.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.polygone = document.createElementNS(xmlns, 'polygon');
    this.polygone.setAttribute('fill', this.color);
    this.polygone.setAttribute('points', '12.5,27.5 22.5,27.5 22.5,22.5 32.5,22.5 32.5,17.5 22.5,17.5 22.5,12.5 12.5,12.5 12.5,7.5 7.5,7.5 7.5,32.5 12.5,32.5');
    this.group.appendChild(this.polygone);
}

Ship.prototype.rotate = function () {
    this.group.setAttribute('transform', 'rotate(' + this.angle + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
};

Ship.prototype.checkBoundaries = function () {

    if (this.position.x > (window.innerWidth + this.width)) {
        this.position.x = (0 - this.width);
    }

    if (this.position.x < (0 - this.width)) {
        this.position.x = window.innerWidth;
    }

    if (this.position.y > (window.innerHeight + this.height)) {
        this.position.y = (0 - this.height);
    }

    if (this.position.y < (0 - this.height)) {
        this.position.y = window.innerHeight;
    }
}

Ship.prototype.remove = function () {
    this.svg.removeChild(this.group);
    this.goManager.removeShip(this);
    // window.addEventListener('keydown', keydownHandler, false);
    // window.addEventListener('keyup', keyupHandler, false);
}

Ship.prototype.getBounds = function () {
    return Rect((this.position.x + 5), (this.position.y + 20), (this.width - 20), (this.height - 20));
}

Ship.prototype.reset = function () {
    // this.polygone.setAttribute('points', '');
    this.position = Vector(this.originalPos.x, this.originalPos.y);
    this.angle = 0
    this.velocity = Vector();
    this.isInvisible = true;
    this.group.style.opacity = 0.5;
    let _this = this;
    this.timer = setTimeout(function () {
        _this.hideInvisible(_this);
    }, 3000);
}

Ship.prototype.hideInvisible = function () {
    this.isInvisible = false;
    this.group.style.opacity = 1;
}

Ship.prototype.keydownHandler = function (key) {

    switch (key) {
        case 39://left
            this.doLeft = true;
            break;
        case 37://right
            this.doRight = true;
            break;
        case 38:
            this.doThrust = true;
            break;
        case 32:
            this.doShoot = true;
            break;
        default:
            break;
    }
}

Ship.prototype.keyupHandler = function (key) {
    switch (key) {
        case 39://left
            this.doLeft = false;
            break;
        case 37://right
            this.doRight = false;
            break;
        case 38:
            this.doThrust = false;
            break;
        case 32:
            this.doShoot = false;
            break;
        default:
            break;
    }
}
