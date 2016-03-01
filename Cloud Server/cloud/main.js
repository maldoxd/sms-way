
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
			var createUserPin = new UserPin();
     		createUserPin.set("pin", 122);
     		createUserPin.set("user", results[0])
     		createUserPin.save();
		     response.success( true);
		},
    error: function() {
      response.error("movie lookup failed");
    }
  });

});
