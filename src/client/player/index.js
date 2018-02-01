// import client side soundworks and player experience
import * as soundworks from 'soundworks/client';
import PlayerExperience from './PlayerExperience';
import serviceViews from '../shared/serviceViews';

const audioConfig = {
  schwitters: {
    file: 'sounds/schwitters.wav',
    markers: [0, 0.955, 2.193, 2.224, 3.804, 5.200, 7.090],
    resampling: [-1200, -700, 0, 700, 1200],
  },
  chloe: {
    file: 'sounds/quesquil-speaker-48k.wav',
    markers: [0, 1.119250, 1.497331, 1.672372, 1.996952, 2.355782, 3.541950, 3.863060, 4.091488, 5.068617],
    resampling: [0],
  },
  sonar: {
    file: 'sounds/sonar.wav',
    markers: [0],
    resampling: [-1000, -800, -600, -400, -200, 0, 200, 400, 600, 800, 1000],
  }
}

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
  const experience = new PlayerExperience(audioConfig);
  soundworks.client.start();
}

window.addEventListener('load', bootstrap);
