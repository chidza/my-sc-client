namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonArtFollowUpStatus extends ng.IController {
        selected: () => void;
        closed: () => void;

    }

    class Controller implements IPersonArtFollowUpStatus {
        public selected: () => void;
        public closed: () => void;

        personArtFollowUpStatus = {} as data.IPersonArtFollowUpStatus;
        followUpStatuses: Array<data.IFollowUpStatus>;
        personArtFollowUpStatusId: string;
        artId: string;

        static $inject = ["PersonArtFollowUpStatusService", "FollowUpStatusService"];
        constructor(private personArtFollowUpStatusService: data.IPersonArtFollowUpStatusService,
            private functionalStatusService: data.IFollowUpStatusService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.artId) {
                this.personArtFollowUpStatusService.getCurrent(this.artId).then((response) => {
                    this.personArtFollowUpStatus = response;
                });
                this.functionalStatusService.query().then((response) => {
                    this.followUpStatuses = response;
                });
            }
        }

        close = () => {
            this.closed();
        }


        select = (id: string) => {
            let sd = moment(this.personArtFollowUpStatus.date).format("YYYY-MM-DD");
            let cd = moment(new Date).format("YYYY-MM-DD");
            this.personArtFollowUpStatus.followUpStatusId = id;
            if (this.personArtFollowUpStatus.id && (new Date(sd).getTime() === new Date(cd).getTime())) {
                this.personArtFollowUpStatusService.update(this.personArtFollowUpStatus).then((response) => {
                    this.selected();
                });
            } else {
                this.personArtFollowUpStatus.id = null;
                this.personArtFollowUpStatus.date = cd;
                this.personArtFollowUpStatus.artId = this.artId;
                this.personArtFollowUpStatusService.save(this.personArtFollowUpStatus).then((response) => {
                    this.selected();
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-follow-up-status/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                  closed: "&",
                artId: "<"
            };

        }
    }

    app.component("mrsPersonArtFollowUpStatusSelect", new Component());

}
