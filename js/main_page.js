// ===== CONFIG =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SPEED = 4;
const BULLET_SPEED = 8;
const SPRITE_SIZE = 64;

// ===== LOAD IMAGES =====
const directions = [
  "up", "up-right", "right", "down-right",
  "down", "down-left", "left", "up-left"
];

const playerSprites = {};
for (const dir of directions) {
  const img = new Image();
  img.src = `assets/player/${dir}.png`;
  playerSprites[dir] = img;
}

const bg = new Image();
bg.src = "assets/backgrounds/test.jpg";

const targets = [
  { x: 300, y: 200, w: 120, h: 80, img: new Image(), link: "paintings.html" },
  { x: 600, y: 200, w: 120, h: 80, img: new Image(), link: "pixel-art.html" },
  { x: 900, y: 200, w: 120, h: 80, img: new Image(), link: "code.html" }
];
targets[0].img.src = "assets/thumbnails/paintings.png";
targets[1].img.src = "assets/thumbnails/pixelart.png";
targets[2].img.src = "assets/thumbnails/coding.png";

// ===== PLAYER =====
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dir: "down",
  bullets: []
};

// ===== INPUT HANDLING =====
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// ===== MOUSE SHOOT =====
canvas.addEventListener("click", e => {
  const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
  player.bullets.push({
    x: player.x,
    y: player.y,
    vx: Math.cos(angle) * BULLET_SPEED,
    vy: Math.sin(angle) * BULLET_SPEED
  });
});

// ===== UPDATE LOOP =====
function update() {
  // Move player
  let dx = 0, dy = 0;
  if (keys["w"] || keys["arrowup"]) dy -= SPEED;
  if (keys["s"] || keys["arrowdown"]) dy += SPEED;
  if (keys["a"] || keys["arrowleft"]) dx -= SPEED;
  if (keys["d"] || keys["arrowright"]) dx += SPEED;

  if (dx !== 0 || dy !== 0) {
    player.x += dx;
    player.y += dy;

    // Determine facing direction (8-way)
    const angle = Math.atan2(dy, dx);
    if (angle >= -Math.PI/8 && angle < Math.PI/8) player.dir = "right";
    else if (angle >= Math.PI/8 && angle < 3*Math.PI/8) player.dir = "down-right";
    else if (angle >= 3*Math.PI/8 && angle < 5*Math.PI/8) player.dir = "down";
    else if (angle >= 5*Math.PI/8 && angle < 7*Math.PI/8) player.dir = "down-left";
    else if (angle >= 7*Math.PI/8 || angle < -7*Math.PI/8) player.dir = "left";
    else if (angle >= -7*Math.PI/8 && angle < -5*Math.PI/8) player.dir = "up-left";
    else if (angle >= -5*Math.PI/8 && angle < -3*Math.PI/8) player.dir = "up";
    else if (angle >= -3*Math.PI/8 && angle < -Math.PI/8) player.dir = "up-right";
  }

  // Move bullets
  for (let i = player.bullets.length - 1; i >= 0; i--) {
    const b = player.bullets[i];
    b.x += b.vx;
    b.y += b.vy;

    // remove if offscreen
    if (b.x < 0 || b.y < 0 || b.x > canvas.width || b.y > canvas.height) {
      player.bullets.splice(i, 1);
      continue;
    }

    // check target collisions
    for (const t of targets) {
      if (b.x > t.x && b.x < t.x + t.w && b.y > t.y && b.y < t.y + t.h) {
        window.location.href = t.link;
      }
    }
  }
}

// ===== DRAW LOOP =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  // Background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Targets
  for (const t of targets) {
    ctx.drawImage(t.img, t.x, t.y, t.w, t.h);
  }

  // Player
  const sprite = playerSprites[player.dir];
  if (sprite) {
    ctx.drawImage(sprite, player.x - SPRITE_SIZE / 2, player.y - SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(player.x - 16, player.y - 16, 32, 32);
  }

  // Bullets
  ctx.fillStyle = "yellow";
  for (const b of player.bullets) {
    ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
  }
}

// ===== MAIN LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// ===== RESIZE HANDLER =====
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});