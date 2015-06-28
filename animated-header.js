var svg = document.getElementById('svg-elem');
var img = document.getElementById('Lab_header');

var coords = {
  flaskTube: {
    start: {
      x: 567.5,
      y: 100
    },
    end: {
      x: 567.5,
      y: -10
    }
  },
  tube: [
    {
      x: 659.5,
      y: -10
    },
    {
      x: 659.5,
      y: 101
    },
    {
      x: 699,
      y: 101
    },
    {
      x: 699,
      y: 33
    },
    {
      x: 737,
      y: 33
    },
    {
      x: 737,
      y: 193
    }
  ],
  logoTube: {
    start: {
      x: 846,
      y: 193
    },
    end: {
      x: 846,
      y: 47
    }
  },
  flaskBase: {
    left: 500,
    right: 636
  }
};

var moveSpeed = 25;
var run = true;

function createBubble(x, y, segment, radius) {
  var bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bubble.setAttribute('fill', '#C7B7DF');
  bubble.setAttribute('cx', x);
  bubble.setAttribute('cy', y);

  if (radius === undefined) {
    radius = 4.5;
  }
  bubble.setAttribute('r', radius);

  if (segment !== undefined) {
    bubble.setAttribute('segment', segment);
  }

  img.appendChild(bubble);

  return bubble;
}

function moveBubble (bubble, x, y) {
  if (x) {
    bubble.setAttribute('cx', x);
  }
  if (y) {
    bubble.setAttribute('cy', y);
  }
}

var lastTime = (new Date()).getTime(),
  bubbles = {
    flaskTube: [
      createBubble(coords.flaskTube.start.x, coords.flaskTube.start.y - 50),
      createBubble(coords.flaskTube.start.x, coords.flaskTube.start.y)
    ],
    tube: [
      createBubble(coords.tube[0].x, coords.tube[0].y + 20, 0),
      createBubble(coords.tube[1].x, coords.tube[1].y, 1),
      createBubble(coords.tube[2].x, coords.tube[2].y, 2),
      createBubble(coords.tube[3].x, coords.tube[3].y, 3),
      createBubble(coords.tube[4].x, coords.tube[4].y, 4),
      createBubble(coords.tube[4].x, coords.tube[4].y + 100, 4)
    ],
    logoTube: [
      createBubble(coords.logoTube.start.x, coords.logoTube.start.y - 50),
      createBubble(coords.logoTube.start.x, coords.logoTube.start.y)
    ],
    boilingFlask: []
  };

function animate () {
  if (run) {
    var now = (new Date()).getTime(),
      delta = now - lastTime;

    if (delta > 0) {

      animateFlaskTube(delta);
      animateTube(delta);
      animateLogoTube(delta);
      boilingFlask(delta);

      requestAnimationFrame(animate);

      lastTime = now;
    }
  }
}

function animateFlaskTube (delta) {
  var moveAmount = moveSpeed / delta,
    y = null,
    bubble;

  for (var i = 0; i < bubbles.flaskTube.length; i++) {
    bubble = bubbles.flaskTube[i];

    y = parseFloat(bubble.getAttribute('cy')) - moveAmount;

    if (y <= coords.flaskTube.end.y) {
      y = coords.flaskTube.start.y;
    }

    moveBubble(bubble, null, y);
  }
}

function animateTube (delta) {
  var moveAmount = moveSpeed / delta,
    bubble, segment, x, y;

  for (var i = 0; i < bubbles.tube.length; i++) {
    bubble = bubbles.tube[i];
    segment = parseInt(bubble.getAttribute('segment'));
    x = 0;
    y = 0;

    switch (segment) {
      case 0:
        y = parseFloat(bubble.getAttribute('cy')) + moveAmount;

        if (y >= coords.tube[1].y) {
          y = coords.tube[1].y;
          bubble.setAttribute('segment', 1);
        }

        break;

      case 1:
        x = parseFloat(bubble.getAttribute('cx')) + moveAmount;

        if (x >= coords.tube[2].x) {
          x = coords.tube[2].x;
          bubble.setAttribute('segment', 2);
        }

        break;

      case 2:
        y = parseFloat(bubble.getAttribute('cy')) - moveAmount;

        if (y <= coords.tube[3].y) {
          y = coords.tube[3].y;
          bubble.setAttribute('segment', 3);
        }

        break;

      case 3:
        x = parseFloat(bubble.getAttribute('cx')) + moveAmount;

        if (x >= coords.tube[4].x) {
          x = coords.tube[4].x;
          bubble.setAttribute('segment', 4);
        }

        break;

      case 4:
        y = parseFloat(bubble.getAttribute('cy')) + moveAmount;

        if (y >= coords.tube[5].y) {
          x = coords.tube[0].x;
          y = coords.tube[0].y;
          bubble.setAttribute('segment', 0);
        }

        break;
    }

    moveBubble(bubble, x, y);
  }
}

function animateLogoTube (delta) {
  var moveAmount = moveSpeed / delta,
    y = null,
    bubble;

  for (var i = 0; i < bubbles.logoTube.length; i++) {
    bubble = bubbles.logoTube[i];

    y = parseFloat(bubble.getAttribute('cy')) - moveAmount;

    if (y <= coords.logoTube.end.y) {
      y = coords.logoTube.start.y;
    }

    moveBubble(bubble, null, y);
  }
}

function boilingFlask (delta) {
  var bubble, y, moveAmount = 30 / delta;

  if (Math.random() > 0.3) {
    var x = randomIntFromInterval(coords.flaskBase.left, coords.flaskBase.right);

    bubbles.boilingFlask.push(createBubble(x, 180, undefined, 2));
  }

  for (var i = 0; i < bubbles.boilingFlask.length; i++) {
    bubble = bubbles.boilingFlask[i];

    y = parseFloat(bubble.getAttribute('cy')) - moveAmount;

    moveBubble(bubble, null, y);

    if (y <= 160) {
      img.removeChild(bubble);
      bubbles.boilingFlask.splice(i, 1);
    }
  }
}

function randomIntFromInterval (min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

requestAnimationFrame(animate);