namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IOccupation extends IAggregateRoot<string> {

        name: string;
    }

    export interface IOccupationService extends data.IAggregateRootService<IOccupation, string> {
        query: (text?: string) => ng.IPromise<Array<IOccupation>>;
    }

    interface IOccupationResource extends IResourceService<IOccupation> {

    }

    class OccupationService extends EntityService<IOccupation, string, IOccupationResource> implements IOccupationService {

        static $inject = ["OccupationResource"];
        constructor(private resource: IOccupationResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IOccupation>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("OccupationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IOccupationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/occupations/:id");

            return <IOccupationResource>$resource(resourceUrl, {}, {
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

    app.service("OccupationService", OccupationService);

}