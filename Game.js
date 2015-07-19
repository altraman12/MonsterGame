
function start() {
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
    var link = new GameObject(linkSpriteSheet, 0, 0);
    link.update = function () {
        if (mouse.down) {
            if (mouse.tile != link.tile) {
                if (!~link.path.indexOf(mouse.tile)) {
                    link.path.push(mouse.tile);
                }
            }
        }
    }; 
}

