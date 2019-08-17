"use strict"; //whole-script strict mode syntax (from MDN: https://www.w3schools.com/js/js_strict.asp)

/* *********Start Game ******* */

let gameStart = false;
const modal = document.getElementById('myModal');
const modal_content = document.querySelector('gameRules');
const btn = document.getElementById("myBtn");

const win_modal = document.getElementById('winModal'); //Declare Modal score settings

// register the restartGame function when the window loads
// so that its called when all the resources are ready
changeDisplayStyle();

var changeDisplayStyle = function () {
    if (gameStart === true) {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
}


// Enemies our player must avoid
var Enemy = function (xcor, ycor, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.xcor = xcor;
    this.ycor = ycor;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // This functions runs 1s per frame all the time

    // moving the bug to the right
    this.xcor += this.speed * dt;

    // checking if the bug is out of the screen an then reset.
    this.xcor = this.xcor > 909 ? 0 : this.xcor;
    this.detectCrash();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.xcor, this.ycor);
};

Enemy.prototype.detectCrash = function () {
    if (player.xcor + 26 <= this.xcor + 90 && player.xcor + 77 >= this.xcor + 10 && player.ycor + 130 >= this.ycor + 92 && player.ycor + 72 <= this.ycor + 132) {
        crashedTimes++;

        if (crashedTimes == 5) {
            showPopup("You lost! Please try again.");
            restartGame();
            return;
        }

        // player crash into bug
        document.getElementById("crashed").innerHTML = crashedTimes;
        player.reset();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (xcor, ycor, speedx, speedy) {
    this.xcor = xcor;
    this.ycor = ycor;
    this.speedx = speedx;
    this.speedy = speedy;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.xcor, this.ycor);
};

Player.prototype.reset = function () {
    this.xcor = 200;
    this.ycor = 460;
    this.speedx = 90;
    this.speedy = 90;

    /* var audio = document.getElementById("audio");
     audio.play(); */
};

Player.prototype.handleInput = function (keypressed) {
    if (keypressed === 'left') {
        this.xcor -= this.speed;
        if (this.xcor < 2) {
            this.xcor = 2;
        }
    } else if (keypressed === 'right') {
        this.xcor += this.speed;
        if (this.xcor > 909) {
            this.xcor = 400;
        }
    } else if (keypressed === 'up') {
        this.ycor -= this.speed;
        if (this.ycor <= (25)) {
            showPopup("You won! 🏆");
            gameWon();
            return;
        }
    } else if (keypressed === 'down') {
        this.ycor += this.speed;
        if (this.ycor > 460) {
            this.ycor = 460;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(0, 0, 0); // values doesn't matter, change in reset function


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        27: 'esc',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        68: 'd',
        83: 's',
        87: 'w'
    };

    player.handleInput(allowedKeys[e.keyCode]);

    // Prevents the frustrating window scrolling up and down when the arrow keys are pressed.


    window.addEventListener("keydown", function (e) {
        if ([38, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    // The game resets when the player presses the Esc key
    if (e.key == 'esc') {
        player.restart();
    };

    // When the player reaches the water, the character spirit goes 
    // to its starting position, i.e. (x, y) = (200, 400)
    if (this.y < 0) {
        player.reachWaterReset();
    };
});

function gameWon() {
    player.reset();
    scoreNow += 1;
    document.getElementById("score").innerHTML = scoreNow;
    var probability = parseInt(Math.random() * 10);
    if (probability < 5 && allEnemies.length < 5) {
        allEnemies.push(new Enemy(0, 40 + Math.random() * 707, 40 + Math.random() * 100));
    }
}

var context = this;
function restartGame() {
    console.log("restartGame")
    // game starts here
    // now zou create 5 bugs

    scoreNow = 0;
    crashedTimes = 0;

    player.reset();
    allEnemies = [];
    allEnemies.push(
        new Enemy(0, 75, 40 + Math.random() * 100),
        new Enemy(0, 75 * 2, 60 + Math.random() * 100),
        new Enemy(5, 75 * 3, 70 + Math.random() * 100),
        new Enemy(5, 75 * 4, 70 + Math.random() * 100),
        new Enemy(5, 75 * 5, 70 + Math.random() * 100)
    );
    var audio = document.getElementById("audio");
    audio.play();
}

btn.onclick = () => {
    gameStart = true;

    restartGame();

    Engine(context);
}

var scoreNow = 0;
var crashedTimes = 0;

// Select player at Gamestart

function choosePlayer(selection) {
    switch (selection) {
        case "cat":
            player.sprite = 'images/char-cat-girl.png';
            break;
        case "boy":
            player.sprite = 'images/char-boy.png';
            break;
        case "horn":
            player.sprite = 'images/char-horn-girl.png';
            break;
        case "pink":
            player.sprite = 'images/char-pink-girl.png';
            break;
        case "princess":
            player.sprite = 'images/char-princess-girl.png';
            break;
    }
}

// Popup functions
// Get the modal
var popupModal = document.getElementById("popupModal");

// Get the <span> element that closes the modal
var popupClose = document.getElementsByClassName("popupClose")[0];

// When the user clicks on the button, open the modal 
function showPopup(message) {
    document.getElementById("popupMessage").innerHTML = message;
    popupModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
popupClose.onclick = function() {
    popupModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == popupModal) {
    popupModal.style.display = "none";
  }
}
