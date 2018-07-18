import { Experience, View } from 'soundworks/client';
import SharedParamsComponent from './SharedParamsComponent';
import LogComponent from './LogComponent';

const template = `
  <div id="shared-params"></div>
  <div id="log"></div>
`;

class ControllerExperience extends Experience {
  constructor(options = {}) {
    super();

    this.sharedParams = this.require('shared-params');
    this.sharedParamsComponent = new SharedParamsComponent(this, this.sharedParams);
    this.logComponent = new LogComponent(this);

    this.setGuiOptions('numPlayers', { readonly: true });

    this.setGuiOptions('argLabel', { readonly: true });
    this.setGuiOptions('velocityMean', { type: 'slider', size: 'large' });
    this.setGuiOptions('velocitySpread', { type: 'slider', size: 'large' });

    this.setGuiOptions('mixLabel', { readonly: true });
    this.setGuiOptions('gainPeriodic', { type: 'slider', size: 'large' });
    this.setGuiOptions('gainGranular', { type: 'slider', size: 'large' });

    // periodic controls
    this.setGuiOptions('periodicLabel', { readonly: true });
    this.setGuiOptions('periodicPeriod', { type: 'slider', size: 'large' });

    // granular controls
    this.setGuiOptions('granularLabel', { readonly: true });
    this.setGuiOptions('audioConfig', { type: 'buttons' });
    this.setGuiOptions('granularPositionVar', { type: 'slider', size: 'large' });
    this.setGuiOptions('granularPeriod', { type: 'slider', size: 'large' });
    this.setGuiOptions('granularDuration', { type: 'slider', size: 'large' });
    this.setGuiOptions('granularResampling', { type: 'slider', size: 'large' });
    this.setGuiOptions('granularResamplingVar', { type: 'slider', size: 'large' });
    this.setGuiOptions('granularSpeed', { type: 'slider', size: 'large' });

    if (options.auth)
      this.auth = this.require('auth');
  }

  start() {
    super.start();

    this.view = new View(template, {}, {}, { id: 'controller' });

    this.show().then(() => {
      this.sharedParamsComponent.enter();
      this.logComponent.enter();

      this.receive('log', (type, ...args) => {
        switch (type) {
          case 'error':
            this.logComponent.error(...args);
            break;
        }
      });

    });
  }

  setGuiOptions(name, options) {
    this.sharedParamsComponent.setGuiOptions(name, options);
  }
}

export default ControllerExperience;
