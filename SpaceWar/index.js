var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'game', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.image('bullet', 'PNG/lasers/laserRed01.png');
  game.load.image('ship', 'PNG/playerShip1_red.png');
  game.load.image('live', 'PNG/UI/playerLife1_red.png');
  game.load.image('enemy', 'PNG/Enemies/enemyBlack2.png');
  game.load.image('background', 'Backgrounds/blue.png');

  game.load.image('0', 'PNG/UI/numeral0.png');
  game.load.image('1', 'PNG/UI/numeral1.png');
  game.load.image('2', 'PNG/UI/numeral2.png');
  game.load.image('3', 'PNG/UI/numeral3.png');
  game.load.image('4', 'PNG/UI/numeral4.png');
  game.load.image('5', 'PNG/UI/numeral5.png');
  game.load.image('6', 'PNG/UI/numeral6.png');
  game.load.image('7', 'PNG/UI/numeral7.png');
  game.load.image('8', 'PNG/UI/numeral8.png');
  game.load.image('9', 'PNG/UI/numeral9.png');
}

var scoreTxt;
var score = 0;
var scoreGroup = [];

var lives;
var sprite;
var weapon;

var cursors;
var wasd;
var fireButton;

var bgtile;

var enemyWeapons = [];
var enemyGroups = [];
var enemyRate = 2000;

function createEnemies() {
  var x = game.rnd.integerInRange(50, 750);
  var speed = game.rnd.integerInRange(7000, 10000);

  var enemy = createSprite(x, -100, 'enemy');
  var weapon = createWeapon(3, 600, 30, 1000);

  game.add.tween(enemy).to({
    y: 900
  }, speed, Phaser.Easing.Cubic.Out).start();
  weapon.trackSprite(enemy, 0, 0, true);

  enemyGroups.push(enemy);
  enemyWeapons.push(weapon)

  if (enemyRate >= 750) {
    enemyRate -= 250;
  }
  game.time.events.add(enemyRate, createEnemies);
}

function createWeapon(count, speed, variance, rate) {
  var weapon = game.add.weapon(count, 'bullet');
  weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  weapon.bulletSpeed = speed;
  weapon.bulletAngleVariance = variance;
  weapon.fireRate = rate;

  weapon.bullets.setAll('scale.x', 0.5);
  weapon.bullets.setAll('scale.y', 0.5);

  return weapon;
}

function createSprite(x, y, image) {
  var sprite = game.add.sprite(x, y, image);
  sprite.anchor.set(0.5);
  sprite.scale.set(0.5);
  game.physics.arcade.enable(sprite);

  return sprite;
}

function createLives() {
  lives = game.add.group();
  for (var i = 0; i < 3; i++) {
    var ship = lives.create(game.world.width - 100 + (30 * i), 40, 'live');
    ship.anchor.setTo(0.5, 0.5);
  }
}

function enemyHitsPlayer(player, bullet) {
  bullet.kill();
  live = lives.getFirstAlive();
  if (live) {
    live.kill();
  } else {
    alert("You got " + score + " points!");
    for (var i = 0; i < enemyGroups.length; i++) {
      var enemy = enemyGroups[i];
      var enemyWeapon = enemyWeapons[i];
      if (enemy.alive) {
        enemy.kill();
        enemyWeapon.killAll()
      }
    }
    lives.forEachDead(function (live) {
      live.revive();
    })
    enemyRate = 2000;
    score = 0;
  }
}

function playerHitsEnemy(enemy, bullet) {
  bullet.kill();
  enemy.kill();
  score += 1;
}

function create() {
  bgtile = game.add.tileSprite(0, 0, 2000, 2000, 'background');

  weapon = createWeapon(30, 600, 10, 250)
  sprite = createSprite(400, 525, 'ship');
  weapon.trackSprite(sprite, 0, 0, true);

  createLives();
  createEnemies();
  createScore();

  cursors = this.input.keyboard.createCursorKeys();
  wasd = {
    up: this.input.keyboard.addKey(Phaser.Keyboard.W),
    down: this.input.keyboard.addKey(Phaser.Keyboard.S),
    left: this.input.keyboard.addKey(Phaser.Keyboard.A),
    right: this.input.keyboard.addKey(Phaser.Keyboard.D),
  };
  fireButton = game.input.activePointer;
}

function createScore() {
  var x = 20;
  for (var i = 0; i < 3; i++) {
    scoreGroup.push(game.add.sprite(x+20*i, 20, '0'))
  }
}

function updateScore() {
  var scoreTxt = score + '';
  for (var i = 2; i >= 0; i--) {
    scoreGroup[i].loadTexture(scoreTxt[i]);
  }
}

function update() {
  sprite.body.velocity.x = 0;
  sprite.body.velocity.y = 0;

  if (cursors.left.isDown || wasd.left.isDown) {
    sprite.body.velocity.x = -200;
  }
  if (cursors.right.isDown || wasd.right.isDown) {
    sprite.body.velocity.x = 200;
  }
  if (cursors.up.isDown || wasd.up.isDown) {
    sprite.body.velocity.y = -200;
  }
  if (cursors.down.isDown || wasd.down.isDown) {
    sprite.body.velocity.y = 200;
  }

  if (fireButton.isDown) {
    weapon.fire();
  }

  for (var i = 0; i < enemyGroups.length; i++) {
    var enemy = enemyGroups[i];
    var enemyWeapon = enemyWeapons[i];
    if (enemy.alive) {
      enemy.rotation = game.physics.arcade.angleBetween(enemy, sprite);
      enemyWeapon.fire();
      game.physics.arcade.overlap(enemyWeapon.bullets, sprite, enemyHitsPlayer, null, this);
      game.physics.arcade.overlap(weapon.bullets, enemy, playerHitsEnemy, null, this);
    }
  }

  sprite.rotation = game.physics.arcade.angleToPointer(sprite);
  bgtile.tilePosition.y += 1;

  updateScore();
}

function render() {
  // weapon.debug();
}