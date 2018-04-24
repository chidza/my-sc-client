namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITbVisit extends IAggregateRoot<string> {
        tbId: string;
        encounterId: string;
    }

    export interface ITbVisitService extends data.IAggregateRootService<ITbVisit, string> {
        tbSession: (opdId: string, queueId: string, tbId: string) => ng.IPromise<ITbVisit>;
    }

    interface ITbVisitResource extends IResourceService<ITbVisit> {
        tbSession: ng.resource.IResourceMethod<ITbVisit>;
    }

    class TbVisitService extends EntityService<ITbVisit, string, ITbVisitResource> implements ITbVisitService {

        static $inject = ["TbVisitResource"];
        constructor(private resource: ITbVisitResource) {
            super(resource);
        }

        tbSession = (opdId: string, queueId: string, tbId: string): ng.IPromise<ITbVisit> => {
            return this.getResource().tbSession({ opdId: opdId, queueId: queueId, tbId: tbId }).$promise;
        }

    }

    app.factory("TbVisitResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITbVisitResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/tb-visits/:id");

            return <ITbVisitResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "update": { method: "PUT" },
                "tbSession": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounters/:queueId/tb/:tbId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("TbVisitService", TbVisitService);

}