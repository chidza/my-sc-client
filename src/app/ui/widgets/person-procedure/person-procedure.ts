namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonProcedureDialog extends ng.IController {

    }

    class Controller implements IPersonProcedureDialog {

        personProcedure: data.IPersonProcedure;
        datePickerOpenStatus = {};
        procedureId: string;
        personId: string;
        procedures: data.IMedicalProcedure;

        static $inject = ["PersonProcedureService", "MedicalProcedureService"];
        constructor(private personProcedureService: data.IPersonProcedureService,
            private proceduresService: data.IMedicalProcedureService) {

        }

        $routerOnActivate = (next: any): void => {
            this.personId = next.params.personId;
        }

        $onInit = () => {
            if (this.procedureId) {
                this.proceduresService.get(this.procedureId).then((response) => {
                    this.procedures = response;

                });
            }
        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            this.personProcedure.procedureId = this.procedureId;
            this.personProcedure.personId = this.personId;

            this.personProcedureService.save(this.personProcedure).then((response) => {

            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-procedure/person-procedure.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                procedureId: "<"
            };

        }
    }

    app.component("mrsPersonProcedureDialog", new Component());

}
