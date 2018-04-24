namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncVisitType extends IAggregateRoot<string> {
        leadDays: number;
        name: string;
    }

    export interface IPncVisitTypeService extends data.IAggregateRootService<IPncVisitType, string> {
        query: (text?: string) => ng.IPromise<Array<IPncVisitType>>;
    }

    interface IPncVisitTypeResource extends IResourceService<IPncVisitType> {

    }

    class PncVisitTypeService extends EntityService<IPncVisitType, string, IPncVisitTypeResource> implements IPncVisitTypeService {

        static $inject = ["PncVisitTypeResource"];
        constructor(private resource: IPncVisitTypeResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IEducationLevel>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("PncVisitTypeResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPncVisitTypeResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pnc-visit-types/:id");

            return <IPncVisitTypeResource>$resource(resourceUrl, {}, {
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

    app.service("PncVisitTypeService", PncVisitTypeService);

}