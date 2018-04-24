namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArvCombinationRegimen extends IAggregateRoot<string> {
        code: string;
        drugId: string;
        name: string;
    }

    export interface IArvCombinationRegimenService extends data.IAggregateRootService<IArvCombinationRegimen, string> {
        query: (text?: string) => ng.IPromise<Array<IArvCombinationRegimen>>;
    }

    interface IArvCombinationRegimenResource extends IResourceService<IArvCombinationRegimen> {

    }

    class ArvCombinationRegimenService extends EntityService<IArvCombinationRegimen, string, IArvCombinationRegimenResource> implements IArvCombinationRegimenService {

        static $inject = ["ArvCombinationRegimenResource"];
        constructor(private resource: IArvCombinationRegimenResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IArvCombinationRegimen>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("ArvCombinationRegimenResource", ["$resource",
        ($resource: ng.resource.IResourceService): IArvCombinationRegimenResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/arv-combination-regimen/:id");

            return <IArvCombinationRegimenResource>$resource(resourceUrl, {}, {
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

    app.service("ArvCombinationRegimenService", ArvCombinationRegimenService);

}