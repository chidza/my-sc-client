namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncVisit extends IAggregateRoot<string> {
        date: Date;
        encounterId: string;
        pncId: string;
        pncVisitTypeId: string;
    }

    export interface IPncVisitService extends data.IAggregateRootService<IPncVisit, string> {
        childVisit: (opdId: string, queueId: string, pncId: string) => ng.IPromise<IPncVisit>;
        opdSession: (opdId: string, queueId: string, pncId: string) => ng.IPromise<IPncVisit>;
        wardSession: (admissionId: string, pncId: string) => ng.IPromise<IPncVisit>;
    }

    interface IPncVisitResource extends IResourceService<IPncVisit> {
        childVisit: ng.resource.IResourceMethod<IPncVisit>;
        opdSession: ng.resource.IResourceMethod<IPncVisit>;
        wardSession: ng.resource.IResourceMethod<IPncVisit>;
    }

    class PncVisitService extends EntityService<IPncVisit, string, IPncVisitResource> implements IPncVisitService {

        static $inject = ["PncVisitResource"];
        constructor(private resource: IPncVisitResource) {
            super(resource);
        }

        opdSession = (opdId: string, queueId: string, pncId: string): ng.IPromise<IPncVisit> => {
            return this.getResource().opdSession({ opdId: opdId, queueId: queueId, pncId: pncId }).$promise;
        }

        childVisit = (opdId: string, queueId: string, pncId: string): ng.IPromise<IPncVisit> => {
            return this.getResource().childVisit({ opdId: opdId, queueId: queueId, pncId: pncId }).$promise;
        }

        wardSession = (admissionId: string, pncId: string): ng.IPromise<IPncVisit> => {
            return this.getResource().wardSession({ admissionId: admissionId, pncId: pncId }).$promise;
        }
    }

    app.factory("PncVisitResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IPncVisitResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pnc-visits/:id");

            return <IPncVisitResource>$resource(resourceUrl, {}, {
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
                }, "opdSession": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/:queueId/pnc/:pncId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "childVisit": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/:queueId/pnc/:pncId/child-visit"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "wardSession": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/pnc/:pncId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
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
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("PncVisitService", PncVisitService);

}