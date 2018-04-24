namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ISelectVaccinationDialog extends ng.IController {
        selectMedicationFormulation: (drugOptionId: Object) => void;

    }

    class Controller implements ISelectVaccinationDialog {
        personId: string;
        drugNameId: string;
        drugSuffix = [] as Array<data.IDrugSuffix>;
        drugOptions = [] as Array<data.IDrugOption>;
        drugOptionNames = [] as Array<data.IOptiondrug>;
        drug = {} as data.IDrugName;
        zepiDrugs = [] as Array<data.IZepiDrugName>;
        zepiList: Array<data.IDrugName> = [];
        medOption: number;
        public selectMedicationFormulation: (drugOptionId: Object) => void;

        static $inject = ["PersonMedicationService", "DrugOptionService", "DrugNameService", "DrugSuffixService", "ZepiDrugNameService", "dialogs"];
        constructor(private personMedicationService: data.IPersonMedicationService,
            private drugOptionService: data.IDrugOptionService,
            private drugNameService: data.IDrugNameService,
            private drugSuffixService: data.IDrugSuffixService,
            private zepiDrugService: data.IZepiDrugNameService,
            private dialog: ng.dialogservice.IDialogOptions
        ) {

        }


        $onInit = () => {
            this.zepiDrugService.getZepiDrugNames().then((response) => {
                this.zepiList = response;
            });
        }

        selectMedication = (medicationId: string) => {
            this.drugNameId = medicationId;
        }

        select = (id: string) => {
            this.selectMedicationFormulation({ drugId: id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/zepi/select.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "selectMedicationFormulation": "&"
            };

        }
    }

    app.component("mrsSelectVaccinationDialog", new Component());

}
