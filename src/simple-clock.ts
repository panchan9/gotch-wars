import { getLogger } from 'aurelia-logging';
import { useShadowDOM, DOM, inject } from 'aurelia-framework';

@useShadowDOM
@inject(DOM.Element)
export class SimpleClock {

  private readonly logger = getLogger(SimpleClock.name);

  container: HTMLElement;
  timeElems: { [index: string]: HTMLElement};
  times: { [index: string]: number };

  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  circles: { [index: string]: RadialBar };

  // To dispose timer function and release memory
  timerId: number;
  animationId: number;

  constructor(private element: Element) { }

  attached() {
    this.container = (<ShadowRoot>this.element.shadowRoot)
      .querySelector('#simple-clock-container') as HTMLElement;

    this.timeElems = {
      H: this.container.querySelector('#H') as HTMLElement,
      M: this.container.querySelector('#M') as HTMLElement,
      S: this.container.querySelector('#S') as HTMLElement,
    };
    Object.keys(this.timeElems).forEach((k, i) => {
      this.timeElems[k].style.color =
        `hsl(${k.charCodeAt(0) * i}, 50%, 50%)`;
    });

    this.canvas = this.container.appendChild(document.createElement('canvas'));

    this.width = innerWidth;
    this.height = this.width;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.logger.debug('Canvas Size:', this.canvas);

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';


    // create circles
    const spacing = 10;
    const radius = this.canvas.width * 0.9 / 2;
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    this.circles = {
      H: new RadialBar(halfW, halfH, radius, 24, 0),
      M: new RadialBar(halfW, halfH, radius - spacing, 60, 0),
      S: new RadialBar(halfW, halfH, radius - spacing - spacing, 60, 0),
    };

    this.updateTime();
    this.draw();

    const _updateTime = this.updateTime.bind(this);
    this.timerId = setInterval(_updateTime, 1000);
  }

  unbind() {
    // release memory
    clearInterval(this.timerId);
    cancelAnimationFrame(this.animationId);
  }

  updateTime() {
    const dt = new Date();
    this.times = {
      H: dt.getHours(),
      M: dt.getMinutes(),
      S: dt.getSeconds(),
    };

    // update text
    Object.keys(this.times).forEach(key => {
      // pad with 0s if needed
      this.timeElems[key].innerHTML = ('0' + this.times[key]).slice(-2);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // update circles, set their color, draw
    Object.keys(this.circles).forEach((key, idx) => {
      this.ctx.beginPath();
      this.circles[key].update(this.times[key], this.ctx);
      this.ctx.strokeStyle = `hsl(${key.charCodeAt(0) * idx}, 50%, 50%)`;
      this.ctx.stroke();
    });

    const _draw = this.draw.bind(this);
    this.animationId = requestAnimationFrame(_draw);
  }

}


class RadialBar {

  target = 0;

  constructor(
    private x = 0,
    private y = 0,
    private r = 0,
    private max = 1,
    private value = 0,
  ) {
    this.target = value;
  }

  update(v: number, ctx: CanvasRenderingContext2D) {
    // lerp
    this.target = v > 0 ? v : 0.1;
    this.value += (this.target - this.value) * 0.05;

    ctx.arc(
      this.x,
      this.y,
      this.r,
      this.deg2rad(-90),
      this.deg2rad(-90) + (this.deg2rad(360) * (this.value / this.max)),
    );
  }

  deg2rad(deg: number) {
    return (Math.PI / 180) * deg;
  }
}
