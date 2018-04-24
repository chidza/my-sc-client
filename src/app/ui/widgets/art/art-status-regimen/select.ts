namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonArtStatusRegimen extends ng.IController {
        selected: () => void;
    }

    class Controller implements IPersonArtStatusRegimen {
        public selected: () => void;
        personArtStatus: data.IPersonArtStatus;
        arvCombinationRegimens: Array<data.IArvCombinationRegimen>;
        personArtStatusId: string;

        static $inject = ["PersonArtStatusService", "ArvCombinationRegimenService"];
        constructor(private personArtStatusService: data.IPersonArtStatusService,
            private arvCombinationRegimenService: data.IArvCombinationRegimenService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personArtStatusId) {
                this.personArtStatusService.get(this.personArtStatusId).then((response) => {
                    this.personArtStatus = response;

                    this.arvCombinationRegimenService.query().then((response) => {
                        this.arvCombinationRegimens = response;
                    });
                });
            }

        }

        select = (id: string) => {
            this.personArtStatus.arvCombinationRegimenId = id;
            console.log(this.personArtStatus);
            this.personArtStatusService.update(this.personArtStatus).then((response) => {
                console.log(response);
                this.selected();
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-status-regimen/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                personArtStatusId: "<"
            };

        }
    }

    app.component("mrsPersonArtStatusRegimenSelect", new Component());

}
