namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPartogramOxytocinDialog extends ng.IController {
    }

    class Controller implements IPartogramOxytocinDialog {
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

        $onInit = (): void => {

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
                    }, (error) => {

                        this.dispense.date = new Date(moment(this.date));
                    });
                }, (error) => {
                    this.oxytocin.personId = this.personId;
                    this.oxytocin.drugNameId = response.value;
                    this.oxytocin.date = new Date(moment(this.date));
                    this.oxytocin.time = new Date(moment(this.date));
                    this.dispense.date = new Date(moment(this.date));
                });
            });

        }

        getBatches = () => {
            this.drugBatchService.getByDrugId(this.dispense.drugId).then((response) => {
                this.batches = response;
                this.save();
            });
        }

        getExpiryDate = () => {
            if (this.batches) {
                this.batches.forEach((batch) => {
                    if (batch.id === this.dispense.batchId) {
                        this.batchExpiryDate = batch.expiryDate;
                        this.save();
                    }
                });
            }
        }

        save = () => {
            if (this.dispense.drugId && this.dispense.quantity) {
                if (this.oxytocin.id) {
                    this.saveDispense(this.oxytocin.id);
                } else {
                    this.encounterMedicationService.saveEncounterMedication(this.encounterId, this.oxytocin).then((response) => {
                        this.oxytocin.id = response.personMedicationId;
                        this.saveDispense(response.personMedicationId);
                    });
                }
            }
        }

        saveDispense = (personMedicationId: string) => {

            if (this.dispense.id) {
                this.dispenseService.update(this.dispense).then((response) => {
                    this.dispense = response;
                });
            } else {
                this.siteSettingService.fetch(this.frequencyStatId).then((response) => {
                    this.dispense.frequencyId = response.value;
                    this.dispense.personMedicationId = personMedicationId;
                    this.dispenseService.save(this.dispense).then((response) => {
                        this.dispense.id = response.id;
                    });
                });

            }

        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/oxytocin/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                date: "<",
                personId: "<",
                encounterId: "<"
            };

        }
    }

    app.component("mrsPartogramOxytocinDialog", new Component());

}
