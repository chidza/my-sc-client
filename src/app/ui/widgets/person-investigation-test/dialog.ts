namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonInvestigationTestDialog extends ng.IController {
        closed: () => void;
    }

    class Controller implements IPersonInvestigationTestDialog {

        public closed: () => void;
        personInvestigationTestId: string;
        personInvestigationId: string;
        personInvestigationTest = {} as data.IPersonInvestigationTest;
        personInvestigation = {} as data.IPersonInvestigation;
        testKits: Array<data.ITestKit> = [];
        testKitBatches: Array<data.ITestKitBatch> = [];
        testKitBatch: data.ITestKitBatch;
        investigationResults: Array<data.IResult> = [];
        expiryDate: string;
        investigation: data.IInvestigation;
        sample: data.ISample;
        labTest: data.ILabTest;

        static $inject = ["PersonInvestigationTestService", "PersonInvestigationService", "InvestigationResultService", "TestKitBatchService",
            "InvestigationService", "SampleService", "LabTestService", "DateUtils", "SiteSettingService"];
        constructor(private personInvestigationTestService: data.IPersonInvestigationTestService,
            private personInvestigationService: data.IPersonInvestigationService,
            private investigationResultService: data.IInvestigationResultService,
            private testKitBatchService: data.ITestKitBatchService,
            private investigationService: data.IInvestigationService,
            private sampleService: data.ISampleService,
            private labTestService: data.ILabTestService,
            private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) { }

        init = () => {
            if (this.personInvestigationId) {
                this.personInvestigationService.get(this.personInvestigationId).then((response) => {
                    this.personInvestigation = response;

                    this.investigationService.get(response.investigationId).then((response) => {
                        this.investigation = response;
                        this.sampleService.get(response.sampleId).then((response) => {
                            this.sample = response;
                        });
                        this.labTestService.get(response.testId).then((response) => {
                            this.labTest = response;
                        });
                    });

                    this.personInvestigationTestService.getTestKitsByInvestigationId(this.personInvestigation.investigationId).then((response) => {
                        this.testKits = response;
                    });

                    this.investigationResultService.getResultByInvestigationId(this.personInvestigation.investigationId).then((response) => {
                        this.investigationResults = response;
                    });
                    this.personInvestigationTestService.get(this.personInvestigationTestId).then((response) => {
                        this.personInvestigationTest = response;
                        if (this.personInvestigationTest.testKitId) {
                            this.testKitBatchService.getByTestKitId(this.personInvestigationTest.testKitId).then((response) => {
                                this.testKitBatches = response;
                                if (this.personInvestigationTest.testKitBatchId) {
                                    this.getExpiryDate(this.personInvestigationTest.testKitBatchId);
                                }
                            });
                        }
                    }, (err) => {
                        this.personInvestigationTest.personInvestigationId = this.personInvestigationId;
                        this.siteSettingService.currentTime().then((response) => {
                            // this.currentTime = response;
                            let ct = response.currentTime;
                            const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                            this.personInvestigationTest.date = new Date(myDate);
                        });
                    });
                });
            }
        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        getTestKitBatch = (id: string) => {
            this.testKitBatches = [];
            this.personInvestigationTest.testKitBatchId = null;
            this.testKitBatchService.getByTestKitId(id).then((response) => {
                this.testKitBatches = response;
            });
        }

        getExpiryDate = (id: string) => {
            this.expiryDate = null;
            this.testKitBatches.forEach((batch) => {
                if (batch.id === id) {
                    this.expiryDate = batch.expiryDate;
                }
            });
        }


        isValid = (): boolean => {
            let result: boolean = true;
            if (this.testKits.length > 0 && !this.personInvestigationTest.testKitId) {
                result = false;
            }
            if (angular.isUndefined(this.personInvestigationTest.result) || this.personInvestigationTest.result.length === 0) {
                result = false;
            }
            if (this.testKitBatches.length > 0 && !this.personInvestigationTest.testKitBatchId) {
                result = false;
            }

            return result;
        }

        save = () => {
            if (this.personInvestigationTest.id) {
                this.personInvestigationTestService.update(this.personInvestigationTest).then((response) => {
                    this.closed();
                });
            }
            else {
                this.personInvestigationTest.date = new Date();
                this.personInvestigationTest.personInvestigationId = this.personInvestigationId;
                this.personInvestigationTestService.save(this.personInvestigationTest).then((response) => {
                    this.closed();
                });

            }

        }

        cancel = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-investigation-test/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                closed: "&",
                personInvestigationTestId: "<",
                personInvestigationId: "<"
            };

        }
    }

    app.component("mrsPersonInvestigationTestDialog", new Component());

}
