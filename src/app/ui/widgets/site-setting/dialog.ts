namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ISiteSettingsDialog extends ng.IController {
    closed: () => void;
    saved: () => void;
  }

  class Controller implements ISiteSettingsDialog {

    public saved: () => void;

    public closed: () => void;

    siteSettingId: string;

    public site: data.ISiteSetting;

    static $inject = ["SiteSettingService"];
    constructor(private siteSettingsService: data.ISiteSettingService) { }

    $onInit = () => {
      this.siteSettingsService.getSiteSetting(this.siteSettingId).then((response) => {
        this.site = response;

      });

    }
    save = () => {

      this.siteSettingsService.update(this.site).then((response) => {
        this.site = response;
        this.closed();

      });

    }

    close = () => {
      this.closed();
    }
  }


  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/site-setting/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        closed: "&",
        saved: "&",
        siteSettingId: "<"
      };

    }
  }

  app.component("mrsSiteSettingDialog", new Component());

}
