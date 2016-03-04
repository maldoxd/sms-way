
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
Parse.Cloud.define("LogUser", function(request, response) {
	var UserPin = Parse.Object.extend("UserPin");

	var query = new Parse.Query("User");
	query.equalTo("username", request.params.username);
	query.find({
		success: function(results) {
			if (results.length>0)
			{
				var createUserPin = new UserPin();
	     		createUserPin.set("pin", 122);
	     		createUserPin.set("user", results[0])
	     		createUserPin.save();
			     response.success( true);
		 	}
		 	else
		 		response.error("false");
		},
    error: function() {
      response.error("false");
    }
  });

});
Parse.Cloud.define("LogPinUser", function(request, response) {
	 Parse.Cloud.useMasterKey();
	 var queryUser = new Parse.Query("User");
	 queryUser.equalTo("username",request.params.username);
	var queryPin = new Parse.Query("UserPin"); 
	 queryPin.matchesQuery("user",queryUser);

	 queryUser.find({
		success: function(results) {
			 if (results.length>0)
			 {
		     	response.success( results[0].getSessionToken());
		     }
		     else
		     {
		     	response.success("no encontrado");
		     }
		},
    error: function(error) {
      response.error(error);
    }
  });

});
