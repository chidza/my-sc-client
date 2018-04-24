namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  class Controller implements ng.IController {

    username: string = "";
    sitename: string = "";
    $router: any;

    static $inject = ["Principal", "Auth",
      "SiteSettingService", "FacilityService", "$rootScope", "$state"];
    constructor(private Principal: security.IPrincipal,
      private Auth: security.IAuth,
      private siteSettings: data.ISiteSettingService,
      private facilityService: data.IFacilityService,
      private rootScope: ng.IRootScopeService,
      private state: ng.ui.IStateService) {
      // rootScope.$on(security.AUTH_EVENT, this.onAuthenticationChanges);
    }

    $onInit = () => {
      this.siteSettings.getSiteSetting(config.Settings.SiteSettings.SITE_ID).then((response) => {
        this.facilityService.get(response.value).then((response) => {
          this.sitename = response.name;
        });
      });

      this.onAuthenticationChanges();

      this.rootScope.$on(security.AUTH_EVENT, this.onAuthenticationChanges);

    }

    logoff = () => {
      this.Auth.logout();
      this.rootScope.$broadcast(security.AUTH_EVENT);
      this.state.go("authentication.login");
    }

    isInRole = (roles: Array<string>) => {
      return this.Principal.hasAnyAuthority(roles);
    }

    isAuthenticated = (): boolean => {
      return this.Principal.isAuthenticated() && (this.username.indexOf("Anonymous") === - 1);
    }

    onAuthenticationChanges = () => {

      this.username = "";

      this.Principal.identity().then((response) => {
        if (response !== null) {
          this.username = response.firstName + " " + response.lastName;
        }
      });

    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/menu/main/menu.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        $router: "<"
      };
    }
  }

  app.component("mrsMenu", new Component());

}
