namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncChild extends IAggregateRoot<string> {
        pncId: string;
        personId: string;
    }

    export interface IPncChildService extends data.IAggregateRootService<IPncChild, string> {
        getByPncId: (pncId: string) => ng.IPromise<Array<IPerson>>;
    }

    interface IPncChildResource extends IResourceService<IPncChild> {
        getByPncId: ng.resource.IResourceMethod<Array<IPerson>>;
    }

    class PncChildService extends EntityService<IPncChild, string, IPncChildResource> implements IPncChildService {

        static $inject = ["PncChildResource"];
        constructor(private resource: IPncChildResource) {
            super(resource);
        }

        getByPncId = (pncId: string): ng.IPromise<Array<IPerson>> => {
            return this.getResource().getByPncId({ pncId: pncId }).$promise;
        }
    }

    app.factory("PncChildResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPncChildResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pnc-children/:id");

            return <IPncChildResource>$resource(resourceUrl, {}, {
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
                ,
                "getByPncId": {
                    url: mrs.config.Settings.serverResource("api/pnc-children/getByPncId/:pncId"),
                    method: "GET", isArray: true
                }
            });

        }]);

    app.service("PncChildService", PncChildService);

}