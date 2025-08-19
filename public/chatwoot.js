window.chatwootSettings = {"position":"right","type":"expanded_bubble","launcherTitle":"Live-Chat"};
(function(d,t) {
  var BASE_URL="https://chat.markus-kottlaender.de";
  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=BASE_URL+"/packs/js/sdk.js";
  g.async = true;
  s.parentNode.insertBefore(g,s);
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: 'mDmJ2ZJRt7kV1h21rck4ZnW6',
      baseUrl: BASE_URL
    })
  }
})(document,"script");