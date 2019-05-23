import Unit from './classes/unit';
import Tank from './classes/tank';
import Interface from './classes/interface';
import Polyglot from "node-polyglot";

let FRAME = 50;
let ui = new Interface();
let immoblize = false;

let one = new Tank(ui);
one.go(10, ui.rows);

let two = new Tank(ui);
two.go(ui.columns - 10, ui.rows);

let stop = false;

function loop(i18n) {
  if (stop) return;

  ui.clear();

  if (one.dead || two.dead) {
    let num = one.dead ? '2' : '1';
    const msg = i18n.t('tanks.playerWon', {num: num});
    ui.cursor.red();
    ui.cursor.bold();

    ui.cursor.goto(ui.center.x - msg.length / 2, ui.center.y);
    ui.write(msg);

    stop = true;
    return;
  }

  one.draw();
  one.bullets.forEach((bullet, i) => {
    if (bullet.dead) {
      immoblize = false;
      one.bullets.splice(i, 1);
      return;
    }
    bullet.move();
    bullet.draw();

    if (bullet.collides(two)) {
      two.health -= 10;
      bullet.dead = true;
    }
  });

  ui.cursor.goto(0, 1);
  if (turn() === one) ui.cursor.hex('#54ffff');
  ui.write(i18n.t('tanks.player', {number: "1"}));
  ui.cursor.reset();
  ui.cursor.goto(0, 2);
  ui.write(i18n.t('tanks.health', {value: one.health}));
  ui.cursor.goto(0, 3);
  ui.write(i18n.t('tanks.angle', {value: parseInt(one.angle)}));

  two.draw();
  two.bullets.forEach((bullet, i) => {
    if (bullet.dead) {
      immoblize = false;
      two.bullets.splice(i, 1);
      return;
    }
    bullet.move();
    bullet.draw();

    if (bullet.collides(one)) {
      one.health -= 10;
      bullet.dead = true;
    }
  });

  ui.cursor.goto(ui.output.columns - 10, 1);
  if (turn() === two) ui.cursor.hex('#54ffff');
  ui.write(i18n.t('tanks.player', {number: "2"}));
  ui.cursor.reset();
  ui.cursor.goto(ui.output.columns - 10, 2);
  ui.write(i18n.t('tanks.health', {value: two.health}));
  ui.cursor.goto(ui.output.columns - 10, 3);
  ui.write(i18n.t('tanks.angle', {value: parseInt(two.angle)}));

  setTimeout(loop, FRAME, i18n);
}

ui.onKey('down', () => {
  if (immoblize) return;

  turn().angle -= 1;
})

ui.onKey('up', () => {
  if (immoblize) return;

  turn().angle += 1;
})

ui.onKey('left', () => {
  if (immoblize) return;

  turn().x -= 1;
});

ui.onKey('right', () => {
  if (immoblize) return;

  turn().x += 1;
});

ui.onKey('space', () => {
  if (immoblize) return;

  turn().shoot();

  immoblize = true;
  TURN = !TURN;
});

ui.onKey(() => {
  if (one.dead || two.dead) {
    one.go(10, ui.rows);
    two.go(ui.columns - 10, ui.rows);

    one.health = 100;
    two.health = 100;

    one.dead = false;
    two.dead = false;

    stop = false;

    loop();
  }
})

let TURN = true;
function turn() {
  if (TURN) return one;
  return two;
}

export default function(language) {
  const locale = require(`${__dirname}/locales/${language || 'en'}.json`);

  const i18n = new Polyglot({phrases: locale});

  loop(i18n);
}
