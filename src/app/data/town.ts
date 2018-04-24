namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ITown extends IAggregateRoot<string> {
        districtId: string;
        name: string;

    }

    export interface ITownService extends data.IAggregateRootService<ITown, string> {
        getByDistrict(districtId: string): ng.IPromise<Array<ITown>>;
        query: (text?: string) => ng.IPromise<Array<ITown>>;
    }

    interface ITownResource extends IResourceService<ITown> {
        getByDistrict: ng.resource.IResourceArrayMethod<ITown>;
    }

    class TownService extends EntityService<ITown, string, ITownResource> implements ITownService {

        static $inject = ["TownResource"];
        constructor(private resource: ITownResource) {
            super(resource);
        }

        getByDistrict = (districtId: string): ng.IPromise<Array<ITown>> => {
            return this.getResource().getByDistrict({ districtId: districtId }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<ITown>> => {
            return this.getResource().query({ text: text }).$promise;
        }

    }

    app.factory("TownResource", ["$resource",
        ($resource: ng.resource.IResourceService): ITownResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/towns/:id");

            return <ITownResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByDistrict": {
                    url: mrs.config.Settings.serverResource("api/districts/:districtId/towns"),
                    method: "GET", isArray: true
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
                "update": { method: "PUT" }
            });

        }]);

    app.service("TownService", TownService);

}