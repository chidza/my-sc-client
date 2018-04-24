namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IIptReason extends IAggregateRoot<string> {
        name: String;
    }

    export interface IIptReasonService extends data.IAggregateRootService<IIptReason, string> {
        query: (text?: string) => ng.IPromise<Array<IIptReason>>;
    }

    interface IIptReasonResource extends IResourceService<IIptReason> {

    }

    class IptReasonService extends EntityService<IIptReason, string, IIptReasonResource> implements IIptReasonService {

        static $inject = ["IptReasonResource"];
        constructor(private resource: IIptReasonResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IIptReason>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("IptReasonResource", ["$resource",
        ($resource: ng.resource.IResourceService): IIptReasonResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ipt-reasons/:id");

            return <IIptReasonResource>$resource(resourceUrl, {}, {
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
                "update": { method: "PUT" }
            });

        }]);

    app.service("IptReasonService", IptReasonService);

}