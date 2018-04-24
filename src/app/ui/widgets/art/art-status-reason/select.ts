namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonArtStatusReason extends ng.IController {
        selected: () => void;
    }

    class Controller implements IPersonArtStatusReason {
        public selected: () => void;
        personArtStatus: data.IPersonArtStatus;
        artReasons: Array<data.IArtReason>;
        personArtStatusId: string;

        static $inject = ["PersonArtStatusService", "ArtReasonService"];
        constructor(private personArtStatusService: data.IPersonArtStatusService,
            private artReasonService: data.IArtReasonService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }


        init = () => {
            if (this.personArtStatusId) {
                this.personArtStatusService.get(this.personArtStatusId).then((response) => {
                    this.personArtStatus = response;
                    if (this.personArtStatus.artStatusId) {
                        this.artReasonService.getByStatusId(this.personArtStatus.artStatusId).then((response) => {
                            this.artReasons = response;
                        });
                    }
                });
            }

        }

        select = (id: string) => {
            this.personArtStatus.artReasonId = id;
            this.personArtStatusService.update(this.personArtStatus).then((response) => {
                this.selected();
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-status-reason/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                personArtStatusId: "<"
            };

        }
    }

    app.component("mrsPersonArtStatusReasonSelect", new Component());

}
