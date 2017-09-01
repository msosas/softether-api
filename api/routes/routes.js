module.exports = function(app) {
	var vpnSE =  require('../controllers/controller');
	
	app.route('/check')
	.get(vpnSE.check_server);

	app.route('/sessions')
	.post(vpnSE.sessions);

	app.route('/all_users')
	.post(vpnSE.all_users);

	app.route('/new_user')
	.post(vpnSE.new_user);

	app.route('/delete_user')
	.delete(vpnSE.delete_user);

	app.route('/user_details')
	.post(vpnSE.user_details);

	app.route('/generate_pass')
	.get(vpnSE.generate_pass);

	app.route('/vnc')
	.get(vpnSE.vnc);
};