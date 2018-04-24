namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterInvestigation extends IAggregateRoot<string> {
        encounterId: string;
        personInvestigationId: string;
    }

    export interface IEncounterInvestigationList extends IEntity {
        encounterInvestigationId: string;
        date?: string;
        sampleName?: string;
        testName?: string;
        result: string;
        encounterId: string;
        personInvestigationId: string;

    }

    export interface IEncounterInvestigationService extends data.IAggregateRootService<IEncounterInvestigation, string> {
        saveEncounterInvestigation(encounterId: string, entity: IPersonInvestigation): ng.IPromise<IEncounterInvestigation>;
        getByPersonInvestigationId(personInvestigationId: string): ng.IPromise<IEncounterInvestigation>;
        saveMultipleEncounterInvestigations(encounterId: string, list: Array<IPersonInvestigation>): ng.IPromise<Array<IEncounterInvestigation>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterInvestigationList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterInvestigationList>>;


    }

    interface IEncounterInvestigationResource extends IResourceService<IEncounterInvestigation> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterInvestigation>>;
        fetchByPersonInvestigationId: ng.resource.IResourceMethod<IEncounterInvestigation>;
        fetchByPersonInvestigationEncounterId: ng.resource.IResourceMethod<Array<IPersonInvestigation>>;
        fetchInvestigationsByEncounterId: ng.resource.IResourceMethod<Array<IInvestigation>>;
        saveMultipleEncounterInvestigations: ng.resource.IResourceMethod<Array<IEncounterInvestigation>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterInvestigationList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterInvestigationList>>;
    }

    class EncounterInvestigationService extends EntityService<IEncounterInvestigation, string, IEncounterInvestigationResource> implements IEncounterInvestigationService {

        static $inject = ["EncounterInvestigationResource", "SampleService", "LabTestService", "$q"];

        constructor(private resource: IEncounterInvestigationResource,
            private sampleService: ISampleService,
            private labTestService: ILabTestService,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterInvestigation = (encounterId: string, entity: IPersonInvestigation): ng.IPromise<IEncounterInvestigation> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        saveMultipleEncounterInvestigations = (encounterId: string, list: Array<IPersonInvestigation>): ng.IPromise<Array<IEncounterInvestigation>> => {
            return this.getResource().saveMultipleEncounterInvestigations({ encounterId: encounterId }, list).$promise;
        }

        getByPersonInvestigationId = (personInvestigationId: string): ng.IPromise<IEncounterInvestigation> => {
            return this.getResource().fetchByPersonInvestigationId({ personInvestigationId: personInvestigationId }).$promise;
        }
        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterInvestigationList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterInvestigationList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

    }

    app.factory("EncounterInvestigationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterInvestigationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-investigations/:id");

            return <IEncounterInvestigationResource>$resource(resourceUrl, {}, {
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
                    }
                },
                "save": {
                    url: mrs.config.Settings.serverResource("api/encounter-investigation/:encounterId"),
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
                "saveMultipleEncounterInvestigations": {
                    url: mrs.config.Settings.serverResource("api/encounter-investigation/:encounterId/multiple"),
                    method: "POST", isArray: true,
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.forEach(function (c: any) {
                            c.date = dateUtils.convertLocalDateTimeToServer(data.date);
                        });
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
                    url: mrs.config.Settings.serverResource("/api/encounter-investigations/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonInvestigationEncounterId": {
                    url: mrs.config.Settings.serverResource("/api/encounter-investigations/getPersonInvestigationsByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchInvestigationsByEncounterId": {
                    url: mrs.config.Settings.serverResource("/api/encounter-investigations/getByInvestigationsEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounter-investigations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }, "getForAdmission": {
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounter-investigations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("EncounterInvestigationService", EncounterInvestigationService);

}