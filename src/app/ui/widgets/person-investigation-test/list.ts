namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonInvestigationTestList extends ng.IController {
        addTest: (personInvestigationId: Object) => void;
        editTest: (personInvestigationTestId: Object) => void;
        closed: () => void;
    }

    interface TestResult {
        id: string;
        name: string;
    }

    class Controller implements IPersonInvestigationTestList {
        personInvestigationId: string;
        personInvestigation: data.IPersonInvestigation;
        investigation: data.IInvestigation;
        sample: data.ISample;
        labTest: data.ILabTest;
        list: Array<data.IPersonInvestigationTest> = [];
        testKits: Array<data.ITestKit> = [];
        testKitBaches: Array<data.ITestKitBatch> = [];
        investigationResults: Array<data.IResult> = [];
        mode: string;
        hivInvestigationTestId: string;
        syphilisInvestigationTestId: string;
        syphilisPositiveResultId: string;
        hivPositiveResultId: string;
        confirm: boolean = false;
        results: Array<TestResult> = [];
        diagnoses: Array<data.IDiagnosis> = [];
        personDiagnoses: Array<data.IEncounterDiagnosisList> = [];
        opdId: string;
        admissionId: string;
        personId: string;
        encounterId: string;
        personDiagnosis = {} as data.IPersonDiagnosis;

        public addTest: (personInvestigationId: Object) => void;
        public editTest: (personInvestigationTestId: Object) => void;
        public closed: () => void;

        static $inject = ["EncounterInvestigationService", "dialogs", "PersonInvestigationService", "InvestigationService",
            "SampleService", "LabTestService", "InvestigationResultService", "PersonInvestigationTestService",
            "SiteSettingService", "PersonDiagnosisService", "EncounterDiagnosisService"];
        constructor(private encounterInvestigationService: data.IEncounterInvestigationService,
            private dialog: ng.dialogservice.IDialogService,
            private personInvestigationService: data.IPersonInvestigationService,
            private investigationService: data.IInvestigationService,
            private sampleService: data.ISampleService,
            private labTestService: data.ILabTestService,
            private investigationResultService: data.IInvestigationResultService,
            private personInvestigationTestService: data.IPersonInvestigationTestService,
            private siteSettingService: data.ISiteSettingService,
            private personDiagnosesService: data.IPersonDiagnosisService,
            private encounterDiagnosisService: data.IEncounterDiagnosisService) { }

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
                    this.investigationResultService.getResultByInvestigationId(this.personInvestigation.investigationId).then((response) => {
                        this.investigationResults = response;
                        this.checkDiagnosis();
                        this.personInvestigationTestService.getByPersonInvestigationId(this.personInvestigationId).then((response) => {
                            this.list = response;
                            this.results = [];
                            if (this.list.length > 0) {
                                this.list.forEach((test) => {
                                    let result = {} as TestResult;
                                    result.id = test.result;
                                    result.name = this.getResult(test.result);
                                    let add = true;

                                    if (this.results.length > 0) {
                                        this.results.forEach((r) => {
                                            if (r.name === result.name) {
                                                add = false;
                                            }
                                        });
                                    }

                                    if (add) {
                                        this.results.push(result);
                                    }
                                });
                            }
                            this.checkResult();
                            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.HIV_TEST_ID).then((response) => {
                                this.hivInvestigationTestId = response.value;
                                this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.POSITIVE_RESULT_ID).then((response) => {
                                    this.hivPositiveResultId = response.value;
                                    if (this.personInvestigation.investigationId === this.hivInvestigationTestId) {
                                        this.confirmResult();
                                    }
                                });

                            });

                            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.INVESTIGATION_SYPHILIS_ID).then((response) => {
                                this.syphilisInvestigationTestId = response.value;
                                this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.SYPHILIS_POSITIVE_RESULT_ID).then((response) => {
                                    this.syphilisPositiveResultId = response.value;
                                    if (this.personInvestigation.investigationId === this.syphilisInvestigationTestId) {
                                        this.confirmResult();
                                    }
                                });

                            });
                        });
                    });

                });


                this.personInvestigationTestService.getTestKitsByPersonInvestigationId(this.personInvestigationId).then((response) => {
                    this.testKits = response;
                });
                this.personInvestigationTestService.getTestKitBatchesByPersonInvestigationId(this.personInvestigationId).then((response) => {
                    this.testKitBaches = response;
                });

            }

        }

        confirmResult = () => {
            this.confirm = false;
            if (this.list.length === 1) {

                if (this.list[0].result === this.hivPositiveResultId) {
                    this.confirm = true;
                }

                if (this.list[0].result === this.syphilisPositiveResultId) {
                    this.confirm = true;
                }
            }

            if (this.list.length === 2) {
                if (this.list[0].result !== this.list[1].result) {
                    this.confirm = true;
                }
            }

        }

        testKitBatch = (id: string): data.ITestKitBatch => {
            let result: any;
            if (this.testKitBaches) {
                this.testKitBaches.forEach((batch) => {
                    if (batch.id === id) {
                        result = batch;
                    }
                });
            }
            return result;

        }

        testKit = (id: string): string => {
            let result: string;
            if (this.testKits) {
                this.testKits.forEach((kit) => {
                    if (kit.id === id) {
                        result = kit.name;
                    }
                });
            }
            return result;

        }

        getResult = (id: string): string => {
            let result: string;
            if (this.investigationResults.length > 0) {
                this.investigationResults.forEach((r) => {
                    if (r.id === id) {
                        result = r.name;
                    }
                });
            } else {
                result = id;
            }

            return result;
        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.getEncounterDiagnoses();
            this.init();
        }

        add = () => {
            this.addTest({ personInvestigationId: this.personInvestigationId });
        }

        edit = (id: string) => {
            this.editTest({ personInvestigationTestId: id });
        }

        save = () => {
            this.personInvestigationService.update(this.personInvestigation).then((response) => {
                this.personInvestigation = response;
                if (this.personInvestigation.result) {
                    this.checkDiagnosis();
                }
            });
        }

        checkDiagnosis = () => {
            this.diagnoses = [];
            if (this.investigationResults.length > 0) {
                this.investigationResults.forEach((i) => {
                    if (i.id === this.personInvestigation.result) {
                        this.diagnoses = i.diagnoses;
                    }
                });
            }

        }
        saveDiagnosis = (item: data.IDiagnosis) => {
            if (this.isExist(item.id)) {
                this.personDiagnosesService.remove(this.getDiagnosisId(item.id)).then((response) => {

                });
            } else {
                this.personDiagnosis.date = new Date();
                this.personDiagnosis.definitive = true;
                this.personDiagnosis.finalDiagnosis = true;
                this.personDiagnosis.working = false;
                this.personDiagnosis.differential = false;
                this.personDiagnosis.diagnosisId = item.id;
                this.personDiagnosis.personId = this.personInvestigation.personId;
                this.encounterDiagnosisService.saveEncounterDiagnosis(this.encounterId, this.personDiagnosis).then((response) => {
                    this.getEncounterDiagnoses();
                });
            }
        }

        getDiagnosisId = (id: string): string => {
            let result = "";
            if (this.personDiagnoses.length > 0) {
                this.personDiagnoses.forEach((d) => {
                    if (d.diagnosisId === id) {
                        result = d.encounterPersonDiagnosisId;
                    }
                });
            }
            return result;
        }
        isExist = (id: string): boolean => {
            let result: boolean = false;
            if (this.personDiagnoses.length > 0) {
                this.personDiagnoses.forEach((d) => {
                    if (d.diagnosisId === id) {
                        result = true;
                    }
                });
            }
            return result;
        }

        close = () => {
            this.personInvestigationService.update(this.personInvestigation).then((response) => {
                this.closed();
            });
        }

        delete = (model: data.IPersonInvestigationTest) => {


            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.personInvestigationTestService.remove(model.id).then((response) => {
                    this.list.splice(this.list.indexOf(model), 1);
                }, () => {
                    this.dialog.error("Deleting Error", "Investigation Test could not be removed");
                });


            }, (error) => {

            });
        }

        checkResult = () => {
            let found: boolean = false;
            if (this.results.length > 0) {
                this.results.forEach((result) => {
                    if (result.id === this.personInvestigation.result) {
                        found = true;
                    }
                });
            }
            if (!found) {
                this.personInvestigation.result = null;
                this.save();
            }
        }

        getEncounterDiagnoses = () => {
            if (this.opdId) {
                this.personDiagnosesService.getForOpd(this.opdId).then((response) => {
                    this.personDiagnoses = response;
                });
            }
            if (this.admissionId) {
                this.personDiagnosesService.getForAdmission(this.admissionId).then((response) => {
                    this.personDiagnoses = response;
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-investigation-test/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                addTest: "&",
                editTest: "&",
                closed: "&",
                opdId: "<",
                admissionId: "<",
                encounterId: "<",
                personInvestigationId: "<",
                mode: "@"
            };

        }
    }

    app.component("mrsPersonInvestigationTestList", new Component());

}
