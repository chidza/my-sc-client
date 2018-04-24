namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncVisitDialog extends ng.IController {
        closed: () => void;
        saved: (pncVisitId: Object) => void;
    }

    class Controller implements IPncVisitDialog {

        pncVisitId: string;
        pncVisitTypeId: string;
        pncId: string;
        pncVisit: data.IPncVisit;
        pncvisittypes: Array<data.IPncVisitType> = [];
        pncVisits: Array<data.IPncVisit> = [];
        opdId: string;
        queueId: string;
        personId: string;
        pnc: data.IPnc;
        $router: any;

        public closed: () => void;
        public saved: (pncVisitId: Object) => void;

        static $inject = ["PncVisitService", "PncVisitTypeService", "PncService"];
        constructor(private pncVisitService: data.IPncVisitService,
            private pncVisitTypeService: data.IPncVisitTypeService,
            private pncService: data.IPncService) {
        }


        $onInit = () => {
            console.log("team", this.personId);
            this.pncService.current(this.personId).then((response) => {
                this.pnc = response;
                this.pncId = this.pnc.id;
                console.log(this.pncId);
                this.pncVisitService.opdSession(this.opdId, this.queueId, this.pncId).then((response) => {
                    this.pncVisit = response;
                });
            });

            this.pncVisitTypeService.query().then((response) => {
                this.pncvisittypes = response;
            });
    
        }

        save = () => {
            if (this.pncVisit.id !== "") {
                this.onSave(this.pncVisitService.update(this.pncVisit));
            }
            else {
                this.onSave(this.pncVisitService.save(this.pncVisit));
            }
        }

        onSave = (promise: ng.IPromise<data.IPncVisit>) => {
            promise.then((response) => {
                console.log(response);
                if (this.saved != null) {
                    this.saved({ pncVisitId: response.id });
                }
            }, () => {
                // error!
            });
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/pnc-visit/dailog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "$router": "<",
                pncVisitId: "<",
                pncId: "<",
                pncVisitTypeId: "<",
                personId: "<",
                queueId: "<",
                opdId: "<",
            };

        }
    }

    app.component("mrsPncVisitDialog", new Component());

}
