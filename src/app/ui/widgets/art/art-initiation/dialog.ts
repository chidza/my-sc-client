namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtInitiationDialog extends ng.IController {
        changeReason: (personArtStatusId: Object) => void;
        changeRegimen: (personArtStatusId: Object) => void;
    }

    class Controller implements IArtInitiationDialog {
        datePickerOpenStatus = {};
        now: Date = new Date();
        selected: any;
        artStatus = {} as data.IPersonArtStatus;
        artId: string;
        reason: data.IArtReason;
        regimen: data.IArvCombinationRegimen;
        statusId: string;

        public changeReason: (personArtStatusId: Object) => void;
        public changeRegimen: (personArtStatusId: Object) => void;

        static $inject = ["PersonArtStatusService", "ArvCombinationRegimenService", "ArtReasonService", "SiteSettingService"];
        constructor(private personArtStatusService: data.IPersonArtStatusService,
            private regimenService: data.IArvCombinationRegimenService,
            private artReasonService: data.IArtReasonService,
            private siteSettingService: data.ISiteSettingService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.artId) {
                this.personArtStatusService.getFirst(this.artId).then((response) => {
                    this.artStatus = response;
                    if (this.artStatus.artReasonId) {
                        this.artReasonService.get(this.artStatus.artReasonId).then((response) => {
                            this.reason = response;
                        });
                    }

                    if (this.artStatus.arvCombinationRegimenId) {
                        this.regimenService.get(this.artStatus.arvCombinationRegimenId).then((response) => {
                            this.regimen = response;
                        });
                    }

                });
            }
            this.siteSettingService.fetch("ART_START_STATUS_ID").then((response) => {
                this.statusId = response.value;
            });
        }

        $onInit = () => {
            this.init();
        }

        openCalendar = (date: string) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }

        reasons = () => {
            this.changeReason({ personArtStatusId: this.artStatus.id });
        }
        regimens = () => {
            this.changeRegimen({ personArtStatusId: this.artStatus.id });
        }

        save = () => {
            if (this.artStatus.id) {
                this.personArtStatusService.update(this.artStatus).then((response) => {
                    this.init();
                });
            } else {
                this.artStatus.artId = this.artId;
                this.artStatus.artStatusId = this.statusId;
                this.personArtStatusService.save(this.artStatus).then((response) => {
                    this.init();
                });
            }

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-initiation/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                changeRegimen: "&",
                changeReason: "&",
                artId: "<"
            };

        }
    }

    app.component("mrsArtInitiationDialog", new Component());

}
