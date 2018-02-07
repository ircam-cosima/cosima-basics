import { Experience } from 'soundworks/server';

class SoloistExperience extends Experience {
  constructor(clientType, comm) {
    super(clientType);

    this.comm = comm;

    this.players = new Map();
    this.activePlayers = new Set();

    this.sharedConfig = this.require('shared-config');
    this.sharedConfig.share('setup', 'soloist');

    this.onPlayerEnter = this.onPlayerEnter.bind(this);
    this.onPlayerExit = this.onPlayerExit.bind(this);

    this.comm.addListener('soloist:add:player', this.onPlayerEnter);
    this.comm.addListener('soloist:remove:player', this.onPlayerExit);
  }

  enter(client) {
    const playerInfos = Array.from(this.players.values());
    this.send(client, 'player:list', playerInfos);

    this.receive(client, 'input:change', (radius, coordinates) => {
      this.onInputChange(radius, coordinates);
    });
  }

  onPlayerEnter(player) {
    const infos = this.formatClientInformations(player);

    this.players.set(player, infos);
    this.broadcast('soloist', null, 'player:add', infos);
  }

  onPlayerExit(player) {
    const infos = this.players.get(player);

    this.players.delete(player);
    this.broadcast('soloist', null, 'player:remove', infos);
  }


  /**
   * Format informations the given player in order to be simply comsumed by soloists.
   * @param {Client} client - The client object.
   * @return {Object}
   * @property {Number} id - Unique id of the client.
   * @property {Array<Number>} coordinates - Coordinates of the client.
   */
  formatClientInformations(client) {
    return {
      id: client.uuid,
      x: client.coordinates[0],
      y: client.coordinates[1],
    };
  }

  /**
   * This method is called whenever a `soloist` client send the coordinates of
   * its touches on the screen.
   * @param {Number} radius - The radius of the excited zone as defined in the
   *  client-side `SoloistExperience`.
   * @param {Array<Array<Number>>} - List of the coordinates (relative to the
   *  `area`) of the touch events.
   */
  onInputChange(radius, coordinates) {
    const sqrRadius = radius * radius;
    const activePlayers = this.activePlayers;
    const players = new Set(this.players.keys());

    // if coordinates are empty, stop all players, else defines if a client
    // should be sent a `start` or `stop` message according to its previous
    // state and if it is or not in an zone that is excited by the soloist
    if (Object.keys(coordinates).length === 0) {
      activePlayers.forEach(player => this.send(player, 'soloist:stop'));
      activePlayers.clear();
    } else {
      players.forEach((player) => {
        let inArea = false;
        const isActive = activePlayers.has(player);

        for (let id in coordinates) {
          const center = coordinates[id];
          inArea = inArea || this.inArea(player.coordinates, center, sqrRadius);

          if (inArea) {
            if (!isActive) {
              this.send(player, 'soloist:start');
              activePlayers.add(player);
            }

            break;
          }
        }

        if (isActive && !inArea) {
          this.send(player, 'soloist:stop');
          activePlayers.delete(player);
        }
      });
    }
  }

  /**
   * Defines if `point` is inside the circle defined by `center` and `sqrRadius`.
   * The computation is done in squared space in order to save square root
   * computation on each call.
   * @param {Array<Number>} point - The x, y coordinates of the point to be tested.
   * @param {Array<Number>} center - The x, y coordinates of center of the circle.
   * @param {Number} sqrRadius - The squared radius of the circle.
   * @return {Boolean} - `true` if point is in the circle, `false` otherwise.
   */
  inArea(point, center, sqrRadius) {
    const x = point[0] - center[0];
    const y = point[1] - center[1];
    const sqrDistance = x * x + y * y;

    return sqrDistance < sqrRadius;
  }
}

export default SoloistExperience;
