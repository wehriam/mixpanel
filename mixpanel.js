(function (undefined) {
  var global_scope = typeof global !== 'undefined' ? global : this;
  var has_module = (typeof module !== 'undefined' && module.exports);
  var user_agent = window.navigator.userAgent;

//  var _ = {};
//  _.info = {
//    campaignParams: function() {
//      var campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' ')
//        , kw = ''
//        , params = {};
//      _.each(campaign_keywords, function(kwkey) {
//        kw = _.getQueryParam(document.URL, kwkey);
//        if (kw.length) {
//          params[kwkey] = kw;
//        }
//      });
//
//      return params;
//    },
//
//    searchEngine: function(referrer) {
//      if (referrer.search('https?://(.*)google.([^/?]*)') === 0) {
//        return 'google';
//      } else if (referrer.search('https?://(.*)bing.com') === 0) {
//        return 'bing';
//      } else if (referrer.search('https?://(.*)yahoo.com') === 0) {
//        return 'yahoo';
//      } else if (referrer.search('https?://(.*)duckduckgo.com') === 0) {
//        return 'duckduckgo';
//      } else {
//        return null;
//      }
//    },
//
//    searchInfo: function(referrer) {
//      var search = _.info.searchEngine(referrer)
//        , param = (search != "yahoo") ? "q" : "p"
//        , ret = {};
//
//      if (search !== null) {
//        ret["$search_engine"] = search;
//
//        var keyword = _.getQueryParam(referrer, param);
//        if (keyword.length) {
//          ret["mp_keyword"] = keyword;
//        }
//      }
//
//      return ret;
//    },
//
//
//    browser: function(user_agent, vendor, opera) {
//      var vendor = vendor || ''; // vendor is undefined for at least IE9
//      if (opera) {
//        if (_.includes(user_agent, "Mini")) {
//          return "Opera Mini";
//        }
//        return "Opera";
//      } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
//        return 'BlackBerry';
//      } else if (_.includes(user_agent, "FBIOS")) {
//        return "Facebook Mobile";
//      } else if (_.includes(user_agent, "Chrome")) {
//        return "Chrome";
//      } else if (_.includes(user_agent, "CriOS")) {
//        return "Chrome iOS";
//      } else if (_.includes(vendor, "Apple")) {
//        if (_.includes(user_agent, "Mobile")) {
//          return "Mobile Safari";
//        }
//        return "Safari";
//      } else if (_.includes(user_agent, "Android")) {
//        return "Android Mobile";
//      } else if (_.includes(user_agent, "Konqueror")) {
//        return "Konqueror";
//      } else if (_.includes(user_agent, "Firefox")) {
//        return "Firefox";
//      } else if (_.includes(user_agent, "MSIE") || _.includes(user_agent, "Trident/")) {
//        return "Internet Explorer";
//      } else if (_.includes(user_agent, "Gecko")) {
//        return "Mozilla";
//      } else {
//        return "";
//      }
//    },
//
//    os: function() {
//      var a = userAgent;
//      if (/Windows/i.test(a)) {
//        if (/Phone/.test(a)) { return 'Windows Mobile'; }
//        return 'Windows';
//      } else if (/(iPhone|iPad|iPod)/.test(a)) {
//        return 'iOS';
//      } else if (/Android/.test(a)) {
//        return 'Android';
//      } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
//        return 'BlackBerry';
//      } else if (/Mac/i.test(a)) {
//        return 'Mac OS X';
//      } else if (/Linux/.test(a)) {
//        return 'Linux';
//      } else {
//        return '';
//      }
//    },
//
//    device: function(user_agent) {
//      if (/iPad/.test(user_agent)) {
//        return 'iPad';
//      } else if (/iPod/.test(user_agent)) {
//        return 'iPod Touch';
//      } else if (/iPhone/.test(user_agent)) {
//        return 'iPhone';
//      } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
//        return 'BlackBerry';
//      } else if (/Windows Phone/i.test(user_agent)) {
//        return 'Windows Phone';
//      } else if (/Android/.test(user_agent)) {
//        return 'Android';
//      } else {
//        return '';
//      }
//    },
//
//    referringDomain: function(referrer) {
//      var split = referrer.split("/");
//      if (split.length >= 3) {
//        return split[2];
//      }
//      return "";
//    },
//
//    properties: function() {
//      return _.extend(_.strip_empty_properties({
//        '$os': _.info.os(),
//        '$browser': _.info.browser(userAgent, navigator.vendor, window.opera),
//        '$referrer': document.referrer,
//        '$referring_domain': _.info.referringDomain(document.referrer),
//        '$device': _.info.device(userAgent)
//      }), {
//        '$screen_height': screen.height,
//        '$screen_width': screen.width,
//        'mp_lib': 'web'
//      });
//    },
//
//    people_properties: function() {
//      return _.strip_empty_properties({
//        '$os': _.info.os(),
//        '$browser': _.info.browser(userAgent, navigator.vendor, window.opera)
//      });
//    },
//
//    pageviewInfo: function(page) {
//      return _.strip_empty_properties({
//        'mp_page': page
//        , 'mp_referrer': document.referrer
//        , 'mp_browser': _.info.browser(userAgent, navigator.vendor, window.opera)
//        , 'mp_platform': _.info.os()
//      });
//    }
//  };

  var truncate = function(x, length) {
    var key;
    if(typeof x === "string") {
      return x.slice(0, length);
    } else if(typeof x === "object") {
      for(key in x) {
        x[key] = truncate(x[key], length);
      } 
    }
    return x;
  };
  var request = function(path, payload, callback) {
    console.log("Requesting", path, payload);
  };
  var config = {
    api_host: ("https:" == document.location.protocol) ? "https://" : "http://") + 'api.mixpanel.com',
    cross_subdomain_cookie: true,
    cookie_name: "",
    loaded: function() {},
    store_google: true,
    save_referrer: true,
    test: false,
    verbose: false,
    img: false,
    track_pageview: true,
    debug: false,
    track_links_timeout: 300,
    cookie_expiration: 365,
    upgrade: false,
    disable_cookie: false,
    secure_cookie: false,
    ip: true
  };
  var _ = {};
  var disabled_events = [];
  var disable_all_events = false;
  _.disable = function(events) {
    if(typeof events === "undefined") {
      disable_all_events = true;
    } else {
      disabled_events = disabled_events.concat(events);
    }
  };
  _.track = function(event_name, properties, callback) {
    if(disable_all_events) {
      return;
    }
    if(disabled_events.indexOf(event_name) !== -1) {
      return;
    }
    var _properties = properties || {};
    _properties.token = properties.token || this.get_config('token');
    if(config.store_google) {
      // TODO
    }
    if(config.save_referrer) {
      // TODO
    }
    // TODO, update with superproperties
    // TODO, update with standard properties
    var payload = truncate({
      data: {
        event: event_name,
        properties
      }
    });
    request("/track/", payload, callback);
  };
  _.track_pageview = function(page) {
  };
  _.track_links = function() {
  };
  _.track_forms = function() {
  };
  _.register = function(props, days) {
  };
  _.register_once = function(props, default_value, days) {
  };
  _.get_property = function(property_name) {
  };
  _.alias = function(alias, original) {
  };
  _.unregister = function(property) {
  };
  _.identify = function(unique_id, _set_callback, _add_callback, _append_callback, _set_once_callback) {
  };
  _.get_distinct_id = function() {

  };
  _.name_tag = function(name_tag) {
  };
  _.set_config = function(_config) {
  };
  _.get_config = function(property_name) {
  };
  var queue = [];
  var dequeue = function() {
    while(queue.length > 0) {
      var item = queue.shift();
      _[item[0]].apply(_, item[1]);
    }
  };
  var supported_methods = "disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config".split(" ");
  var mixpanel = {};
  var attach_stub_method;
  if(/(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(user_agent)){
    attach_stub_method = function(){};
  } else {
    attach_stub_method = function(name){
      mixpanel[name] = function(){
        queue.push([name, arguments]);
        dequeue();
      }
    }
  }
  for(var i in supported_methods) {
    attach_stub_method(supported_methods[i]);
  }
  dequeue();
  if (has_module) { // CommonJS
    module.exports = mixpanel;
  } else if (typeof define === "function" && define.amd) { // AMD
    define("mixpanel", function () {
      return mixpanel;
    });
  } else {
    global_scope.mixpanel = mixpanel;
  }
}).call(this);