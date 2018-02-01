import 'source-map-support/register'; // enable sourcemaps in node
import path from 'path';
import * as soundworks from 'soundworks/server';
import PlayerExperience from './PlayerExperience';
import MapExperience from './MapExperience';
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

sharedParams.addNumber('velocityMean', 'Velocity Mean', 0.1, 30, 0.1, 2);
sharedParams.addNumber('velocitySpread', 'Velocity Spread', 0, 5, 0.1, 0);
// mix
sharedParams.addText('mixLabel', 'Mix');
sharedParams.addNumber('gainPeriodic', 'Periodic Synth Gain', 0, 1, 0.001, 0.8);
sharedParams.addNumber('gainGranular', 'Granular Synth Gain', 0, 1, 0.001, 0.8);
// periodic synth
sharedParams.addText('periodicLabel', 'Periodic Synth Parameters');
sharedParams.addNumber('periodicPeriod', 'Noise Period', 0, 1, 0.001, 0.03);
// granular synth
sharedParams.addEnum('audioConfig', 'Audio File', ['Schwitters', 'Chloe', 'Sonar'], 'Schwitters');
sharedParams.addText('granularLabel', 'Granular Synth Parameters');
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
const controllerExperience = new soundworks.ControllerExperience('controller');

soundworks.server.start();


// const setup = soundworks.server.config.playerSetup;
// const sync = new soundworks.ServerSync();
// const locator = new soundworks.ServerLocator({ setup });
// const playerPerformance = new PlayerPerformance({ setup, sync });
// const mapPerformance = new MapPerformance({ setup, playerPerformance });

// soundworks.server.map('player', sync, control, locator, playerPerformance);
// soundworks.server.map('map', sync, mapPerformance);
// soundworks.server.map('conductor', control);
