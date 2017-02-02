function Asteroid(id, position, direction, speed, type, color, goManager, svg) {
    if (!(this instanceof Asteroid)) {
        return new Asteroid(id, position, direction, speed, type, color, goManager, svg);
    }

    this.id = id;
    this.svg = svg;
    this.polygone;
    this.group;
    this.speed = speed;
    this.position = position;
    this.type = type;
    this.points = '';
    this.width = 0;
    this.height = 0;
    this.color = color;
    this.price = 0;
    this.angle = direction;
    this.velocity = Vector().setComponents(this.angle, this.speed);


    if (type == 4) {
        //Big 1
        this.points = '80,40 80,35 75,35 75,25 65,25 65,15 55,15 55,10 40,10 40,5 30,5 30,10 25,10 25,20 15,20 15,30 5,30 5,35 0,35 0,40 5.3,40 5.3,45 0,45 0,50 5,50 5,55 15,55 15,65 25,65 25,70 35,70 35,75 60,75 60,65 70,65 70,55 75,55 75,50 80,50 80,45 74.7,45 74.7,40';
        this.width = 80;
        this.height = 80;
        this.price = 15;
    } else if (type == 3) {
        //Big 2
        this.points = '65,15 65,10 55,10 55,5 20,5 20,10 10,10 10,20 20,20 20,25 10,25 10,30 0,30 0,45 5,45 5,55 15,55 15,60 20,60 20,70 25,70 25,75 60,75 60,70 65,70 65,60 70,60 70,45 65.2,45 65.2,35 75,35 75,15';
        this.width = 80;
        this.height = 80;
        this.price = 15;
    } else if (type == 2) {
        //Med
        this.points = '40,20 40,15 35,15 35,10 30,10 30,5 20,5 20,10 15,10 15,15 10,15 10,20 5,20 5,30 10,30 10,35 25,35 25,40 35,40 35,35 40,35 40,30 45,30 45,20';
        this.width = 50;
        this.height = 50;
        this.price = 25;
    } else if (type == 1) {
        //Small
        this.points = '15,5 15,0 5,0 5,5 0,5 0,15 10,15 10,20 15,20 15,15 20,15 20,5';
        this.width = 20;
        this.height = 20;
        this.price = 35;
    }

    this.goManager = goManager;
    this.render()
    this.update();
}

Asteroid.prototype.update = function () {

    this.position.add(this.velocity);
    this.checkBoundaries();
    this.group.setAttribute('transform', 'translate(' + this.position.x + ' ' + this.position.y + ')');
}

Asteroid.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.polygone = document.createElementNS(xmlns, 'polygon');
    this.polygone.setAttribute('points', this.points);
    this.polygone.setAttribute('fill', this.color);
    this.group.appendChild(this.polygone);
}

Asteroid.prototype.checkBoundaries = function () {

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

Asteroid.prototype.remove = function () {
    this.goManager.removeAsteroid(this);
    this.svg.removeChild(this.group);
    this.position = null;
    this.velocity = null;
    this.svg = null
    this.polygone = null;
    this.group = null;
}

Asteroid.prototype.getBounds = function () {
    return Rect(this.position.x, this.position.y, this.width, this.height);
}

