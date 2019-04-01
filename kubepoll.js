const portscanner = require('portscanner');
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.Core_v1Api);
const scanPort = process.env.SCAN_PORT || 8080
const pollInt = process.env.POLL_INTERVAL || 500
const namespace = process.env.NAMESPACE || 'default'
const app = process.env.APP || 'default'

var hosts = [];
var oldHosts = [];
const getHosts = function(){
  hosts = [];
  k8sApi.listNamespacedPod(namespace).then( (res) => {
    var items = res.body.items;
    var pods = []
    var n=0
    for(let i=0; i < items.length; i++){
      if(items[i].metadata.labels.app === app){
        pods.push(items[i].status.podIP);
      }
    }
    var n = 0;
    for(let i=0; i < pods.length; i++){
      portscanner.checkPortStatus(scanPort, pods[i], function(error, status) {
        if(status === 'open'){
          hosts.push(pods[i]);
        }
        if(n === pods.length - 1 ) {
          setTimeout(() => {
            getHosts();
          }, pollInt);
          hosts.sort();
          if(hosts.length != oldHosts.length || hosts.every((v) => oldHosts.indexOf(v) <= 0)) {
            console.log('Poller updated host list: ' + hosts);
            process.send(hosts);
            oldHosts = hosts;
          }
        }
        n++;
      });
    }
  },
  (err) => {
    console.log(err);
  })
}

getHosts();
