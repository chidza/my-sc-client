namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
        wardId: string;
        workareaId: string;

    }

    class Controller implements ng.IController {

        personId: string;
        admission: data.IAdmission = null;
        wardId: string;
        admissionWardId: string;
        workareaId: string;
        static $inject = ["AdmissionService", "$state", "$stateParams"];
        constructor(private admissionService: data.IAdmissionService,
            private state: ng.ui.IStateService,
            params: IParams) {
            this.personId = params.personId;
            this.wardId = params.wardId;
            this.workareaId = params["workareaId"];
            console.log(params);
        }

        $onInit = (): void => {

            this.admissionService.current(this.personId).then((response) => {
                this.admissionWardId = response.id; // admissionWardId
                response.admissionId;
                response.wardId;
                // this.admission = response;
            });

        }

        onSaved = (admissionWardCheckListId: string, wardCheckListId: string) => {
            console.log("onsaved");
            this.state.go("consultation.workspace");
        }

        onClosed = () => {
            this.state.go("consultation.workspace");
        }

    }
    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/trans/change-ward/ward-check-list.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationManagementChangeWardCheckList", new Component());

}
