import sphero from 'sphero';
import firebase from 'firebase';
const orb = sphero('/dev/tty.Sphero-RWB-AMP-SPP');
const fb = new firebase('https://fiery-inferno-7517.firebaseio.com/gadgets/sphero/move');

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

	fb.on('value', (snapshot) => {
		const move = snapshot.val();

		if (DIRECTION.hasOwnProperty(move)) {
			stop();
			roll(DIRECTION[move]);
			setTimeout(stop, DURATION);	
		}
	});
});
