/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		/*var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}*/
		var loginurl = baseUrl+"sys/user"+"/login";
		var LoginParameter={
			loginName : loginInfo.account,
			password : loginInfo.password
		};
		$.ajax({
		url:loginurl,
		type: "POST",
		async: true,
		dataType: "json",
		data: JSON.stringify(LoginParameter),
		contentType: "application/json",
		/*beforeSend : function(req) {
	        req.setRequestHeader('Authorization', make_basic_auth(AuthUserLoginID, AuthUserPassword));
	    },	*/
		success : function(data) {
			if (data.status == 'OK') {
					//var users = JSON.parse(localStorage.getItem('$users') || '[]');
					var user = data.data;
					var authed = false;
					if(loginInfo.account == user.loginName && loginInfo.password == user.password){
						authed = true;
					}
					if (authed) {
						return owner.createState(loginInfo.account, callback);
					} else {
						return callback('用户名或密码错误');
					}		
				} else {
					return callback('登录失败');
				}
			}		
		});
		
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		/*var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));*/
		
		var registerurl = baseUrl+"sys/user"+"/register";
		var RegisterParameter={
			mobileNumber : regInfo.account,
			password : regInfo.password
		};
		$.ajax({
		url:registerurl,
		type: "POST",
		async: true,
		dataType: "json",
		data: JSON.stringify(RegisterParameter),
		contentType: "application/json",
		/*beforeSend : function(req) {
	        req.setRequestHeader('Authorization', make_basic_auth(AuthUserLoginID, AuthUserPassword));
	    },	*/
		success : function(data) {
			var tdata =data;
			if (data.status == 'OK') { 
					console.log("userId:"+data.data.userId);
					return callback();
				} else {
					return callback(data.message);
				}
			}		
		});
		
		
		
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));