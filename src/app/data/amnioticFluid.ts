namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAmnioticFluid extends IAggregateRoot<string> {
        name: string;
    }

    export interface IAmnioticFluidService extends data.IAggregateRootService<IAmnioticFluid, string> {
        query: (text?: string) => ng.IPromise<Array<IAmnioticFluid>>;
    }

    interface IAmnioticFluidResource extends IResourceService<IAmnioticFluid> {

    }

    class AmnioticFluidService extends EntityService<IAmnioticFluid, string, IAmnioticFluidResource> implements IAmnioticFluidService {

        static $inject = ["AmnioticFluidResource"];
        constructor(private resource: IAmnioticFluidResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IAmnioticFluid>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("AmnioticFluidResource", ["$resource",
        ($resource: ng.resource.IResourceService): IAmnioticFluidResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/amniotic-fluids/:id");

            return <IAmnioticFluidResource>$resource(resourceUrl, {}, {
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

    app.service("AmnioticFluidService", AmnioticFluidService);

}