namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterProcedure extends IAggregateRoot<string> {
        encounterId: string;
        personProcedureId: string;
    }

    export interface IEncounterProcedureList extends IEntity {
        date: string;
        note?: any;
        name: string;
        encounterProcedureId: string;
        personProcedureId: string;
        encounterId: string;
    }

    export interface IEncounterProcedureService extends data.IAggregateRootService<IEncounterProcedure, string> {
        saveEncounterProcedure(encounterId: string, entity: IPersonProcedure): ng.IPromise<IEncounterProcedure>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterProcedureList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterProcedureList>>;
    }

    interface IEncounterProcedureResource extends IResourceService<IEncounterProcedure> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterProcedure>>;
        fetchByPersonProcedureEncounterId: ng.resource.IResourceMethod<Array<IPersonProcedure>>;
        fetchProceduresByEncounterId: ng.resource.IResourceMethod<Array<IMedicalProcedure>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterProcedureList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterProcedureList>>;

    }

    class EncounterProcedureService extends EntityService<IEncounterProcedure, string, IEncounterProcedureResource> implements IEncounterProcedureService {

        static $inject = ["EncounterProcedureResource", "$q"];
        constructor(private resource: IEncounterProcedureResource,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterProcedure = (encounterId: string, entity: IPersonProcedure): ng.IPromise<IEncounterProcedure> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterProcedureList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterProcedureList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }


    }

    app.factory("EncounterProcedureResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterProcedureResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-procedures/:id");

            return <IEncounterProcedureResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    url: mrs.config.Settings.serverResource("api/encounter-procedures/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounter-procedures"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }, "getForAdmission": {
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounter-procedures"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },

                "fetchByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-procedures/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonProcedureEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-procedures/getPersonProceduresByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchProceduresByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-procedures/getByProceduresEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
            });

        }]);

    app.service("EncounterProcedureService", EncounterProcedureService);

}