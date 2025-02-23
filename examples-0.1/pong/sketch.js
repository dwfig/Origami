function Ball() {
	let _this = {};
	_this.position = RabbitEar.Vector(Math.random(), Math.random());
	let vMag = 0.02;
	_this.velocity = {
		x: Math.random()*vMag - vMag/2,
		y: Math.random()*vMag - vMag/2};
	_this.update = function(){
		_this.position = _this.position.add(_this.velocity);
	}
	_this.draw = function() {
		ellipse(_this.position.x, _this.position.y, 2);
	}
	return _this;
}

var origami = RabbitEar.Origami({folding:true, padding:0.1, autofit:false});
origami.drawLayer = origami.group();
var ball = Ball();

origami.ballCircle = RabbitEar.svg.circle(0,0,0.02);
origami.appendChild(origami.ballCircle);

origami.animate = function(event) {
	let boundary = origami.boundary;
	ball.update();

	// origami.drawLayer.removeChildren();
	// let edgePoints = boundary.edges
	// 	.map(edge => edge.nearestPoint(ball.position.x, ball.position.y));
	// edgePoints.forEach(p => origami.drawLayer.circle(p[0], p[1], 0.02));

	origami.ballCircle.setAttribute("cx", ball.position.x);
	origami.ballCircle.setAttribute("cy", ball.position.y);
	let inside = boundary.contains(ball.position.x, ball.position.y);

	if (!inside) {
		let nearest = boundary.nearest(ball.position);
		let beyondVec = ball.position.subtract(nearest.point);
		let matrix = nearest.edge.reflection();
		matrix.m[4] = 0;
		matrix.m[5] = 0;
		ball.velocity = matrix.transform(ball.velocity);
		ball.position = nearest.point;
		ball.velocity.x += beyondVec.x*2;
		ball.velocity.y += beyondVec.y*2;
		ball.position.x += ball.velocity.x;
		ball.position.y += ball.velocity.y;
		// let dampen = beyondVec.scale(0.5);
		// console.log(beyondVec);
		// let mag1 = ball.velocity.magnitude;
		// let mag2 = beyondVec.magnitude;
		// console.log(mag1, mag2);
	}
}
