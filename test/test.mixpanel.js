//var cookies = document.cookie.split(";");
//for (var i = 0; i < cookies.length; i++) {   
//  deleteCookie(cookies[i].split("=")[0]);
//}
//function deleteCookie(name) {
//  var d = new Date();
//  d.setDate(d.getDate() - 1);
//  var expires = ";expires=" + d;
//  var value = "";
//  document.cookie = name + "=" + value + expires + "; path=/acc/html";                    
//}

// From http://stackoverflow.com/users/1120798/sergey-gospodarets
function triggerEvent(el, eventName){
    var event;
    if(document.createEvent){
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName,true,true);
    }else if(document.createEventObject){// IE < 9
        event = document.createEventObject();
        event.eventType = eventName;
    }
    event.eventName = eventName;
    if(el.dispatchEvent){
        el.dispatchEvent(event);
    }else if(el.fireEvent && htmlEvents['on'+eventName]){// IE < 9
        el.fireEvent('on'+event.eventType,event);// can trigger only real event (e.g. 'click')
    }else if(el[eventName]){
        el[eventName]();
    }else if(el['on'+eventName]){
        el['on'+eventName]();
    }
}

var verify = function(event_name, properties, callback, errback) {
  var callbacks = {};
  var check = function() {
    for(var property_name in callbacks) {
      if(!callbacks[property_name]) {
        return;
      }
    }
    callback();
  }
  var _errback = function(e){
    errback(e);
    _errback = function(){};
    callback = function(){};
  }
  for(var property_name in properties) {
    if(property_name === "token") {
      continue;
    }
    callbacks[property_name] = false;
    _verify(event_name, property_name, properties[property_name], callbacks, _errback, check);
  }
}

var _verify = function(event_name, property_name, property_value, callbacks, errback, check, attempts) {
  attempts = attempts || 0;
  var mpcallback = "_" + uuid.v4().replace(/\-/g, "");
  this[mpcallback] = function(data){
    if(!data.data.values[property_value]) {
      if(attempts < 10) {
        setTimeout(function(){
          _verify(event_name, property_name, property_value, callbacks, errback, check, attempts + 1);
        }, 1000);
        return;
      } else {
        errback(new Error("Could not verify " + event_name + "['" + property_name + "']['" + property_value + "'] due to timeout."));
      }       
    }
    callbacks[property_name] = true;
    check();
  }
  var parameters = {
    api_key: MIXPANEL_CONFIG.api_key,
    expire: Math.round(new Date().getTime() / 1000) + 90,
    event: event_name,
    name: property_name,
    type: "unique",
    unit: "day",
    interval: 1
  };
  var sig_string = [];
  var query_string = [];
  for(var key in parameters) {
    sig_string.push(key + "=" + parameters[key]);
    query_string.push(key + "=" + encodeURI(parameters[key]));
  }
  sig_string.sort();
  var qs = query_string.join("&") + "&sig=" + CryptoJS.MD5(sig_string.join("") + MIXPANEL_CONFIG.api_secret);
  var script = document.createElement("script");
  script.src = "https://mixpanel.com/api/2.0/events/properties/?" + qs + "&callback=" + mpcallback;
  document.getElementsByTagName("head")[0].appendChild(script);
};

describe("Mixpanel", function() {
  this.timeout(300000);
  
  it("should init.", function(done) {
    var library_name = uuid.v4();
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.init(MIXPANEL_CONFIG.token, {}, library_name);
    mixpanel[library_name].track(event_name, properties);
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  it("should push.", function(done) {
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.push(["track", event_name, properties]);
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  
  it("should track.", function(done) {
    var library_name = uuid.v4();
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.track(event_name, properties);
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  it("should track with callback.", function(done) {
    var library_name = uuid.v4();
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.track(event_name, properties, function(){
      verify(event_name, properties, function(){
        done();
      }, function(e){
        console.log(e);
        throw e;
      });      
    });
  });
  
  it("should track pageviews.", function(done) {
    mixpanel.track_pageview();
    done();
  });
  it("should track links.", function(done) {
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.track_links("#test-link", event_name, properties);
    var anchor = document.getElementById('test-link');
    triggerEvent(anchor, "click");
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  
  it("should register properties.", function(done) {
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.register(properties, 1);
    mixpanel.track(event_name);
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  
  it("should register properties once.", function(done) {
    var event_name = uuid.v4();
    var key_1 = uuid.v4();
    var value_1 = uuid.v4();
    var value_1b = uuid.v4();
    var key_2 = uuid.v4();
    var value_2 = uuid.v4();
    var value_2b = uuid.v4();
    var properties_1 = {};
    properties_1[key_1] = value_1;
    properties_1[key_2] = value_2;
    var properties_2 = {}
    properties_2[key_1] = value_1b;
    properties_2[key_2] = value_2b;
    var properties_3 = {};
    properties_3[key_1] = value_1;
    properties_3[key_2] = value_2b;
    mixpanel.register(properties_1, 1);
    mixpanel.register_once(properties_2, value_2, 1);
    mixpanel.track(event_name);
    verify(event_name, properties_3, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  
  it("should unregister.", function(done) {
    var event_name = uuid.v4();
    var key_1 = uuid.v4();
    var value_1 = uuid.v4();
    var key_2 = uuid.v4();
    var value_2 = uuid.v4();
    var properties = {};
    properties[key_1] = value_1;
    properties[key_2] = value_2;
    mixpanel.register(properties, 1);
    delete properties[key_2];
    mixpanel.unregister(key_2);
    mixpanel.track(event_name);
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  
  it("should get properties.", function(done) {
    var event_name = uuid.v4();
    var key_1 = uuid.v4();
    var value_1 = uuid.v4();
    var key_2 = uuid.v4();
    var value_2 = uuid.v4();
    var properties = {};
    properties[key_1] = value_1;
    properties[key_2] = value_2;
    mixpanel.register(properties, 1);
    expect(mixpanel.get_property(key_1)).to.eql(value_1);
    expect(mixpanel.get_property(key_2)).to.eql(value_2);
    done();
  });
 
 
  it("should track forms.", function(done) {
    var event_name = uuid.v4();
    var properties = {};
    properties[uuid.v4()] = uuid.v4();
    mixpanel.track_forms("#test-form", event_name, function(dom){
      return properties;
    });
    var form = document.getElementById('test-form');
    setTimeout(function(){
      var submit = document.getElementById('test-form-submit');
      triggerEvent(submit, "click");
    }, 1000)

    if(form.addEventListener) {
      form.addEventListener("submit", function(e){
        e.preventDefault();
        return false;
      });
    } else if(form.attachEvent) {
      form.attachEvent("onsubmit", function(e){
        e.preventDefault();
        return false;
      });
    }
    verify(event_name, properties, function(){
      done();
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  
  it("should alias.", function(done) {
    var old_id = mixpanel.get_distinct_id();
    var new_id = uuid.v4();
    mixpanel.alias(new_id, old_id);
    done();
  });
  
  it("should identify.", function(done) {
    var old_id = mixpanel.get_distinct_id();
    var new_id = uuid.v4();
    mixpanel.identify(new_id);
    expect(mixpanel.get_distinct_id()).to.eql(new_id);
    mixpanel.identify(old_id);
    expect(mixpanel.get_distinct_id()).to.eql(old_id);
    done();
  });
  it("should name tag.", function(done) {
    mixpanel.name_tag(uuid.v4());
    done();
  });
  it("should get and set config options.", function(done) {
    mixpanel.set_config({test:true});
    expect(mixpanel.get_config("test")).to.eql(true);
    mixpanel.set_config({test:false});
    done();
  });
  it("should disable some events.", function(done) {
    var event_name_1 = uuid.v4();
    var properties_1 = {};
    properties_1[uuid.v4()] = uuid.v4();
    var event_name_2 = uuid.v4();
    var properties_2 = {};
    properties_2[uuid.v4()] = uuid.v4();
    mixpanel.disable([event_name_2]);
    mixpanel.track(event_name_1, properties_1);
    mixpanel.track(event_name_2, properties_2);
    verify(event_name_1, properties_1, function(){
      verify(event_name_2, properties_2, function(){
        throw new Error("Event 2 should not exist.");
      }, function(){
        done();
      });
    }, function(e){
      console.log(e);
      throw e;
    });
  });
  it("should disable all events.", function(done) {
    var event_name_1 = uuid.v4();
    var properties_1 = {};
    properties_1[uuid.v4()] = uuid.v4();
    var event_name_2 = uuid.v4();
    var properties_2 = {};
    properties_2[uuid.v4()] = uuid.v4();
    mixpanel.disable();
    mixpanel.track(event_name_1, properties_1);
    mixpanel.track(event_name_2, properties_2);
    verify(event_name_1, properties_1, function(){
      throw new Error("Event 1 should not exist.");
    }, function(e){
      verify(event_name_2, properties_2, function(){
        throw new Error("Event 2 should not exist.");
      }, function(){
        done();
      });
    });
  });
  
});
