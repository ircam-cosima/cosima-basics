import 'source-map-support/register'; // enable sourcemaps in node
import path from 'path';
import * as soundworks from 'soundworks/server';
import PlayerExperience from './PlayerExperience';
import MapExperience from './MapExperience';
import SoloistExperience from './SoloistExperience';

import Tree from './topology/Tree';
import { EventEmitter } from 'events';

const configName = process.env.ENV || 'default';
const configPath = path.join(__dirname, 'config', configName);
let config = null;

// rely on node `require` for synchronicity
try {
  config = require(configPath).default;
} catch(err) {
  console.error(`Invalid ENV "${configName}", file "${configPath}.js" not found`);
  process.exit(1);
}

// configure express environment ('production' enables express cache for static files)
process.env.NODE_ENV = config.env;
// override config if port has been defined from the command line
if (process.env.PORT)
  config.port = process.env.PORT;


// modify setup to force a grid of 2 * 12 device for positions
//
// 1  2  3  4  5  6  7  8  9  10 11 12
// 13 14 15 16 17 18 19 20 21 22 23 24
//
// 1 and 13 y position are modifed to make them closer of each other
// and have a deterministic path

const setup = config.setup;
const { width, height } = setup.area;
const padding = 0.1;
setup.labels = [];
setup.coordinates = [];

for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 12; j++) {
    const index = i * 12 + j;
    const label = index + 1;
    const x = ((width - padding * 2) / 11) * j + padding;
    let y = i * (height - padding * 2) + padding;

    if (j === 0)
      y = (i === 0) ? y + padding : y - padding;

    setup.labels[index] = label;
    setup.coordinates[index] = [x, y];
  }
}

// ----------------------------------

// initialize application with configuration options
soundworks.server.init(config);

// define the configuration object to be passed to the `.ejs` template
soundworks.server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    env: config.env,
    appName: config.appName,
    websockets: config.websockets,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});

const sharedParams = soundworks.server.require('shared-params');

sharedParams.addBoolean('toggleMetro', 'metronome', false);

sharedParams.addText('argLabel', '&nbsp;', 'arg...');

sharedParams.addNumber('velocityMean', 'Velocity Mean', 0.1, 30, 0.1, 0.7);
sharedParams.addNumber('velocitySpread', 'Velocity Spread', 0, 5, 0.1, 0);
// mix
sharedParams.addText('mixLabel', '&nbsp;', 'Mix');
sharedParams.addNumber('gainPeriodic', 'Periodic Synth Gain', 0, 1, 0.001, 0);
sharedParams.addNumber('gainGranular', 'Granular Synth Gain', 0, 1, 0.001, 0.9);
// periodic synth
sharedParams.addText('periodicLabel', '&nbsp;', 'Periodic Synth Parameters');
sharedParams.addNumber('periodicPeriod', 'Noise Period', 0, 1, 0.001, 0.05);
// granular synth
sharedParams.addText('granularLabel', '&nbsp;', 'Granular Synth Parameters');
sharedParams.addEnum('audioConfig', 'Audio File', ['Schwitters', 'Chloe', 'Sonar'], 'Chloe');
sharedParams.addNumber('granularPositionVar', 'Position Var', 0, 0.2, 0.001, 0.003);
sharedParams.addNumber('granularPeriod', 'Period', 0.001, 0.5, 0.001, 0.05);
sharedParams.addNumber('granularDuration', 'Duration', 0.001, 0.5, 0.001, 0.2);
sharedParams.addNumber('granularResampling', 'Resampling', -1200, 1200, 1, 0);
sharedParams.addNumber('granularResamplingVar', 'Resampling Var', 0, 1200, 1, 0);
sharedParams.addNumber('granularSpeed', 'Grain Speed', 0.25, 4, 0.01, 1);

sharedParams.addTrigger('reload', 'Reload');


const comm = new EventEmitter();
const tree = new Tree();

const playerExperience = new PlayerExperience('player', comm, tree);
const mapExperience = new MapExperience('map', comm, tree);
const soloistExperience = new SoloistExperience('soloist', comm);
const controllerExperience = new soundworks.ControllerExperience('controller');

soundworks.server.start();

