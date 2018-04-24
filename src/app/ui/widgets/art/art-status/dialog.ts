namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtStatusDialog extends ng.IController {
        changeReason: (personArtStatusId: Object) => void;
        changeRegimen: (personArtStatusId: Object) => void;
    }

    class Controller implements IArtStatusDialog {
        artStatus = {} as data.IPersonArtStatus;
        artId: string;
        reason: data.IArtReason;
        regimen: data.IArvCombinationRegimen;
        artStatuses: Array<data.IArtStatus> = [];

        public changeReason: (personArtStatusId: Object) => void;
        public changeRegimen: (personArtStatusId: Object) => void;

        static $inject = ["PersonArtStatusService", "ArvCombinationRegimenService", "ArtReasonService", "ArtStatusService"];
        constructor(private personArtStatusService: data.IPersonArtStatusService,
            private regimenService: data.IArvCombinationRegimenService,
            private artReasonService: data.IArtReasonService,
            private artStatusService: data.IArtStatusService) {

        }
        init = () => {
            if (this.artId) {
                this.personArtStatusService.getCurrent(this.artId).then((response) => {
                    console.log("response");
                    console.log(response);
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

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        $onInit = () => {
            this.artStatusService.query().then((response) => {
                this.artStatuses = response;
            });
        }


        reasons = () => {
            this.changeReason({ personArtStatusId: this.artStatus.id });
        }
        regimens = () => {
            this.changeRegimen({ personArtStatusId: this.artStatus.id });
        }

        save = () => {
            let sd = moment(this.artStatus.date).format("YYYY-MM-DD");
            let cd = moment(new Date).format("YYYY-MM-DD");

            if (this.artStatus.id && (new Date(sd).getTime() === new Date(cd).getTime())) {
                this.personArtStatusService.update(this.artStatus).then((response) => {
                    this.artStatus = response;
                    this.init();
                });
            } else {
                this.artStatus.artId = this.artId;
                this.artStatus.id = null;
                this.artStatus.artReasonId = null;
                this.artStatus.arvCombinationRegimenId = null;
                this.artStatus.date = new Date();
                this.personArtStatusService.save(this.artStatus).then((response) => {
                    this.reason = null;
                    this.regimen = null;
                    this.init();
                });
            }

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-status/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                changeRegimen: "&",
                changeReason: "&",
                artId: "<"
            };

        }
    }

    app.component("mrsArtStatusDialog", new Component());

}
