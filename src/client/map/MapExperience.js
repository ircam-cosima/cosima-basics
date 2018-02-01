import * as soundworks from 'soundworks/client';
import MapRenderer from './MapRenderer';

const template = `
  <div class="background">
    <canvas class="background"></canvas>
  </div>
  <div class="foreground" style="display:none">
    <div class="section-top"></div>
    <div class="section-center"></div>
    <div class="section-bottom"></div>
  </div>
`;

class MapExperienceView extends soundworks.CanvasView {
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

    const orientation = bgWidth > bgHeight ? 'landscape' : 'portrait';
    this._renderingGroup.onResize(bgWidth, bgHeight, orientation);
  }

  onResize(orientation, viewportWidth, viewportHeight) {
    super.onResize(orientation, viewportWidth, viewportHeight);

    if (this.area)
      this.resizeArea();
  }
}

class MapExperience extends soundworks.Experience {
  constructor(sync, options) {
    super(options);

    this._sync = this.require('sync');
  }

  start() {
    super.start();

    this.view = new MapExperienceView(template, {}, {}, {
      preservePixelRatio: true,
    });

    this.renderer = new MapRenderer();

    this.show().then(() => {
      this.send('request:area');

      this.receive('init:area', (area) => {
        this.view.setArea(area);
        this.renderer.setArea(area);
        this.view.addRenderer(this.renderer);

        this.send('request:map');
      });

      this.receive('update:map', (vertices, edges) => {
        // this.space.addPoints(vertices);
        // this.space.setLines(edges);
        this.renderer.updateMap(vertices, edges);
      });

      this.receive('add:player', (vertex, edges) => {
        // this.space.addPoint(vertex);
        // this.space.setLines(edges);
      });

      this.receive('remove:player', (id, edges) => {
        // this.space.deletePoint(id);
        // this.space.setLines(edges);
      });

      this.receive('trigger', pathInfos => {
        pathInfos.currentSyncTime = this._sync.getSyncTime();
        this.renderer.triggerPath(pathInfos);
      });
    });
  }
}

export default MapExperience;
