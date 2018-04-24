namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHtsSession {
        htsId: string;
        encounterId: string;
    }

    export interface IPncSession {
        pncVisitId: string;
        encounterId: string;
        pncVisitTypeId: string;
    }

    export interface IArtSession {
        artVisitId: string;
        encounterId: string;
    }

    export interface ITbSession {
        tbVisitId: string;
        encounterId: string;
    }

    export interface IConsultationService {
        generalEncounter(workspaceId: string, workareaId: string, personId: string): ng.IPromise<IEncounter>;
        discharge(workspaceId: string, workareaId: string, personId: string): ng.IPromise<IOpd>;
        htsEncounter(workspaceId: string, workareaId: string, personId: string): ng.IPromise<IHtsSession>;
        getVitals(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getVitalsByVitalType(workspaceId: string, personId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getComplaints(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterComplaintList>>;
        getExaminations(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterExaminationList>>;
        getInvestigations(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterInvestigationList>>;
        getDiagnoses(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterDiagnosisList>>;
        getPrescriptions(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
        getProcedures(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterProcedureList>>;
        pncEncounter(workspaceId: string, workareaId: string, personId: string): ng.IPromise<IPncSession>;
        pncChildEncounter(workspaceId: string, workareaId: string, motherId: string, childId: string): ng.IPromise<IPncSession>;
        artEncounter(workspaceId: string, workareaId: string, personId: string): ng.IPromise<IArtSession>;
        tbEncounter(workspaceId: string, workareaId: string, personId: string): ng.IPromise<ITbSession>;
        getHealthEducations(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterHealthEducationList>>;
        getDispenseMedication(workspaceId: string, personId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
    }

    class ConsultationService implements IConsultationService {

        static $inject = ["OpdService", "AdmissionService", "HtsService",
            "EncounterVitalService", "EncounterComplaintService", "EncounterExaminationService",
            "EncounterInvestigationService", "EncounterDiagnosisService", "PrescriptionService",
            "EncounterProcedureService", "$q", "PncService", "PncVisitService",
            "ArtService", "ArtVisitService", "TbService", "TbVisitService", "EncounterHealthEducationService", "DispenseService"];
        constructor(private opdService: IOpdService,
            private admissionService: IAdmissionService,
            private htsService: IHtsService,
            private encounterVitalService: IEncounterVitalService,
            private encounterComplaintService: IEncounterComplaintService,
            private encounterExaminationService: IEncounterExaminationService,
            private encounterInvestigationService: IEncounterInvestigationService,
            private encounterDiagnosisService: IEncounterDiagnosisService,
            private prescriptionService: IPrescriptionService,
            private encounterProcedureService: IEncounterProcedureService,
            private q: ng.IQService,
            private pncService: data.IPncService,
            private pncVisitService: data.IPncVisitService,
            private artService: data.IArtService,
            private artVisitService: data.IArtVisitService,
            private tbService: data.ITbService,
            private tbVisitService: data.ITbVisitService,
            private encounterHealthEducationService: data.IEncounterHealthEducationService,
            private dispenseService: data.IDispenseService) {

        }

        generalEncounter = (workspaceId: string, workareaId: string, personId: string): ng.IPromise<IEncounter> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.opdService.opdSession(opd.id, workareaId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":
                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.admissionService.startEncounter(workareaId, admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        discharge = (workspaceId: string, workareaId: string, personId: string): ng.IPromise<IOpd> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.opdService.discharge(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":
                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.admissionService.discharge(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        htsEncounter = (workspaceId: string, workareaId: string, personId: string): ng.IPromise<IHtsSession> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {

                        this.htsService.htsSession(opd.id, workareaId).then((response) => {
                            defer.resolve({ encounterId: response.encounterId, htsId: response.id });

                        }, (error) => {
                            defer.reject(error);
                        });

                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {

                        this.htsService.htsAdmissionSession(admission.admissionId, workareaId).then((response) => {
                            defer.resolve({ encounterId: response.encounterId, htsId: response.id });
                        }, (error) => {
                            defer.reject(error);
                        });

                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        getVitals = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterVitalList>> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":

                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterVitalService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterVitalService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        getDispenseMedication = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterPrescriptionList>> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":

                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.dispenseService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.dispenseService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        getVitalsByVitalType = (workspaceId: string, personId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":

                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterVitalService.getForOpdAndVital(opd.id, vitalId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterVitalService.getForAdmissionAndVital(admission.admissionId, vitalId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        getComplaints = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterComplaintList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterComplaintService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterComplaintService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }


        getHealthEducations = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterHealthEducationList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterHealthEducationService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterHealthEducationService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        getExaminations = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterExaminationList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterExaminationService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterExaminationService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        getInvestigations = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterInvestigationList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterInvestigationService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterInvestigationService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        getDiagnoses = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterDiagnosisList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterDiagnosisService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterDiagnosisService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        getPrescriptions = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterPrescriptionList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.prescriptionService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.prescriptionService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        getProcedures = (workspaceId: string, personId: string): ng.IPromise<Array<IEncounterProcedureList>> => {
            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":

                    this.opdService.current(personId).then((opd) => {
                        defer.resolve(this.encounterProcedureService.getForOpd(opd.id));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((admission) => {
                        defer.resolve(this.encounterProcedureService.getForAdmission(admission.admissionId));
                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }

        pncEncounter = (workspaceId: string, workareaId: string, personId: string): ng.IPromise<IPncSession> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((response) => {
                        this.pncService.current(personId).then((pnc) => {
                            this.pncVisitService.opdSession(response.id, workareaId, pnc.id).then((response) => {
                                defer.resolve({ encounterId: response.encounterId, pncVisitId: response.id, pncVisitTypeId: response.pncVisitTypeId });

                            }, (error) => {
                                defer.reject(error);
                            });
                        });


                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":

                    this.admissionService.current(personId).then((response) => {
                        this.pncService.current(personId).then((pnc) => {
                            this.pncVisitService.wardSession(response.id, pnc.id).then((response) => {
                                defer.resolve({ encounterId: response.encounterId, pncVisitId: response.id, pncVisitTypeId: response.pncVisitTypeId });
                            }, (error) => {
                                defer.reject(error);
                            });
                        });



                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        pncChildEncounter = (workspaceId: string, workareaId: string, motherId: string, childId: string): ng.IPromise<IPncSession> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(motherId).then((opd) => {
                        this.pncService.current(childId).then((pnc) => {
                            this.pncVisitService.childVisit(opd.id, workareaId, pnc.id).then((response) => {
                                defer.resolve({ encounterId: response.encounterId, pncVisitId: response.id });
                            }, (error) => {
                                defer.reject(error);
                            });
                        });

                    }, (error) => {
                        defer.reject(error);
                    });

                    break;
                case "admission":
                    this.admissionService.current(motherId).then((motherAdmission) => {

                        this.admissionService.current(childId).then((childAdmission) => {
                            this.pncService.current(childId).then((pnc) => {
                                this.pncVisitService.wardSession(childAdmission.id, pnc.id).then((response) => {
                                    defer.resolve({ encounterId: response.encounterId, pncVisitId: response.id });
                                }, (error) => {
                                    defer.reject(error);
                                });
                            }, () => {

                                /*child not admitted */
                            });

                        }, () => {
                            console.log("... child not admitted ");
                            let admission = {} as data.IAdmission;
                            admission.time = new Date();
                            admission.wardId = motherAdmission.wardId;
                            // admission.facilityId = mother.facilityId;
                            admission.personId = childId;
                            this.admissionService.save(admission).then((childAdmission) => {
                                this.pncService.current(childId).then((pnc) => {
                                    this.pncVisitService.wardSession(childAdmission.id, pnc.id).then((response) => {
                                        defer.resolve({ encounterId: response.encounterId, pncVisitId: response.id });
                                    }, (error) => {
                                        defer.reject(error);
                                    });
                                });
                            });

                        });

                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        artEncounter = (workspaceId: string, workareaId: string, personId: string): ng.IPromise<IArtSession> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((response) => {
                        this.artService.getByPersonId(personId).then((art) => {
                            this.artVisitService.artSession(response.id, workareaId, art.id).then((response) => {
                                defer.resolve({ encounterId: response.encounterId, artVisitId: response.id });
                            }, (error) => {
                                defer.reject(error);
                            });
                        });


                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;

        }

        tbEncounter = (workspaceId: string, workareaId: string, personId: string): ng.IPromise<ITbSession> => {

            let defer = this.q.defer();

            switch (workspaceId) {
                case "opd":
                    this.opdService.current(personId).then((response) => {
                        this.tbService.current(personId).then((tb) => {
                            console.log("tb.........................");
                            console.log(tb);
                            this.tbVisitService.tbSession(response.id, workareaId, tb.id).then((response) => {
                                defer.resolve({ encounterId: response.encounterId, tbVisitId: response.id });
                            }, (error) => {
                                defer.reject(error);
                            });
                        });


                    }, (error) => {
                        defer.reject(error);
                    });
                    break;
                case "admission":
                    break;
                default:
                    defer.reject("Invalid workspace " + workspaceId);
                    break;
            }

            return defer.promise;
        }
    }

    app.service("ConsultationService", ConsultationService);

}