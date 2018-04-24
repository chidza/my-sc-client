namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramOxytocinView extends ng.IController {
    }

    class Controller implements IPartogramOxytocinView {
        encounterId: string;
        date: string;
        personId: string;
        oxytocin = {} as data.IPersonMedication;
        formulations: Array<data.IDrugList> = [];
        batches: Array<data.IDrugBatch> = [];
        batchExpiryDate: Date;
        dispense = {} as data.IDispense;
        oxtocinId: string = mrs.config.Settings.SiteSettings.MEDICATION_OXYTOCIN_ID;
        frequencyStatId = mrs.config.Settings.SiteSettings.STAT_ID;
        static $inject = ["PersonMedicationService", "SiteSettingService", "DispenseService", "DrugService", "EncounterMedicationService", "DrugBatchService"];
        constructor(private personMedicationService: data.IPersonMedicationService,
            private siteSettingService: data.ISiteSettingService,
            private dispenseService: data.IDispenseService,
            private drugService: data.IDrugService,
            private encounterMedicationService: data.IEncounterMedicationService,
            private drugBatchService: data.IDrugBatchService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId && this.date) {
                this.siteSettingService.fetch(this.oxtocinId).then((response) => {
                    this.drugService.getDrugs(response.value).then((response) => {
                        this.formulations = response;
                    });

                    this.personMedicationService.getByPersonAndDrugAndDate(this.personId, response.value, this.date).then((response) => {
                        this.oxytocin = response;
                        this.dispenseService.getByPersonMedicationId(this.oxytocin.id).then((response) => {
                            this.dispense = response;
                            this.drugBatchService.getByDrugId(this.dispense.drugId).then((response) => {
                                this.batches = response;
                                this.getExpiryDate();
                            });
                        });
                    });
                });
            }
        }
        getBatches = () => {
            this.drugBatchService.getByDrugId(this.dispense.drugId).then((response) => {
                this.batches = response;
            });
        }
        getExpiryDate = () => {
            if (this.batches) {
                this.batches.forEach((batch) => {
                    if (batch.id === this.dispense.batchId) {
                        this.batchExpiryDate = batch.expiryDate;
                    }
                });
            }
        }

        getFormulation = (id: string): string => {
            let result: string = "";

            if (this.formulations) {
                this.formulations.forEach((d) => {
                    if (d.id === id) {
                        result = d.formulation + "/" + d.strength + d.unit;
                    }
                });
            }
            return result;
        }

        getBatch = (id: string): string => {
            let result: string = "";

            if (this.batches) {
                this.batches.forEach((b) => {
                    if (b.id === id) {
                        result = b.batchNumber;
                    }
                });
            }

            return result;
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/oxytocin/view.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                date: "<",
                personId: "<"
            };

        }
    }

    app.component("mrsPartogramOxytocinView", new Component());

}
