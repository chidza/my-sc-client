namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPrescription extends IAggregateRoot<string> {
        date: Date;
        dispenseId?: string;
        drugId: string;
        duration: number;
        encounterId: string;
        frequencyId: string;
    }

    export interface IEncounterPrescriptionList {
        id: string;
        date: Date;
        time: Date;
        dispenseId?: string;
        drugName?: string;
        formulation?: string;
        strength?: number;
        drugId?: string;
        unit?: string;
        duration: number;
        encounterId?: string;
        frequency?: string;
        frequencyId?: string;
    }

    export interface IPrescriptionService extends data.IAggregateRootService<IPrescription, string> {
        getEncounterPrescriptions(encounterId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
        getPersonPrescriptions(personId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
        query(text?: string): ng.IPromise<Array<IPrescription>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
    }

    interface IPrescriptionResource extends IResourceService<IPrescription> {
        getPersonPrescriptions: ng.resource.IResourceArrayMethod<IPrescription>;
        getEncounterPrescriptions: ng.resource.IResourceArrayMethod<IPrescription>;
        getEncounterDrugNames: ng.resource.IResourceArrayMethod<IDrugName>;
        getEncounterDrugs: ng.resource.IResourceArrayMethod<IDrug>;
        getPersonDrugs: ng.resource.IResourceArrayMethod<IDrug>;
        getPersonDrugNames: ng.resource.IResourceArrayMethod<IDrugName>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterPrescriptionList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterPrescriptionList>;
    }

    class PrescriptionService extends EntityService<IPrescription, string, IPrescriptionResource> implements IPrescriptionService {



        static $inject = ["PrescriptionResource", "DrugService", "FormulationService", "UnitService", "FrequencyService", "$q"];
        constructor(private resource: IPrescriptionResource,
            private drugService: IDrugService,
            private formulationService: IFormulationService,
            private unitService: IUnitService,
            private frequencyService: IFrequencyService,
            private q: ng.IQService) {
            super(resource);
        }

        getPersonPrescriptions = (personId: string): ng.IPromise<Array<IEncounterPrescriptionList>> => {
            let defer = this.q.defer();
            let allPages: IPageRequest = {
                page: 0,
                size: 32000
            };
            this.q.all<IPrescription[], IFormulation[], IUnit[], IFrequency[], IDrug[], IDrugName[]>(
                [
                    this.getResource().getPersonPrescriptions({ personId: personId }).$promise,
                    this.formulationService.query("", allPages),
                    this.unitService.query(),
                    this.frequencyService.query(),
                    this.getResource().getPersonDrugs({ personId: personId }).$promise,
                    this.getResource().getPersonDrugNames({ personId: personId }).$promise
                ]).then((response) => {
                    let prescriptions = response[0];

                    let formulations = response[1];

                    let units = response[2];

                    let frequencies = response[3];

                    let drugs = response[4];

                    let drugNames = response[5];

                    let result: Array<IEncounterPrescriptionList> = [];

                    // code to builde Array
                    prescriptions.forEach((prescription) => {
                        if (!prescription.dispenseId) {
                            let entry: IEncounterPrescriptionList = {
                                id: prescription.id,
                                date: prescription.date,
                                time: prescription.date,
                                duration: prescription.duration,
                                frequencyId: prescription.frequencyId,
                                dispenseId: prescription.dispenseId
                            };

                            drugs.forEach((drug) => {

                                if (drug.id === prescription.drugId) {
                                    entry.drugId = drug.id;
                                    entry.strength = drug.strength;

                                    drugNames.forEach((name) => {

                                        if (name.id === drug.drugNameId) {
                                            entry.drugName = name.name;
                                        }
                                    });

                                    formulations.forEach((formulation) => {
                                        if (formulation.id === drug.formulationId) {
                                            entry.formulation = formulation.name;
                                        }
                                    });

                                    units.forEach((unit) => {
                                        if (unit.id === drug.unitId) {
                                            entry.unit = unit.name;
                                        }
                                    });

                                }

                            });

                            frequencies.forEach((frequency) => {
                                if (frequency.id === prescription.frequencyId) {
                                    entry.frequency = frequency.name;
                                }
                            });

                            result.push(entry);
                        }

                    });

                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });

            return defer.promise;
        }


        getEncounterPrescriptions = (encounterId: string): ng.IPromise<Array<IEncounterPrescriptionList>> => {


            let defer = this.q.defer();
            let allPages: IPageRequest = {
                page: 0,
                size: 32000
            };
            this.q.all<IPrescription[], IFormulation[], IUnit[], IFrequency[], IDrug[], IDrugName[]>(
                [
                    this.getResource().getEncounterPrescriptions({ encounterId: encounterId }).$promise,
                    this.formulationService.query("", allPages),
                    this.unitService.query(),
                    this.frequencyService.query(),
                    this.getResource().getEncounterDrugs({ encounterId: encounterId }).$promise,
                    this.getResource().getEncounterDrugNames({ encounterId: encounterId }).$promise
                ]).then((response) => {

                    let prescriptions = response[0];

                    let formulations = response[1];

                    let units = response[2];

                    let frequencies = response[3];

                    let drugs = response[4];

                    let drugNames = response[5];

                    let result: Array<IEncounterPrescriptionList> = [];

                    // code to builde Array
                    prescriptions.forEach((prescription) => {


                        let entry: IEncounterPrescriptionList = {
                            id: prescription.id,
                            date: prescription.date,
                            time: prescription.date,
                            duration: prescription.duration,
                            encounterId: encounterId,
                            frequencyId: prescription.frequencyId,
                            dispenseId: prescription.dispenseId
                        };

                        drugs.forEach((drug) => {

                            if (drug.id === prescription.drugId) {
                                entry.drugId = drug.id;
                                entry.strength = drug.strength;

                                drugNames.forEach((name) => {

                                    if (name.id === drug.drugNameId) {
                                        entry.drugName = name.name;
                                    }
                                });

                                formulations.forEach((formulation) => {
                                    if (formulation.id === drug.formulationId) {
                                        entry.formulation = formulation.name;
                                    }
                                });

                                units.forEach((unit) => {
                                    if (unit.id === drug.unitId) {
                                        entry.unit = unit.name;
                                    }
                                });

                            }

                        });

                        frequencies.forEach((frequency) => {
                            if (frequency.id === prescription.frequencyId) {
                                entry.frequency = frequency.name;
                            }
                        });

                        result.push(entry);

                    });

                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });


            return defer.promise;


        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterPrescriptionList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterPrescriptionList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<IPrescription>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("PrescriptionResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IPrescriptionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/prescriptions/:id");

            return <IPrescriptionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getEncounterPrescriptions": {
                    url: mrs.config.Settings.serverResource("api/prescriptions/encounter/:encounterId"),
                    method: "GET", isArray: true
                },
                "getEncounterDrugNames": {
                    url: mrs.config.Settings.serverResource("api/prescriptions/encounter/:encounterId/drug-names"),
                    method: "GET", isArray: true
                },
                "getEncounterDrugs": {
                    url: mrs.config.Settings.serverResource("api/prescriptions/encounter/:encounterId/drugs"),
                    method: "GET", isArray: true
                }, "getPersonPrescriptions": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/prescriptions"),
                    method: "GET", isArray: true
                },
                "getPersonDrugNames": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/prescriptions/drug-names"),
                    method: "GET", isArray: true
                },
                "getPersonDrugs": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/prescriptions/drugs"),
                    method: "GET", isArray: true
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertDateTimeFromServer(data.time);

                        }
                        return data;
                    }
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/prescriptions")
                }, "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/prescriptions")
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("PrescriptionService", PrescriptionService);

}