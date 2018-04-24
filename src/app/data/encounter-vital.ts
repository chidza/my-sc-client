namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterVital extends IAggregateRoot<string> {
        encounterId: string;
        personVitalId: string;
    }

    export interface IEncounterVitalList extends IEntity {
        date: Date;
        unit: string;
        name: string;
        encounterVitalId: string;
        personVitalId: string;
        value: string;

    }

    export interface IEncounterVitalService extends data.IAggregateRootService<IEncounterVital, string> {
        saveEncounterVital(encounterId: string, entity: IPersonVital): ng.IPromise<IEncounterVital>;
        getByPersonVitalId(personVitalId: string): ng.IPromise<IEncounterVital>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getForOpdAndVital(opdId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getForAdmissionAndVital(admissionId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>>
    }

    interface IEncounterVitalResource extends IResourceService<IEncounterVital> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterVital>>;
        fetchByPersonVitalId: ng.resource.IResourceMethod<IEncounterVital>;
        fetchByPersonVitalEncounterId: ng.resource.IResourceMethod<Array<IPersonVital>>;
        fetchVitalsByEncounterId: ng.resource.IResourceMethod<Array<IVital>>;
        fetchVitalUnitByByEncounterId: ng.resource.IResourceMethod<Array<IUnit>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterVitalList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterVitalList>>;

    }


    class EncounterVitalService extends EntityService<IEncounterVital, string, IEncounterVitalResource> implements IEncounterVitalService {

        static $inject = ["EncounterVitalResource", "VitalService", "$q"];
        constructor(private resource: IEncounterVitalResource,
            private vitalService: IVitalService,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterVital = (encounterId: string, entity: IPersonVital): ng.IPromise<IEncounterVital> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterVitalList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterVitalList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getByPersonVitalId = (personVitalId: string): ng.IPromise<IEncounterVital> => {
            return this.getResource().fetchByPersonVitalId({ personVitalId: personVitalId }).$promise;
        }

        getForOpdAndVital = (opdId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>> => {

            // sando for now
            let defer = this.q.defer();

            this.vitalService.get(vitalId).then((vital) => {

                this.getForOpd(opdId).then((response) => {
                    defer.resolve(response.filter(v => v.name === vital.name));
                }, () => {
                    defer.reject();
                })

            }, () => {
                defer.reject();
            })

            return defer.promise;

        }

        getForAdmissionAndVital = (admissionId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>> => {

            // sando for now
            let defer = this.q.defer();

            this.vitalService.get(vitalId).then((vital) => {

                this.getForAdmission(admissionId).then((response) => {
                    defer.resolve(response.filter(v => v.name === vital.name));
                }, () => {
                    defer.reject();
                })

            }, () => {
                defer.reject();
            })

            return defer.promise;

        }

    }

    app.factory("EncounterVitalResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterVitalResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-vitals/:id");

            return <IEncounterVitalResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true }, "get": {
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
                    url: mrs.config.Settings.serverResource("api/person-vitals/:encounterId"),
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    url: mrs.config.Settings.serverResource("api/encounter-vitals/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounter-vitals"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForAdmission": {
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounter-vitals"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },

                "fetchByPersonVitalId": {
                    url: mrs.config.Settings.serverResource("api/encounter-vitals/fetchByPersonVitalId/:personVitalId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-vitals/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonVitalEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-vitals/getPersonVitalsByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchVitalsByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-vitals/getByVitalsEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchVitalUnitByByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-vitals/getByUnitVitalsEncounterId/:encounterId"),
                    method: "GET", isArray: true,
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

    app.service("EncounterVitalService", EncounterVitalService);

}