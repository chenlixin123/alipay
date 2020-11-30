if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


      if( navigator.userAgent && (navigator.userAgent.indexOf('LyraVM') > 0 || navigator.userAgent.indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../node_modules/mini-ali-ui/es/loading/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/button/index?hash=e1617a0257fb9de746f60d50b03404ad924976c9');
require('../../node_modules/mini-ali-ui/es/am-icon/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/modal/index?hash=febd4c40992222524e0db12a74760a28f8f9b339');
require('../../node_modules/mini-ali-ui/es/popup/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/index/index?hash=8e41a6424d14d60e52da662558c3147416083194');
require('../../pages/personal_center/personal_center?hash=6999043495c84a110e33b271eb8b31efaad96502');
require('../../pages/mycarmodule/mycarmodule?hash=ef78849018bf45d6005d25b062348602afb28b5f');
require('../../pages/bill/bill?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/payment_successful/payment_successful?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/addPlate/addPlate?hash=6999043495c84a110e33b271eb8b31efaad96502');
require('../../pages/aboutLm/aboutLm?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/complaint/complaint?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}