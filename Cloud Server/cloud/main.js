
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
Parse.Cloud.define("LogUser", function(request, response) {
	
	var query = new Parse.Query("User");
	var queryUserPin = new Parse.Query("UserPin");
	
	query.equalTo("username", request.params.username);
	query.first({
		success: function(results) {
			
				queryUserPin.equalTo("user", results);
				
				queryUserPin.descending("createdAt");
				queryUserPin.first({
				  success: function(object) {
					  if (object!=null){
						object.set("active", false);
						object.save();
					  }
					CreateNewPin(request, response, results)
				  },
				  error: function(error) { 
					CreateNewPin(request, response, results)
				  }
					});
					
									
		},
    error: function() {
      response.error("no usuaroi");
    }
  });

});
function CreateNewPin(request,response,results)
{
	var UserPin = Parse.Object.extend("UserPin");

	var createUserPin = new UserPin();
									createUserPin.set("pin", Math.floor(10000 + Math.random() * 90000));
									createUserPin.set("user", results);
									createUserPin.set("active", true);
									createUserPin.save();
									SendNotification(results, createUserPin.get("pin"), response);
									
}
Parse.Cloud.define("SendSMS", function(request, response) {
	
	 Parse.Cloud.useMasterKey();
	var RequestSms = Parse.Object.extend("RequestSms");
	  			var requestSms = new RequestSms();
				requestSms.set("message", request.params.message);
				requestSms.set("data", request.params.data);	
				requestSms.set("status", false);
	     		requestSms.set("user", request.user);
	     		requestSms.save();
				 
				var pushQuery = new Parse.Query(Parse.Installation);
				pushQuery.equalTo("user", request.user);
				
				Parse.Push.send({
  where: pushQuery,
  data: {
    message: JSON.stringify(requestSms)
  }
}, {
  success: function() {
     response.success(true);
  },
  error: function(error) {
    response.error(error);
  }
});
				 
		 	
 

});
Parse.Cloud.define("LogSignUser", function(request, response) {
	 Parse.Cloud.useMasterKey();
	 var queryUser = new Parse.Query("User");
	 queryUser.equalTo("username",request.params.username);
	 
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
function SendNotification(results, pin, response) {
  
				var pushQuery = new Parse.Query(Parse.Installation);
				pushQuery.equalTo("user", results);
				
				Parse.Push.send({
  where: pushQuery,
  data: {
    alert: pin
  }
}, {
  success: function() {  
   response.success( true);
  },
  error: function(error) {  
   response.error( "error");
  }
});
				 
		 	
 
}
 
