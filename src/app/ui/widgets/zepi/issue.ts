namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IZepiIssueDialog extends ng.IController {
        closed: () => void;
        saved: () => void;
    }

    class Controller implements IZepiIssueDialog {
        public closed: () => void;
        public saved: () => void;
        stock: data.IDrug;
        personId: string;
        drugOptionId: string;
        personMedicationId: string;
        drug: data.IDrugName;
        stockList: Array<data.IDrugList>;
        datePickerOpenStatus = {};
        formulations: string[] = [];
        personMedication = {} as data.IPersonMedication;
        batch = {} as data.IDrugBatch;
        dispense = {} as data.IDispense;
        frequencyId: string;
        drugId: string;
        drugOptions = [] as Array<data.IDrugOption>;
        drugSuffix = [] as Array<data.IDrugSuffix>;
        drugOptionNames = [] as Array<data.IOptiondrug>;
        unit: data.IUnit;
        dispenseId: string;
        batches: Array<data.IDrugBatch> = [];
        batchExpiryDate: Date;
        formulation: data.IFormulation;

        static $inject = ["DrugNameService", "DrugSuffixService", "DrugOptionService", "DrugService", "DrugBatchService",
            "PersonMedicationService", "DispenseService", "SiteSettingService", "UnitService", "FormulationService"];
        constructor(private drugNameService: data.IDrugNameService,
            private drugSuffixService: data.IDrugSuffixService,
            private drugOptionService: data.IDrugOptionService,
            private drugStockService: data.IDrugService,
            private drugBatchService: data.IDrugBatchService,
            private personMedicationService: data.IPersonMedicationService,
            private dispenseService: data.IDispenseService,
            private siteSettingService: data.ISiteSettingService,
            private unitService: data.IUnitService,
            private formulationService: data.IFormulationService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        $onInit = () => {
            this.siteSettingService.fetch("FREQUENCY_STAT_ID").then((response) => {
                this.frequencyId = response.value;
            });
            this.drugBatchService.getByDrugId(this.drugId).then((response) => {
                this.batches = response;
            });
        }

        init = () => {
            if (this.drugOptionId) {

            }
            if (this.drugId) {
                this.drugStockService.get(this.drugId).then((response) => {
                    this.stock = response;
                    this.personMedicationService.get(this.personMedicationId).then((response) => {
                        this.personMedication = response;
                    }, (err) => {
                        this.personMedication.drugNameId = this.stock.drugNameId;
                        this.personMedication.date = new Date();
                        this.personMedication.personId = this.personId;
                    });
                    this.formulationService.get(response.formulationId).then((response) => {
                        this.formulation = response;
                    });
                    this.unitService.get(response.unitId).then((response) => {
                        this.unit = response;
                    });
                    this.drugNameService.get(response.drugNameId).then((response) => {
                        this.drug = response;
                        this.drugOptionService.getDrugOptionsByDrugNameId(this.drug.id).then((response) => {
                            this.drugOptions = response;
                            this.drugSuffixService.query().then((response) => {
                                this.drugSuffix = response;
                                this.drugOptions.forEach((drugOption) => {
                                    this.drugSuffix.forEach((drugSuffix) => {
                                        if (drugOption.suffixId === drugSuffix.id) {
                                            let option = {} as data.IOptiondrug;
                                            option.id = drugSuffix.name;
                                            option.value = drugOption.id;
                                            this.drugOptionNames.push(option);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });

                this.dispenseService.get(this.dispenseId).then((response) => {
                    this.dispense = response;
                }, (err) => {
                    this.dispense.frequencyId = this.frequencyId;
                    this.dispense.drugId = this.drugId;
                    this.dispense.quantity = 1;
                });


            }



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

        openCalendar = (date: string) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }

        save = () => {
            if (this.personMedication.id) {
                this.personMedicationService.update(this.personMedication).then((response) => {
                    if (this.dispense.id) {
                        this.dispenseService.update(this.dispense).then((response) => {
                            this.saved();
                        });
                    }
                    this.saved();
                });
            } else {
                this.personMedicationService.save(this.personMedication).then((response) => {
                    let sd = moment(response.date).format("YYYY-MM-DD");
                    let cd = moment(new Date).format("YYYY-MM-DD");
                    if ((new Date(sd).getTime() === new Date(cd).getTime())) {
                        this.dispense.date = this.personMedication.date;
                        this.dispense.frequencyId = this.frequencyId;
                        this.dispense.personMedicationId = response.id;
                        this.dispenseService.save(this.dispense).then((response) => {
                            this.saved();
                        });
                    } else {
                        this.saved();
                    }
                });
            }
        }

        close = () => {
            this.closed();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/zepi/issue.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                dispenseId: "<",
                personMedicationId: "<",
                personId: "<",
                drugId: "<",
                drugOptionId: "<",
                closed: "&",
                saved: "&"

            };

        }
    }

    app.component("mrsZepiIssueDialog", new Component());

}
