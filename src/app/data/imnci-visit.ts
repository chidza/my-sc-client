namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IImnciVisit extends IAggregateRoot<string> {
        date: Date;
        encounterId: string;
    }

    export interface IImnciVisitService extends data.IAggregateRootService<IImnciVisit, string> {
        getByEncounterId(encounterId: string): ng.IPromise<IImnciVisit>;
    }

    interface IImnciVisitResource extends IResourceService<IImnciVisit> {
        getByEncounterId: ng.resource.IResourceMethod<IImnciVisit>;
    }

    class ImnciVisitService extends EntityService<IImnciVisit, string, IImnciVisitResource> implements IImnciVisitService {
        getByEncounterId(encounterId: string): ng.IPromise<IImnciVisit> {
            return this.getResource().getByEncounterId({ encounterId: encounterId }).$promise;
        }

        static $inject = ["ImnciVisitResource"];
        constructor(private resource: IImnciVisitResource) {
            super(resource);
        }

    }

    app.factory("ImnciVisitResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IImnciVisitResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-visits/:id");

            return <IImnciVisitResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByEncounterId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/encounters/:encounterId/imnci-visits")
                },
                "get": {
                    method: "GET",
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
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ImnciVisitService", ImnciVisitService);

}