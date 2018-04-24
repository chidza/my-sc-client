namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonArtIptStatusReason extends ng.IController {
        selected: () => void;
    }

    class Controller implements IPersonArtIptStatusReason {
        public selected: () => void;
        personArtIptStatus: data.IPersonArtIptStatus;
        iptReasons: Array<data.IIptReason>;
        personArtIptStatusId: string;

        static $inject = ["PersonArtIptStatusService", "IptReasonService"];
        constructor(private personArtIptStatusService: data.IPersonArtIptStatusService,
            private iptReasonService: data.IIptReasonService) {

        }

        $onInit = () => {
            this.personArtIptStatusService.get(this.personArtIptStatusId).then((response) => {
                this.personArtIptStatus = response;
                this.iptReasonService.query().then((response) => {
                    this.iptReasons = response;
                });
            });
        }

        select = (id: string) => {
            this.personArtIptStatus.iptReasonId = id;
            this.personArtIptStatusService.update(this.personArtIptStatus).then((response) => {
                this.selected();
            });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-ipt-reason/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                selected: "&",
                personArtIptStatusId: "<"
            };

        }
    }

    app.component("mrsPersonArtIptStatusReasonSelect", new Component());

}
