namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IIptStatus extends IAggregateRoot<string> {
        name: String;
    }

    export interface IIptStatusService extends data.IAggregateRootService<IIptStatus, string> {
        query: (text?: string) => ng.IPromise<Array<IIptStatus>>;
    }

    interface IIptStatusResource extends IResourceService<IIptStatus> {

    }

    class IptStatusService extends EntityService<IIptStatus, string, IIptStatusResource> implements IIptStatusService {

        static $inject = ["IptStatusResource"];
        constructor(private resource: IIptStatusResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IIptStatus>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("IptStatusResource", ["$resource",
        ($resource: ng.resource.IResourceService): IIptStatusResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ipt-statuses/:id");

            return <IIptStatusResource>$resource(resourceUrl, {}, {
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

    app.service("IptStatusService", IptStatusService);

}