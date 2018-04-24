namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonArtFunctionalStatus extends ng.IController {
        selected: () => void;
          closed: () => void;
    }

    class Controller implements IPersonArtFunctionalStatus {
        public selected: () => void;
        public closed: () => void;
        personArtFunctionalStatus = {} as data.IPersonArtFunctionalStatus;
        functionalStatuses: Array<data.IFunctionalStatus>;
        personArtFunctionalStatusId: string;
        artId: string;

        static $inject = ["PersonArtFunctionalStatusService", "FunctionalStatusService"];
        constructor(private personArtFunctionalStatusService: data.IPersonArtFunctionalStatusService,
            private functionalStatusService: data.IFunctionalStatusService) {

        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.artId) {
                this.personArtFunctionalStatusService.getCurrent(this.artId).then((response) => {
                    this.personArtFunctionalStatus = response;
                });
                this.functionalStatusService.query().then((response) => {
                    this.functionalStatuses = response;
                });
            }
        }
         close = () => {
            this.closed();
        }

        select = (id: string) => {
            let sd = moment(this.personArtFunctionalStatus.date).format("YYYY-MM-DD");
            let cd = moment(new Date).format("YYYY-MM-DD");
            this.personArtFunctionalStatus.functionalStatusId = id;
            if (this.personArtFunctionalStatus.id && (new Date(sd).getTime() === new Date(cd).getTime())) {
                this.personArtFunctionalStatusService.update(this.personArtFunctionalStatus).then((response) => {
                    this.selected();
                });
            } else {
                this.personArtFunctionalStatus.id = null;
                this.personArtFunctionalStatus.date = cd;
                this.personArtFunctionalStatus.artId = this.artId;
                this.personArtFunctionalStatusService.save(this.personArtFunctionalStatus).then((response) => {
                    this.selected();
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-functional-status/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                 closed: "&",
                artId: "<"
            };

        }
    }

    app.component("mrsPersonArtFunctionalStatusSelect", new Component());

}
