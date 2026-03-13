import { useRef, useEffect } from 'react';
import Matter from 'matter-js';

const itemImages = [
  { url: `${import.meta.env.BASE_URL}img/items/beet.png`, scale: 0.2 },
  { url: `${import.meta.env.BASE_URL}img/items/bellPepper.png`, scale: 0.2 },
  { url: `${import.meta.env.BASE_URL}img/items/bitterMelon.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/broccoli.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/cabbage.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/carrot.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/corn.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/cucumber.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/eggplant.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/potato.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/pumpkin.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/radish.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/salmon.png`, scale: 0.03 },
  { url: `${import.meta.env.BASE_URL}img/items/scallion.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/spinach.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/items/tomato.png`, scale: 0.3 },
  { url: `${import.meta.env.BASE_URL}img/member/food-1.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-2.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-3.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-4.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-5.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-6.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-7.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-8.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-9.png`, scale: 0.1 },
  { url: `${import.meta.env.BASE_URL}img/member/food-10.png`, scale: 0.1 },
];


export default function DropVeg() {

  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite, Events, Body, MouseConstraint, Mouse } = Matter;
    const engine = Engine.create({});
    const width = boxRef.current.clientWidth;
    const height = boxRef.current.clientHeight;

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: width,
        height: height,
        background: 'transparent',
        wireframes: false,
      },
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    const isMobile = width < 600;

    mouse.element.removeEventListener('wheel', mouse.mousewheel);
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    const bowlObstacle = Bodies.circle(width / 2, height + 100, 650, {
      isStatic: true,
      render: { visible: false }
    });

    const updateBowl = (w, h, isMobileNow) => {
      const radius = w * 0.4;
      Body.setPosition(bowlObstacle,
        {
          x: w / 2,
          y: h + radius * (isMobileNow ? 0.15 : 0.12)

        });

      const currentRadius = bowlObstacle.circleRadius;
      const scale = radius / currentRadius;

      Body.scale(bowlObstacle, scale, scale);
    };

    updateBowl(width, height, isMobile);

    const floor = Bodies.rectangle(
      width / 2,
      height + 20,
      width * 2,
      40,
      {
        isStatic: true,
        render: { fillStyle: 'transparent' },
      }
    );

    const leftWall = Bodies.rectangle(-20,
      height / 2, 40,
      height * 2,
      { isStatic: true, render: { fillStyle: 'transparent' }, });

    const rightWall = Bodies.rectangle(width + 20,
      height / 2, 40, height * 2, { isStatic: true, render: { fillStyle: 'transparent' }, });

    const shuffledItems = [...itemImages].sort(() => Math.random() - 0.5);

    const createBall = (config) => {
      const x = Math.random() * width;
      const y = Math.random() * -1000;
      const scale = isMobile ? config.scale * 0.4 : config.scale;
      return Bodies.circle(x, y, isMobile ? 15 : 35, {
        restitution: 0.9,
        frictionAir: 0.02,
        render: {
          sprite: {
            texture: config.url,
            xScale: scale,
            yScale: scale,
          }
        }
      });
    };

    const balls = shuffledItems.map(config => createBall(config));
    Composite.add(engine.world, [mouseConstraint, bowlObstacle, floor, leftWall, rightWall, ...balls]);

    Events.on(engine, 'afterUpdate', () => {
      const currentHeight = boxRef.current?.clientHeight || height;
      const currentWidth = boxRef.current?.clientWidth || width;

      balls.forEach(ball => {
        if (ball.position.y > currentHeight + 150) {
          Body.setPosition(ball, {
            x: Math.random() * currentWidth,
            y: Math.random() * -1000 - 100
          });
          Body.setVelocity(ball, { x: 0, y: 0 });
        }
      });
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      if (!boxRef.current) return;
      const newWidth = boxRef.current.offsetWidth;
      const newHeight = boxRef.current.offsetHeight;
      const isMobileNow = newWidth < 600;
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;

      Body.setPosition(floor, {
        x: newWidth / 2,
        y: newHeight + 20,
      });

      const currentFloorWidth = floor.bounds.max.x - floor.bounds.min.x;
      const targetFloorWidth = newWidth * 2;
      const floorScaleX = targetFloorWidth / currentFloorWidth;
      Body.scale(floor, floorScaleX, 1);

      const currentWallHeight = leftWall.bounds.max.y - leftWall.bounds.min.y;
      const targetWallHeight = newHeight * 2;
      const wallScaleY = targetWallHeight / currentWallHeight;

      Body.setPosition(leftWall, {
        x: -20,
        y: newHeight / 2
      });
      Body.scale(leftWall, 1, wallScaleY);
      Body.setPosition(rightWall, {
        x: newWidth + 20,
        y: newHeight / 2
      });
      Body.scale(rightWall, 1, wallScaleY);

      updateBowl(newWidth, newHeight, isMobileNow);

      balls.forEach((ball, index) => {
        const config = shuffledItems[index];
        const newScale = isMobileNow ? config.scale * 0.4 : config.scale;
        const newRadius = isMobileNow ? 15 : 35;

        Body.setPosition(ball, {
          x: Math.random() * newWidth,
          y: -Math.random() * 300
        });

        Body.setVelocity(ball, {
          x: (Math.random() - 0.5) * 2,
          y: 0
        });

        ball.render.sprite.xScale = newScale;
        ball.render.sprite.yScale = newScale;

        const scaleFactor = newRadius / ball.circleRadius;
        Body.scale(ball, scaleFactor, scaleFactor);
      });

    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };

  }, []);

  return (
    <div
      ref={boxRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        overflow: 'hidden',

      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}



