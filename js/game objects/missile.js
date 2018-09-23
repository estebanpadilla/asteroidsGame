function Missile(id, position, direction, speed, color, goManager, svg) {
    if (!(this instanceof Missile)) {
        return new Missile(id, position, direction, speed, color, goManager, svg);
    }

    this.id = id;
    this.svg = svg;
    this.rect = null;
    this.group = null;


    this.position = position;
    this.width = 10;
    this.height = 5;
    this.color = color;
    this.angle = direction;
    this.speed = 2;
    this.target = null;

    this.velocity = Vector().setComponents(this.angle, this.speed);

    this.goManager = goManager;

    this.render()

    this.isRemove = false;

    this.counter = 0;
    this.counterLimit = 80;
}

Missile.prototype.update = function () {
    // this.velocityMag = this.velocity.magnitude();

    if (this.counter >= this.counterLimit) {
        if (this.target == null) {
            this.lookForTarget();
        } else {
            // let targetPosition = Vector(this.target.position.x, this.target.position.y);
            // targetPosition.normalize();

            // this.velocity.add(targetPosition);

            let targetAngle = this.position.angleTo(this.target.position);
            // let newAngle = lerp(0.3, targetAngle, this.position.angle());
            // let newPosition = Vector(lerp(0.5, this.position.x, this.target.position.x), lerp(0.5, this.position.y, this.target.position.y));
            this.velocity.setComponents(toDegrees(targetAngle), 5);
            // this.velocity.rotateTo(targetAngle);
            // this.velocity.add(newPosition);

        }
    } else {
        this.counter++;
    }

    this.position.add(this.velocity);
    this.checkBoundaries();

    if (!this.isRemove) {
        this.group.setAttribute('transform', 'translate(' + this.position.x + ' ' + this.position.y + ') rotate(' + this.angle + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
    }
}

Missile.prototype.lookForTarget = function () {
    this.target = this.goManager.lookForAlientTarget();
}

Missile.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";

    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.rect = document.createElementNS(xmlns, 'rect')
    this.rect.setAttribute('width', this.width);
    this.rect.setAttribute('height', this.height);
    this.rect.setAttribute('fill', this.color);
    this.group.appendChild(this.rect);
}

Missile.prototype.checkBoundaries = function () {

    // if (this.position.x > (window.innerWidth + this.width) ||
    //     this.position.x < (0 - this.width) ||
    //     this.position.y > (window.innerHeight + this.height) ||
    //     this.position.y < (0 - this.height)) {
    //     // this.remove();
    // }


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

Missile.prototype.remove = function () {
    this.isRemove = true;
    if (this.isAlien) {
        // this.goManager.removeAlienBullet(this);
    } else {
        // this.goManager.removeBullet(this);
    }

    this.svg.removeChild(this.group);
    this.position = null;
    this.velocity = null;
    this.svg = null
    this.rect = null;
    this.group = null;
}
