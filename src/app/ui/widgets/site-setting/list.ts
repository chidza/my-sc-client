namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ISiteSettingsList extends ng.IController {
    editSetting: (siteSettingId: Object) => void;
  }

  class Controller implements ISiteSettingsList {


    public editSetting: (siteSettingsId: Object) => void;
  
    settings: Array<data.ISiteSetting> = [];

    static $inject = ["SiteSettingService"];
    constructor(private siteSettingService: data.ISiteSettingService) {
    }
    $onInit = () => {
      this.siteSettingService.query("").then((response) => {
        this.settings = response;
      });

    }

    edit = (id:number) => {
     this.editSetting({siteSettingId:id});
    }

  }


  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/site-setting/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        editSetting: "&",

      };

    }
  }

  app.component("mrsSiteSettingList", new Component());

}
