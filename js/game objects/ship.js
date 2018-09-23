function Ship(id, position, width, height, color, goManager, svg) {
    if (!(this instanceof Ship)) {
        return new Ship(id, position, width, height, color, goManager, svg);
    }

    this.id = id;
    this.svg = svg;
    this.polygone;
    this.group;
    this.fire1;
    this.fire2;
    this.fire = 0;
    this.fireMax = 10;
    this.fireUp = true;
    this.fireDown = false;
    this.fireReset = false;

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
    this.frictionForce = 0.03;

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
    this.isInvisible = true;
    this.lastAngle = 0;
}

Ship.prototype.update = function () {

    this.velocityMag = this.velocity.magnitude();
    // console.log(this.velocityMag);


    // this.velocity.setComponents(this.velocity.angle(), 3);
    // this.velocity.normalize();



    if (this.doRight) {
        this.angle -= this.rotationAngle;
        // this.rotate()
        // this.velocity.setComponents(this.angle, this.velocityMag);
        this.rotationAngle += 0.2;
    }

    if (this.doLeft) {
        this.angle += this.rotationAngle;
        // this.rotate();
        // this.velocity.setComponents(this.angle, this.velocityMag);
        this.rotationAngle += 0.2;
    }

    if (!this.doLeft && !this.doRight) {
        this.rotationAngle = 1;
    }

    if (this.doThrust) {


        this.acceleration.setComponents(this.angle, this.thrust);
        this.animateThrust();

        if (this.lastAngle != this.angle) {
            this.velocity.remove(this.acceleration);
        }

        this.lastAngle = this.angle;
    } else {
        // this.acceleration.normalize();

        this.resetThrust();
        this.doFriction = true;
        this.acceleration.zero();
        if (this.velocityMag > -0.75 && this.velocityMag < 0.75) {
            this.velocity.zero();
            this.friction.zero();
            this.doFriction = false;
        }
    }


    if (this.doFriction) {
        console.log('do friction');
        this.friction.setComponents(this.lastAngle, this.frictionForce);
    }

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

Ship.prototype.animateThrust = function () {

    if (this.fireUp) {
        if (this.fire <= this.fireMax) {
            this.fire += 1;
            this.fire1.setAttribute('width', this.fire);
            this.fire1.setAttribute('x', (-this.fire + 5));
            this.fire2.setAttribute('width', (this.fire + 5));
            this.fire2.setAttribute('x', (-this.fire));
        } else {
            this.fireDown = true;
            this.fireUp = false;
        }
    }

    if (this.fireDown) {
        if (this.fire <= 5) {
            this.fireDown = false;
            this.fireUp = true;

        } else {
            this.fire -= 2;
            this.fire1.setAttribute('width', this.fire);
            this.fire1.setAttribute('x', (-this.fire + 5));
            this.fire2.setAttribute('width', (this.fire + 5));
            this.fire2.setAttribute('x', (-this.fire));
        }
    }

    this.fireReset = false;
}

Ship.prototype.resetThrust = function () {
    if (!this.fireReset) {
        this.fireReset = true;
        this.fire1.setAttribute('width', 0);
        this.fire1.setAttribute('x', 5);
        this.fire2.setAttribute('width', 0);
        this.fire2.setAttribute('x', 5);
    }
}

Ship.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.polygone = document.createElementNS(xmlns, 'polygon');
    this.polygone.setAttribute('fill', this.color);
    this.polygone.setAttribute('points', '12.5,27.5 22.5,27.5 22.5,22.5 32.5,22.5 32.5,17.5 22.5,17.5 22.5,12.5 12.5,12.5 12.5,7.5 7.5,7.5 7.5,32.5 12.5,32.5');
    this.group.appendChild(this.polygone);

    this.fire1 = document.createElementNS(xmlns, 'rect');
    this.fire1.setAttribute('x', 5);
    this.fire1.setAttribute('y', 13);
    this.fire1.setAttribute('width', 5);
    this.fire1.setAttribute('height', 15);
    this.fire1.setAttribute('fill', '#FFD22F');
    this.group.appendChild(this.fire1);


    this.fire2 = document.createElementNS(xmlns, 'rect');
    this.fire2.setAttribute('x', 5);
    this.fire2.setAttribute('y', 18);
    this.fire2.setAttribute('width', 5);
    this.fire2.setAttribute('height', 5);
    this.fire2.setAttribute('fill', '#FF922F');
    this.group.appendChild(this.fire2);

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
    // this.angle = 0
    this.velocity = Vector();
    this.isInvisible = true;
    this.group.style.opacity = 0.5;
    this.group.style.transition = 'opacity 0.5s ease-out 0.1s';

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
        case 77:
            this.shootMissile();
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

Ship.prototype.shootMissile = function () {
    this.goManager.addMissile();
}
