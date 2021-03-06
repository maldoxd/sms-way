// An example Parse.js Backbone application based on the sms app by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses Parse to persist
// the sms items and provide user authentication and sessions.

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("SLadcUnqmKEEi2t2eIba9VW0TJgfcTsLgAkKfJ80",
                   "xey3eZGWDjX5uFhJrbndG6GeLGzovw9H0esmu7h0");

  // Sms Model
  // ----------

  // Our basic Sms model has `content`, `order`, and `done` attributes.
  var Sms = Parse.Object.extend("Sms", {
    // Default attributes for the sms.
    defaults: {
      content: "empty sms...",
      done: false
    },

    // Ensure that each sms created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content});
      }
    },

    // Toggle the `done` state of this sms item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });

  // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
      filter: "all"
    }
  });

  // Sms Collection
  // ---------------

  var SmsList = Parse.Collection.extend({

    // Reference to this collection's model.
    model: Sms,

    // Filter down the list of all sms items that are finished.
    done: function() {
      return this.filter(function(sms){ return sms.get('done'); });
    },

    // Filter down the list to only sms items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(sms) {
      return sms.get('order');
    }

  });

  // Sms Item View
  // --------------

  // The DOM element for a sms item...
  var SmsView = Parse.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"              : "toggleDone",
      "dblclick label.sms-content" : "edit",
      "click .sms-destroy"   : "clear",
      "keypress .edit"      : "updateOnEnter",
      "blur .edit"          : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a Sms and a TodoView in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render', 'close', 'remove');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove);
    },

    // Re-render the contents of the sms item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the sms.
    close: function() {
      this.model.save({content: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // The main view that lets a user manage their sms items
  var ManageSmssView = Parse.View.extend({

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-sms":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete",
      "click .log-out": "logOut",
      "click ul#filters a": "selectFilter",
      "submit form.sms-send-form": "SendSms"
    
    },
    
    el: ".content",

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting smss that might be saved to Parse.
    initialize: function() {
      var self = this;

      _.bindAll(this, 'addOne', 'addAll', 'addSome', 'render', 'toggleAllComplete', 'logOut', 'createOnEnter', 'SendSms');

      // Main sms management template
      this.$el.html(_.template($("#manage-sms-template").html()));
      
      this.input = this.$("#new-sms");
      this.allCheckbox = this.$("#toggle-all")[0];

      // Create our collection of Todos
      this.smss = new SmsList;

      // Setup the query for the collection to look for smss from the current user
      this.smss.query = new Parse.Query(Sms);
      this.smss.query.equalTo("user", Parse.User.current());
        
      this.smss.bind('add',     this.addOne);
      this.smss.bind('reset',   this.addAll);
      this.smss.bind('all',     this.render);

      // Fetch all the sms items for this user
      this.smss.fetch();

      state.on("change", this.filter, this);
         var container = document.getElementById('example');
this.hot = new Handsontable(container, {
    columns: [
      
      {
        data: 'year',
        type: 'numeric',
        allowInvalid: false, 
      }
      ],
  rowHeaders: true, 
  minSpareRows: 1,
  startRows: 1,
});
    },

    //Send Sms and ooptions to parse
    SendSms: function(e) {
      var self = this;  
      var username = this.$("#login-username").val();
      var message = this.$("#new-sms").val();
       
        var $container = $('#example');
      var htContents = JSON.stringify($container.handsontable('getData'));
      var dataSms = (this.hot.getData());
       Parse.Cloud.run('SendSMS', { data: dataSms , message = message},{
        success: function(results) {

                 new PinView({userName: username});
                self.undelegateEvents();
                delete self;
            },
            error: function(error) {
                alert(error);
            }

       }); 
    },    
    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = this.smss.done().length;
      var remaining = this.smss.remaining().length;

      this.$('#sms-stats').html(this.statsTemplate({
        total:      this.smss.length,
        done:       done,
        remaining:  remaining
      }));

      this.delegateEvents();

      this.allCheckbox.checked = !remaining;
    },

    // Filters the list based on which type of filter is selected
    selectFilter: function(e) {
      var el = $(e.target);
      var filterValue = el.attr("id");
      state.set({filter: filterValue});
      Parse.history.navigate(filterValue);
    },

    filter: function() {
      var filterValue = state.get("filter");
      this.$("ul#filters a").removeClass("selected");
      this.$("ul#filters a#" + filterValue).addClass("selected");
      if (filterValue === "all") {
        this.addAll();
      } else if (filterValue === "completed") {
        this.addSome(function(item) { return item.get('done') });
      } else {
        this.addSome(function(item) { return !item.get('done') });
      }
    },

    // Resets the filters to display all smss
    resetFilters: function() {
      this.$("ul#filters a").removeClass("selected");
      this.$("ul#filters a#all").addClass("selected");
      this.addAll();
    },

    // Add a single sms item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(sms) {
      var view = new SmsView({model: sms});
      this.$("#sms-list").append(view.render().el);
    },

    // Add all items in the Todos collection at once.
    addAll: function(collection, filter) {
      this.$("#sms-list").html("");
      this.smss.each(this.addOne);
    },

    // Only adds some smss, based on a filtering function that is passed in
    addSome: function(filter) {
      var self = this;
      this.$("#sms-list").html("");
      this.smss.chain().filter(filter).each(function(item) { self.addOne(item) });
    },

    // If you hit return in the main input field, create new Sms model
    createOnEnter: function(e) {
      var self = this;
      if (e.keyCode != 13) return;

      this.smss.create({
        content: this.input.val(),
        order:   this.smss.nextOrder(),
        done:    false,
        user:    Parse.User.current(),
        ACL:     new Parse.ACL(Parse.User.current())
      });

      this.input.val('');
      this.resetFilters();
    },

    // Clear all done sms items, destroying their models.
    clearCompleted: function() {
      _.each(this.smss.done(), function(sms){ sms.destroy(); });
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      this.smss.each(function (sms) { sms.save({'done': done}); });
    }
  });

  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
        Parse.Cloud.run('LogUser', { username: username },{
        success: function(results) {

                 new PinView({userName: username});
                self.undelegateEvents();
                delete self;
            },
            error: function(error) {
                alert(error);
            }

       });
      
         

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

 

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });
  var PinView = Parse.View.extend({
    events: {
      "submit form.login-pin-form": "logIn"
    },
    template: _.template($('#login-pin-template').html()),
  
    el: ".content",
     
    initialize: function(options) {
      _.bindAll(this, "logIn");
     this.options = options;
      this.render();
    },

    logIn: function(e) {
      var self = this; 
      var password = this.$("#login-password").val();
      var username = this.$("#login-username").val();
       Parse.Cloud.run('LogPinUser', { pin: password, username: username },{
        success: function(results) {
                 
               Parse.User.become(results).then(function (user) {
                  new ManageSmssView();
                    self.undelegateEvents();
                delete self; 
              }, function (error) {
                // The token could not be validated.
              });
            },
            error: function(error) {
                self.$(".login-pin-form .error").html("Invalid username or password. Please try again.").show();
                self.$(".login-pin-form button").removeAttr("disabled");
            }

       }) 
      

      this.$(".login-pin-form button").attr("disabled", "disabled");

      return false;
    },

 

    render: function() {
      alert(this.options.userName);
      this.$el.html(this.template({userName: this.options.userName}));

      this.delegateEvents();
    }
  });

  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#smsapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new ManageSmssView();
      } else {
        new LogInView();
      }
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
      "all": "all",
      "active": "active",
      "completed": "completed"
    },

    initialize: function(options) {
    },

    all: function() {
      state.set({ filter: "all" });
    },

    active: function() {
      state.set({ filter: "active" });
    },

    completed: function() {
      state.set({ filter: "completed" });
    }
  });

  var state = new AppState;

  new AppRouter;
  new AppView;
  Parse.history.start();
});
