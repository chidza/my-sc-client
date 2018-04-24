namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterHealthEducation extends IAggregateRoot<string> {
        encounterId: string;
        personHealthEducationId: string;
    }

    /*  export interface IEncounterHealthEducationListArray {
         id: string;
         date?: Date;
         topicName?: string;
         type?: string;
         note?: string;
         createdBy?: string;
     } */

    export interface IEncounterHealthEducationList extends IEntity {
        date: Date;
        topicName: string;
        type: string;
        note: string;
        encounterPersonHealthEducationId: string;
        personHealthEducationId: string;
        encounterId: string;
    }

    export interface IEncounterHealthEducationService extends data.IAggregateRootService<IEncounterHealthEducation, string> {
        saveEncounterHealthEducation(encounterId: string, entity: IPersonHealthEducation): ng.IPromise<IEncounterHealthEducation>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterHealthEducationList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterHealthEducationList>>;
    }

    interface IEncounterHealthEducationResource extends IResourceService<IEncounterHealthEducation> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterHealthEducation>>;
        fetchByPersonHealthEducationEncounterId: ng.resource.IResourceMethod<Array<IPersonHealthEducation>>;
        fetchHealthEducationTopicsByEncounterId: ng.resource.IResourceMethod<Array<IHealthEducationTopic>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterHealthEducationList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterHealthEducationList>>;
    }

    class EncounterHealthEducationService extends EntityService<IEncounterHealthEducation, string, IEncounterHealthEducationResource> implements IEncounterHealthEducationService {

        static $inject = ["EncounterHealthEducationResource", "$q"];
        constructor(private resource: IEncounterHealthEducationResource,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterHealthEducation = (encounterId: string, entity: IPersonHealthEducation): ng.IPromise<IEncounterHealthEducation> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterHealthEducationList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterHealthEducationList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }
    }

    app.factory("EncounterHealthEducationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterHealthEducationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-health-education/:id");

            return <IEncounterHealthEducationResource>$resource(resourceUrl, {}, {
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
                    url: mrs.config.Settings.serverResource("api/encounter-health-education/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounter-health-education-topics"),
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
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounter-health-education-topics"),
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
                    url: mrs.config.Settings.serverResource("api/encounters/:encounterId/encounter-health-education-topics"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonHealthEducationEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounters/:encounterId/person-health-educations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchHealthEducationTopicsByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounters/:encounterId/health-education-topics"),
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

    app.service("EncounterHealthEducationService", EncounterHealthEducationService);

}