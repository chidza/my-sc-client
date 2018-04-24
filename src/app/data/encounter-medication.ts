namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterMedication extends IAggregateRoot<string> {
        encounterId: string;
        personMedicationId: string;
    }

    export interface IEncounterMedicationList {
        id: string;
        date?: Date;
        medicationName?: string;
        drugOptionName: number;
    }

    export interface IEncounterMedicationService extends data.IAggregateRootService<IEncounterMedication, string> {
        saveEncounterMedication(encounterId: string, entity: IPersonMedication): ng.IPromise<IEncounterMedication>;
        getByEncounterId(encounterId: string): ng.IPromise<Array<IEncounterMedicationList>>;
    }

    interface IEncounterMedicationResource extends IResourceService<IEncounterMedication> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterMedication>>;
        fetchByPersonMedicationEncounterId: ng.resource.IResourceMethod<Array<IPersonMedication>>;
        fetchMedicationsByEncounterId: ng.resource.IResourceMethod<Array<IDrug>>;
    }

    class EncounterMedicationService extends EntityService<IEncounterMedication, string, IEncounterMedicationResource> implements IEncounterMedicationService {

        static $inject = ["EncounterMedicationResource", "$q"];
        constructor(private resource: IEncounterMedicationResource,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterMedication = (encounterId: string, entity: IPersonMedication): ng.IPromise<IEncounterMedication> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        getByEncounterId = (encounterId: string): ng.IPromise<Array<IEncounterMedicationList>> => {

            let defer = this.q.defer();



            this.q.all<IEncounterMedication[], IPersonMedication[], IDrug[]>(
                [this.getResource().fetchByEncounterId({ encounterId: encounterId }).$promise,
                this.getResource().fetchByPersonMedicationEncounterId({ encounterId: encounterId }).$promise,
                this.getResource().fetchMedicationsByEncounterId({ encounterId: encounterId }).$promise
                ]).then((response) => {

                    let ems = response[0];

                    let pms = response[1];

                    let ms = response[2];

                    let result: Array<IEncounterMedicationList> = [];

                    // code to builde Array
                    /*ems.forEach((encounterMedication) => {

                        let entry: IEncounterMedicationList = { id: encounterMedication.id };

                        pms.forEach((personMedication) => {
                            if (personMedication.id === encounterMedication.personMedicationId) {
                                entry.medicationName = personMedication.drugNameId;
                                entry.date = personMedication.date;


                                ms.forEach((medication) => {
                                    if (medication.id === personMedication.medicationId) {
                                        entry.medicationName = medication.name;
                                    }
                                });


                            }
                        });

                        result.push(entry);

                    });*/

                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });


            return defer.promise;
        }
    }

    app.factory("EncounterMedicationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterMedicationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-medications/:id");

            return <IEncounterMedicationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
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
                    url: mrs.config.Settings.serverResource("api/encounter-medications/:encounterId"),
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
                },
                "fetchByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-medications/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonMedicationEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-medications/getPersonMedicationsByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchMedicationsByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-medications/getByMedicationsEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
            });

        }]);

    app.service("EncounterMedicationService", EncounterMedicationService);

}