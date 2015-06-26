var stage;
var running = true;
var keepAspectRatio = true;
var objectManager = [];

var linkSpriteSheet = new createjs.SpriteSheet({
    images: ["link.gif"],
    frames: {
        width: 32,
        height: 32
    },
    animations: {
        stand: 0
    }
});

var Point = function (x, y) {
    this.x = x;
    this.y = y;
    this.equals = function (oth) {
        if ((this.x == oth.x) && (this.y == oth.y)) {
            return true;
        } else {
            return false;
        }
    };
    this.manDist = function (oth) {
        return ((Math.abs(this.x - oth.x)) + (Math.abs(this.y - oth.y)))
    };
};

var Mouse = function () {
    var inst = this;
    this.position = new Point(0, 0);
    this.tile = new Point(0, 0);
    this.down = false;
    this.update = function () {
        stage.on("stagemousemove", function (evt) {
            inst.position = new Point(evt.stageX / stage.scaleX, evt.stageY / stage.scaleY);
            inst.tile = new Point(Math.round(inst.position.x / 32), Math.round(inst.position.y / 32));
        });
        stage.on("stagemousedown", function (evt) {
            inst.down = true;
        });
        stage.on("stagemouseup", function (evt) {
            inst.down = false;
        });
        //console.log(inst.down);
    };
}

var mouse = new Mouse();

var GameObject = function (sheet, startX, startY) {
    objectManager.push(this);
    this.name = "unnamed";
    this.tile = new Point(startX, startY);
    this.position = new Point(startX * 32, startY * 32);
    this.destination = new Point(startX, startY);
    this.image = new createjs.Sprite(sheet);
    this.alive = true;
    this.onStage = false;
    this.path = [];
    this.nativeActions = function () {
        if (!this.tile.equals(this.destination)) {
            var desPos = new Point(this.destination.x * 32, this.destination.y * 32)
            createjs.Tween.get(this.position).to(desPos, this.tile.manDist(this.destination) * 250);
            this.tile = this.destination;
        }
        this.image.x = this.position.x;
        this.image.y = this.position.y;
    };
    this.update = function () {};
};

function start() {
    setup();
    var link = new GameObject(linkSpriteSheet, 0, 0);
    link.update = function () {
        if (mouse.down) {
            link.destination = mouse.tile;
            //console.log(mouse.tile);
        }
    };
    setInterval(update, 16);
}

function setup() {
    stage = new createjs.Stage("gameWindow");
    onResize();
}

function update() {
    logic();
    render();
}

function logic() {
    mouse.update();
    for (var i = 0; i < objectManager.length; i++) {
        objectManager[i].nativeActions();
        objectManager[i].update();
    }
}

function render() {
    stage.clear();
    for (var i = 0; i < objectManager.length; i++) {
        if (objectManager[i].alive && !objectManager[i].onStage) {
            stage.addChild(objectManager[i].image);
        }
    }
    stage.update();
}

function onResize() {
    // browser viewport size
    var w = window.innerWidth;
    var h = window.innerHeight;

    // stage dimensions
    var ow = 640;
    var oh = 480;

    if (keepAspectRatio) {
        // keep aspect ratio
        var scale = Math.min(w / ow, h / oh);
        stage.scaleX = scale;
        stage.scaleY = scale;

        // adjust canvas size
        stage.canvas.width = ow * scale;
        stage.canvas.height = oh * scale;
    } else {
        // scale to exact fit
        stage.scaleX = w / ow;
        stage.scaleY = h / oh;

        // adjust canvas size
        stage.canvas.width = ow * stage.scaleX;
        stage.canvas.height = oh * stage.scaleY;
    }

    // update the stage
    stage.update();
}

window.onresize = function () {
    onResize();
}

$(document).ready(start);