import 'source-map-support/register'

import soundworks from 'soundworks/server';
import PlayerPerformance from './PlayerPerformance';
import MapPerformance from './MapPerformance';

const config = {
  appName: 'arg...',
  playerSetup: { width: 10, height: 10 },
};

soundworks.server.start(config);

const control = new soundworks.ServerControl();
control.addNumber('velocityMean', 'Velocity Mean', 0.1, 30, 0.1, 2);
control.addNumber('velocitySpread', 'Velocity Spread', 0, 5, 0.1, 0);
// mix
control.addLabel('mixLabel', 'Mix');
control.addNumber('gainPeriodic', 'Periodic Synth Gain', 0, 1, 0.001, 0.01);
control.addNumber('gainGranular', 'Granular Synth Gain', 0, 1, 0.001, 1);
// periodic synth
control.addLabel('periodicLabel', 'Periodic Synth Parameters');
control.addNumber('periodicPeriod', 'Noise Period', 0, 1, 0.001, 0.2);
// granular synth
control.addEnum('audioConfig', 'Audio File', ['Schwitters', 'Chloe', 'Sonar'], 'Schwitters');
control.addLabel('granularLabel', 'Granular Synth Parameters');
control.addNumber('granularPositionVar', 'Position Var', 0, 0.2, 0.001, 0.003);
control.addNumber('granularPeriod', 'Period', 0.001, 0.5, 0.001, 0.01);
control.addNumber('granularDuration', 'Duration', 0.001, 0.5, 0.001, 0.1);
control.addNumber('granularResampling', 'Resampling', -1200, 1200, 1, 0);
control.addNumber('granularResamplingVar', 'Resampling Var', 0, 1200, 1, 0);
control.addNumber('granularSpeed', 'Grain Speed', 0.25, 4, 0.01, 1);

control.addCommand('reload', 'Reload');

const setup = soundworks.server.config.playerSetup;
const sync = new soundworks.ServerSync();
const locator = new soundworks.ServerLocator({ setup });
const playerPerformance = new PlayerPerformance({ setup, sync });
const mapPerformance = new MapPerformance({ setup, playerPerformance });

soundworks.server.map('player', sync, control, locator, playerPerformance);
soundworks.server.map('map', sync, mapPerformance);
soundworks.server.map('conductor', control);
