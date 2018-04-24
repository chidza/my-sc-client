namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
        wardCheckListId: string;
        admissionWardCheckListId: string;
        workareaId: string;

    }

    class Controller implements ng.IController {

        personId: string;
        admission: data.IAdmission = null;
        wardCheckListId: string;
        admissionWardCheckListId: string;
        admissionWardId: string;
        workareaId: string;
        static $inject = ["AdmissionService", "$state", "$stateParams"];
        constructor(private admissionService: data.IAdmissionService,
            private state: ng.ui.IStateService,
            params: IParams) {
            this.personId = params.personId;
            this.wardCheckListId = params.wardCheckListId;
            this.admissionWardCheckListId = params.admissionWardCheckListId;
            this.workareaId = params["workareaId"];
            console.log(params);
        }

        $onInit = (): void => {

            this.admissionService.current(this.personId).then((response) => {
                this.admissionWardId = response.id // admissionWardId
                response.admissionId
                response.wardId
                // this.admission = response;
            });

        }

        onSaved = (admissionWardCheckListId: string, wardCheckListId: string) => {
            console.log("onsaved");
            this.state.go("consultation.management.changeWards.checkListItem", { admissionWardCheckListId: admissionWardCheckListId, wardCheckListId: wardCheckListId });
        }

        onClosed = () => {
            this.state.go("consultation.purpose.list", { personId: this.personId, workareaId: this.workareaId });
        }

    }
    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/consultation/trans/change-ward/ward-check-list-item.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationManagementChangeWardCheckListItem", new Component());

}
