namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonDiagnosis extends IAggregateRoot<string> {

        date: Date;
        definitive: boolean;
        diagnosisId: string;
        differential: boolean;
        finalDiagnosis: boolean;
        personId: string;
        working: boolean;


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

    export interface IPersonDiagnosisService extends data.IAggregateRootService<IPersonDiagnosis, string> {
        query(text?: string): ng.IPromise<Array<IPersonDiagnosis>>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterDiagnosisList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterDiagnosisList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterDiagnosisList>>;
    }

    interface IPersonDiagnosisResource extends IResourceService<IPersonDiagnosis> {
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IEncounterDiagnosisList>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterDiagnosisList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterDiagnosisList>;
    }

    class PersonDiagnosisService extends EntityService<IPersonDiagnosis, string, IPersonDiagnosisResource> implements IPersonDiagnosisService {

        static $inject = ["PersonDiagnosisResource"];
        constructor(private resource: IPersonDiagnosisResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPersonDiagnosis>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterDiagnosisList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterDiagnosisList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterDiagnosisList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

    }

    app.factory("PersonDiagnosisResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IPersonDiagnosisResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-diagnoses/:id");

            return <IPersonDiagnosisResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-diagnoses/history")
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-diagnoses")

                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-diagnoses")
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.expirationDate = dateUtils.convertLocalDateFromServer(data.expirationDate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.expirationDate = dateUtils.convertLocalDateToServer(copy.expirationDate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.expirationDate = dateUtils.convertLocalDateToServer(copy.expirationDate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("PersonDiagnosisService", PersonDiagnosisService);

}