import soundworks from 'soundworks/client';
import MapPerformance from './MapPerformance';

const client = soundworks.client;

function init() {
  client.init('map');

  const sync = new soundworks.ClientSync();
  const performance = new MapPerformance(sync);

  client.start((serial, parallel) => {
    return serial(sync, performance);
  });
}

window.addEventListener('load', init);


