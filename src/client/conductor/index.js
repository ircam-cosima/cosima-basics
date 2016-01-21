import { client, ClientControl } from 'soundworks/client';

function init() {
  client.init('conductor');
  const control = new ClientControl({ hasGui: true });

  control.setGuiOptions('velocityMean', { type: 'slider', size: 'large' });
  control.setGuiOptions('velocitySpread', { type: 'slider', size: 'large' });

  control.setGuiOptions('gainPeriodic', { type: 'slider', size: 'large' });
  control.setGuiOptions('gainGranular', { type: 'slider', size: 'large' });

  // periodic controls
  control.setGuiOptions('periodicPeriod', { type: 'slider', size: 'large' });

  // granular controls
  control.setGuiOptions('audioConfig', { type: 'buttons' });
  control.setGuiOptions('granularPositionVar', { type: 'slider', size: 'large' });
  control.setGuiOptions('granularPeriod', { type: 'slider', size: 'large' });
  control.setGuiOptions('granularDuration', { type: 'slider', size: 'large' });
  control.setGuiOptions('granularResampling', { type: 'slider', size: 'large' });
  control.setGuiOptions('granularResamplingVar', { type: 'slider', size: 'large' });
  control.setGuiOptions('granularSpeed', { type: 'slider', size: 'large' });

  client.start(control);
}

window.addEventListener('load', init);