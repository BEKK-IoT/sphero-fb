import sphero from 'sphero';
import { firebase } from 'devices-core';

const fb = new firebase('sphero', 'gadgets');
const orb = sphero('/dev/tty.Sphero-RWB-AMP-SPP');

const DURATION = 8000;
const DIRECTION = {
	up: 0,
	left: 90,
	down: 180,
	right: 270
}
const stop = () => orb.roll(0, 0);
const roll = (direction) => orb.roll(100, direction);

orb.connect(() => {
 	console.log('Connected!');
 	orb.streamGyroscope();
 	console.log('Streaming gyro');
 	orb.streamAccelerometer();
 	console.log('Streaming accelerometer');

	fb.on('move', '/gadgets/sphero/', (move) => {
		fb.send('move', 'none');
		if (DIRECTION.hasOwnProperty(move)) {
			stop();
			roll(DIRECTION[move]);
			setTimeout(stop, DURATION);	
		}
	});

	fb.on('color', '/gadgets/sphero/', (color) => {
		orb.color(color);
	});

	orb.on("accelerometer", function(data) {
		console.log(data);
		fb.send('accel', {
			x: data.xAccel.value[0],
			y: data.yAccel.value[0],
			z: data.zAccel.value[0]
		});
	});

	orb.on("gyroscope", (data) => {
		fb.send('gyro', {
			x: data.xGyro.value[0],
			y: data.yGyro.value[0],
			z: data.zGyro.value[0]
		});
	});
});

process.on('SIGINT', () => {
	process.stdin.pause();
	process.exit();
});
