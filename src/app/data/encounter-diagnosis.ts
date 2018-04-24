namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterDiagnosis extends IAggregateRoot<string> {
        encounterId: string;
        personDiagnosisId: string;
    }

    export interface IEncounterDiagnosisList extends IEntity {
        date: Date;
        definative: boolean;
        name: string;
        finalDiagnosis: boolean;
        working: boolean;
        encounterPersonDiagnosisId: string;
        personDiagnosisId: string;
        differential: boolean;
        diagnosisId: string;
    }

    export interface IEncounterDiagnosisService extends data.IAggregateRootService<IEncounterDiagnosis, string> {
        saveEncounterDiagnosis(encounterId: string, entity: IPersonDiagnosis): ng.IPromise<IEncounterDiagnosis>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterDiagnosisList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterDiagnosisList>>;
    }

    interface IEncounterDiagnosisResource extends IResourceService<IEncounterDiagnosis> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterDiagnosis>>;
        fetchByPersonDiagnosisEncounterId: ng.resource.IResourceMethod<Array<IPersonDiagnosis>>;
        fetchDiagnosissByEncounterId: ng.resource.IResourceMethod<Array<IDiagnosis>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterDiagnosisList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterDiagnosisList>>;
    }

    class EncounterDiagnosisService extends EntityService<IEncounterDiagnosis, string, IEncounterDiagnosisResource> implements IEncounterDiagnosisService {

        static $inject = ["EncounterDiagnosisResource", "$q"];
        constructor(private resource: IEncounterDiagnosisResource,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterDiagnosis = (encounterId: string, entity: IPersonDiagnosis): ng.IPromise<IEncounterDiagnosis> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterDiagnosisList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterDiagnosisList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }
    }

    app.factory("EncounterDiagnosisResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterDiagnosisResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-diagnosis/:id");

            return <IEncounterDiagnosisResource>$resource(resourceUrl, {}, {
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
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounter-diagnosis"),
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
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounter-diagnosis"),
                    method: "GET", isArray: true,
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
                    url: mrs.config.Settings.serverResource("api/encounter-diagnosis/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "fetchByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-diagnosis/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonDiagnosisEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-diagnosis/getPersonDiagnosisByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchDiagnosissByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-diagnosis/getByDiagnosisEncounterId/:encounterId"),
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

    app.service("EncounterDiagnosisService", EncounterDiagnosisService);

}