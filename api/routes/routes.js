module.exports = function(app) {
	var vpnSE =  require('../controllers/controller');
	
	app.route('/check')
	.get(vpnSE.check_server);

	app.route('/sessions')
	.get(vpnSE.sessions);

	app.route('/iptable')
	.get(vpnSE.iptable);

	app.route('/all_users')
	.get(vpnSE.all_users);

	app.route('/new_user')
	.post(vpnSE.new_user);

	app.route('/delete_user')
	.delete(vpnSE.delete_user);

	app.route('/user_details')
	.get(vpnSE.user_details);

	app.route('/generate_pass')
	.get(vpnSE.generate_pass);

	app.route('/vnc_connect')
	.get(vpnSE.vnc_connect);

	app.route('/vnc_disconnect')
	.get(vpnSE.vnc_disconnect);
};