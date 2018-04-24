namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        essentialCareForBabiesId: string;
        workareaId: string;
        personId: string;
        currentTime: data.ICurrentTime;
        babiesInformation = {} as data.IInformation;
      
        date: string;
        value: number = 0;

        static $inject = ["$state", "$stateParams", "SiteSettingService",
            "dialogs", "Principal", "UserService"];
        constructor(private state: ng.ui.IStateService,
            params: ng.ui.IStateParamsService,
        
            private siteSettingService: data.ISiteSettingService,
            private dialog: ng.dialogservice.IDialogService,
         
            private Principal: security.IPrincipal,
            private userService: data.IUserService) {
            this.essentialCareForBabiesId = params["essentialCareForBabiesId"];
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

        onRecord = () => {
         
        }

        babiesPrintPreview = () => {
          
        }

        $onInit = () => {
            this.siteSettingService.currentTime().then((response) => {
                this.date = moment(new Date(response.currentTime)).format("HH:mm");
                this.refresh();
            });
        }

        refresh = () => {
            this.value++;
            this.checkAlerts();
        }

        checkAlerts = () => {
         
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/essential-care-for-small-babies/menu.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientEssentialCareForBabiesMenuLayout", new Component());

}
