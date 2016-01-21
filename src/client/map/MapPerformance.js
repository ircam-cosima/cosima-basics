import soundworks from 'soundworks/client';
import MapRenderer from './MapRenderer';

const template = `
  <div class="background">
    <div id="space"></div>
    <canvas class="background"></canvas>
  </div>
  <div class="foreground" style="display:none">
    <div class="section-top"></div>
    <div class="section-center"></div>
    <div class="section-bottom"></div>
  </div>
`;

class MapPerformanceView extends soundworks.display.CanvasView {
  onRender() {
    super.onRender();
    this.$background = this.$el.querySelector('.background');
  }

  setArea(area) {
    this.area = area;
    this.resizeArea();
  }

  // @note - this looks like a mess...
  resizeArea() {
    const xRatio = this.viewportWidth / this.area.width;
    const yRatio = this.viewportHeight / this.area.height;
    const ratio = Math.min(xRatio, yRatio);
    const bgWidth = this.area.width * ratio;
    const bgHeight = this.area.height * ratio;

    this.$background.style.width = `${bgWidth}px`;
    this.$background.style.height = `${bgHeight}px`;
    this.$background.style.left = `50%`;
    this.$background.style.marginLeft = `-${bgWidth / 2}px`;
    this.$background.style.top = `50%`;
    this.$background.style.marginTop = `-${bgHeight / 2}px`;

    this._renderingGroup.updateSize(bgWidth, bgHeight);
  }

  onResize(orientation, viewportWidth, viewportHeight) {
    super.onResize(orientation, viewportWidth, viewportHeight);
    if (this.area) { this.resizeArea(); }
  }
}

export default class MapPerformance extends soundworks.ClientPerformance {
  constructor(sync, options) {
    super(options);

    this._sync = sync;
    this.init();
  }

  init() {
    this.template = template;
    this.viewCtor = MapPerformanceView;
    this.view = this.createView();
  }

  start() {
    super.start();

    this.renderer = new MapRenderer();

    this.send('request:area');

    this.receive('init:area', (area) => {
      this.view.setArea(area);
      this.renderer.setArea(area);
      this.view.addRenderer(this.renderer);

      this.space = new soundworks.display.SpaceView(area);
      this.view.setViewComponent('#space', this.space);
      this.view.render('#space');

      this.send('request:map');
    });

    this.receive('init:map', (vertices, edges) => {
      this.space.addPoints(vertices);
      this.space.setLines(edges);
    });

    this.receive('add:player', (vertex, edges) => {
      this.space.addPoint(vertex);
      this.space.setLines(edges);
    });

    this.receive('remove:player', (id, edges) => {
      this.space.deletePoint(id);
      this.space.setLines(edges);
    });

    this.receive('trigger', (pathInfos) => {
      pathInfos.currentSyncTime = this._sync.getSyncTime();
      this.renderer.triggerPath(pathInfos);
    });
  }
}

