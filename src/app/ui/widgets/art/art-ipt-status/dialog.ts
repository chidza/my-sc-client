namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtIptStatusDialog extends ng.IController {
        changeReason: (personArtIptStatusId: Object) => void;
    }

    class Controller implements IArtIptStatusDialog {
        artIptStatus = {} as data.IPersonArtIptStatus;
        artId: string;
        reason: data.IIptReason;
        iptStatuses: Array<data.IIptStatus> = [];

        public changeReason: (personArtIptStatusId: Object) => void;

        static $inject = ["PersonArtIptStatusService", "IptReasonService", "IptStatusService"];
        constructor(private personArtIptStatusService: data.IPersonArtIptStatusService,
            private iptReasonService: data.IIptReasonService,
            private iptStatusService: data.IIptStatusService) {

        }
        init = () => {
            if (this.artId) {
                this.personArtIptStatusService.getCurrent(this.artId).then((response) => {
                    this.artIptStatus = response;
                    if (this.artIptStatus.iptReasonId) {
                        this.iptReasonService.get(this.artIptStatus.iptReasonId).then((response) => {
                            this.reason = response;
                        });
                    }
                });
            }


        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        $onInit = () => {
            this.iptStatusService.query().then((response) => {
                this.iptStatuses = response;
            });
        }


        reasons = () => {
            this.changeReason({ personArtIptStatusId: this.artIptStatus.id });
        }

        save = () => {
            let sd = moment(this.artIptStatus.date).format("YYYY-MM-DD");
            let cd = moment(new Date).format("YYYY-MM-DD");

            if (this.artIptStatus.id && (new Date(sd).getTime() === new Date(cd).getTime())) {
                this.personArtIptStatusService.update(this.artIptStatus).then((response) => {
                    this.init();
                });
            } else {
                this.artIptStatus.artId = this.artId;
                this.artIptStatus.id = null;
                this.artIptStatus.iptReasonId = null;
                this.artIptStatus.date = cd;
                this.personArtIptStatusService.save(this.artIptStatus).then((response) => {
                    this.reason = null;
                    this.init();
                });
            }

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-ipt-status/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                changeReason: "&",
                artId: "<"
            };

        }
    }

    app.component("mrsArtIptStatusDialog", new Component());

}
