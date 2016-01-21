// Import Soundworks library modules (client side)
import {
  client,
  ClientControl,
  ClientLocator,
  ClientSync,
  Orientation,
  Welcome,
  Loader
} from 'soundworks/client';
import PlayerPerformance from './PlayerPerformance.js';

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

const audioFiles = [];

for (let key in audioConfig)
  audioFiles.push(audioConfig[key].file);


const init = () => {
  client.init('player');

  const welcome = new Welcome({
    fullScreen: false,
    requireMobile: false,
  });

  const control = new ClientControl();
  const sync = new ClientSync();
  const loader = new Loader({ files: audioFiles });
  const locator = new ClientLocator({
    positionRadius: 0.3,
    persist: true, // @todo - add a command to trigger the storage of the location
    // random: true,
  });
  // const orientation = new Orientation();
  const performance = new PlayerPerformance(audioConfig, sync, control, loader);

  // Start the scenario and order the modules
  client.start((serial, parallel) =>
    serial(
      parallel(welcome, loader, sync, control),
      locator,
      // orientation,
      performance
    )
  );
}

// Init app when document id ready
window.addEventListener('load', init);
