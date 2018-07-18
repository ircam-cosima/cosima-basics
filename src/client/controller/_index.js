// import client side soundworks and player experience
import * as soundworks from 'soundworks/client';
// import MapExperience from './MapExperience';
import serviceViews from '../shared/serviceViews';

function bootstrap() {
  // initialize the client with configuration received
  // from the server through the `index.html`
  // @see {~/src/server/index.js}
  // @see {~/html/default.ejs}
  const config = Object.assign({ appContainer: '#container' }, window.soundworksConfig);
  soundworks.client.init(config.clientType, config);

  // configure views for the services
  soundworks.client.setServiceInstanciationHook((id, instance) => {
    if (serviceViews.has(id))
      instance.view = serviceViews.get(id, config);
  });

  // create client side (player) experience and start the client
  const controller = new soundworks.ControllerExperience();

  controller.setGuiOptions('argLabel', { readonly: true });
  controller.setGuiOptions('velocityMean', { type: 'slider', size: 'large' });
  controller.setGuiOptions('velocitySpread', { type: 'slider', size: 'large' });

  controller.setGuiOptions('mixLabel', { readonly: true });
  controller.setGuiOptions('gainPeriodic', { type: 'slider', size: 'large' });
  controller.setGuiOptions('gainGranular', { type: 'slider', size: 'large' });

  // periodic controllers
  controller.setGuiOptions('periodicLabel', { readonly: true });
  controller.setGuiOptions('periodicPeriod', { type: 'slider', size: 'large' });

  // granular controllers
  controller.setGuiOptions('granularLabel', { readonly: true });
  controller.setGuiOptions('audioConfig', { type: 'buttons' });
  controller.setGuiOptions('granularPositionVar', { type: 'slider', size: 'large' });
  controller.setGuiOptions('granularPeriod', { type: 'slider', size: 'large' });
  controller.setGuiOptions('granularDuration', { type: 'slider', size: 'large' });
  controller.setGuiOptions('granularResampling', { type: 'slider', size: 'large' });
  controller.setGuiOptions('granularResamplingVar', { type: 'slider', size: 'large' });
  controller.setGuiOptions('granularSpeed', { type: 'slider', size: 'large' });

  soundworks.client.start();
}

window.addEventListener('load', bootstrap);

