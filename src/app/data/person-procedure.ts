namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonProcedure extends IAggregateRoot<string> {
        date: Date;
        personId: string;
        procedureId: string;
        note: string;
    }

    export interface IScreeningStatus extends IAggregateRoot<string> {
        date: string;
        status: string;

    }

    export interface IPersonProcedureService extends data.IAggregateRootService<IPersonProcedure, string> {
        query(text?: string): ng.IPromise<Array<IPersonProcedure>>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterProcedureList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterProcedureList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterProcedureList>>;
        cervicalCancerScreening(personId: string): ng.IPromise<IScreeningStatus>;
        breastCancerScreening(personId: string): ng.IPromise<IScreeningStatus>;
    }

    interface IPersonProcedureResource extends IResourceService<IPersonProcedure> {
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IEncounterProcedureList>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterProcedureList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterProcedureList>;
        cervicalCancerScreening: ng.resource.IResourceMethod<IScreeningStatus>;
        breastCancerScreening: ng.resource.IResourceMethod<IScreeningStatus>;
    }

    class PersonProcedureService extends EntityService<IPersonProcedure, string, IPersonProcedureResource> implements IPersonProcedureService {

        static $inject = ["PersonProcedureResource"];
        constructor(private resource: IPersonProcedureResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPersonProcedure>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterProcedureList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterProcedureList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterProcedureList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }
        cervicalCancerScreening(personId: string): ng.IPromise<IScreeningStatus> {
            return this.getResource().cervicalCancerScreening({ personId: personId }).$promise;
        }
        breastCancerScreening(personId: string): ng.IPromise<IScreeningStatus> {
            return this.getResource().breastCancerScreening({ personId: personId }).$promise;
        }

    }



    app.factory("PersonProcedureResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IPersonProcedureResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-procedures/:id");

            return <IPersonProcedureResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
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
                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-procedures/history")
                },
                "cervicalCancerScreening": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-procedures/cervical-cancer-screening")
                },
                "breastCancerScreening": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-procedures/breast-cancer-screening")
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-procedures")
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-procedures")
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

    app.service("PersonProcedureService", PersonProcedureService);

}