namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {
        public admit: (admissionId: Object) => void;
        public discharge: () => void;
        public refer: (complaintId: Object) => void;
        public sendToQueue: (complaintId: Object) => void;

        personId: string;
        workspaceId: string;
        workareaId: string;

        static $inject = ["$state", "$stateParams"];
        constructor(private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

        admission = () => {
            // this.$router.navigate(["OpdPatientSignOffAdmission", { encounterId: this.encounterId, personId: this.personId, opdId: this.opdId, queueId: this.queueId }]);
            // this.state.go("consultation.management.vitals.add", { vitalId: id });
        }

        referal = (id: string) => {
            // this.$router.navigate(["OpdPatientSignOffReferal", { encounterId: this.encounterId, personId: this.personId, queueId: this.queueId }]);
            // this.state.go("consultation.management.vitals.add", { vitalId: id });
        }

        discharged = (id: string) => {
            // this.$router.navigate(["OpdPatientSignOffDischarge", { encounterId: this.encounterId, personId: this.personId, opdId: this.opdId, queueId: this.queueId }]);
            //  this.state.go("consultation.management.vitals.add", { vitalId: id });
        }

        nextQueue = (id: string) => {
            // this.$router.navigate(["OpdPatientSignOffNextQue", { encounterId: this.encounterId, personId: this.personId, queueId: this.queueId }]);
            //  this.state.go("consultation.management.vitals.add", { vitalId: id });
        }

    }

    class Component implements ng.IComponentOptions {
        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/workspace/consultation/vitals/signoff.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                done: "&",
            };

        }

    }

    app.component("mrsConsultationPatientVitalSignOffLayout", new Component());

}
