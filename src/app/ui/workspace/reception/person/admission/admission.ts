namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        admission: data.IAdmission = null;
        encounterId: string = "";

        static $inject = ["AdmissionService", "$state", "$stateParams"];
        constructor(private admissionService: data.IAdmissionService,
            private state: ng.ui.IStateService,
            params: IParams) {
            this.personId = params.personId;
            console.log(params);
        }

        $onInit = (): void => {

            this.admissionService.current(this.personId).then((response) => {

                this.admissionService.get(response.admissionId).then((admission) => {
                    this.admission = admission;
                });

                this.admissionService.startEncounter(response.wardId, response.admissionId).then((response) => {
                    this.encounterId = response.id;
                });

            });

        }

        onSaved = (admissionId: string) => {
            this.onClosed();
        }

        onClosed = () => {
            this.state.go("reception.management.overview", { personId: this.personId });
        }

    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/admission/admission.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionAdmission", new Component());

}
