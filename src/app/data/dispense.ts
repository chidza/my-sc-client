namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDispense extends IAggregateRoot<string> {
        batchId: string;
        date: Date;
        frequencyId: string;
        drugId: string;
        personMedicationId: string;
        quantity: number;

    }

    export interface IDispenseList {
        id: string;
        personMedicationId: string;
        drugName?: string;
        quantity?: number;
        frequency?: string;
        date: Date;
    }

    export interface IPartogramDrugList {
        dispenseId: string;
        personMedicationId: string;
        drugName: string;
        quantity: number;
        formulation: string;
        date: Date;
    }

    export interface IDispenseService extends data.IAggregateRootService<IDispense, string> {
        query(text?: string): ng.IPromise<Array<IDispense>>;
        getDispenseItemsByPersonId(personId: string): ng.IPromise<Array<IDispenseList>>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IDispense>>;
        getByPersonMedicationId(personMedicationId: string): ng.IPromise<IDispense>;
        getByPersonIdAndDate(personId: string, date: string): ng.IPromise<Array<IPartogramDrugList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterPrescriptionList>>;

        // getForAdmission(admissionId: string): ng.IPromise<Array<IDispense>>;
        // getForOpd(opdId: string): ng.IPromise<Array<IDispense>>;
    }

    interface IDispenseResource extends IResourceService<IDispense> {
        getDispenseItemsByPersonId: ng.resource.IResourceMethod<Array<IDispense>>;
        getByPersonId: ng.resource.IResourceArrayMethod<IPersonMedication>;
        getPersonDrugs: ng.resource.IResourceArrayMethod<IDrug>;
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IDispense>>;
        getByPersonMedicationId: ng.resource.IResourceMethod<IDispense>;
        getByPersonIdAndDate: ng.resource.IResourceMethod<Array<IPartogramDrugList>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterPrescriptionList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterPrescriptionList>>;
        // getForAdmission: ng.resource.IResourceArrayMethod<IDispense>;
        // getForOpd: ng.resource.IResourceArrayMethod<IDispense>;
    }

    class DispenseService extends EntityService<IDispense, string, IDispenseResource> implements IDispenseService {

        static $inject = ["DispenseResource", "$q", "PersonMedicationService", "FrequencyService", "DrugNameService"];
        constructor(private resource: IDispenseResource,
            private q: ng.IQService,
            private personMedicationService: IPersonMedicationService,
            private frequencyService: IFrequencyService,
            private drugNameService: IDrugNameService) {
            super(resource);
        }

        getByPersonIdAndDate = (personId: string, date: string): ng.IPromise<Array<IPartogramDrugList>> => {
            return this.getResource().getByPersonIdAndDate({ personId: personId, date: date }).$promise;
        }

        getByPersonMedicationId = (personMedicationId: string): ng.IPromise<IDispense> => {
            return this.getResource().getByPersonMedicationId({ personMedicationId: personMedicationId }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<IDispense>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getDispenseItemsByPersonId = (personId: string): ng.IPromise<Array<IDispenseList>> => {
            let defer = this.q.defer();
            let allPages: IPageRequest = {
                page: 0,
                size: 32000
            };
            this.q.all<IDispense[], IFrequency[]>(
                [
                    this.getResource().getDispenseItemsByPersonId({ personId: personId }).$promise,
                    this.frequencyService.query(),
                ]).then((response) => {
                    let dispense = response[0];
                    let frequencies = response[1];
                    let result: Array<IDispenseList> = [];
                    dispense.forEach((med) => {
                        let entry: IDispenseList = {
                            id: med.id,
                            personMedicationId: med.personMedicationId,
                            date: med.date,
                            quantity: med.quantity
                        };
                        this.personMedicationService.get(med.personMedicationId).then((pmed) => {

                            this.drugNameService.get(pmed.drugNameId).then((response) => {
                                entry.drugName = response.name;
                            });
                        });



                        frequencies.forEach((frequency) => {
                            if (frequency.id === med.frequencyId) {
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

        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IDispense>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterPrescriptionList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterPrescriptionList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

    }

    app.factory("DispenseResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IDispenseResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/dispenses/:id");

            return <IDispenseResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },

                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/dispenses/history")
                }, "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/dispensed-medication")
                }, "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/dispensed-medication")
                },

                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getDispenseItemsByPersonId": {
                    url: mrs.config.Settings.serverResource("api/dispenses/person/:personId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getByPersonMedicationId": {
                    url: mrs.config.Settings.serverResource("api/person-medications/:personMedicationId/dispenses"),
                    method: "GET", isArray: false,
                    /* transformResponse: function (data) {
                         if (data) {
                             data = angular.fromJson(data);
                             data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                         }
                         return data;
                     }*/
                }, "getByPersonIdAndDate": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/dispenses/:date"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;

                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;

                    }
                }
            });

        }]);

    app.service("DispenseService", DispenseService);

}