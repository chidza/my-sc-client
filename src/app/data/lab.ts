namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILab extends IAggregateRoot<string> {
        code: string;
        location: string;
        name: string;
        standardId: string;
    }

    export interface ILabService extends data.IAggregateRootService<ILab, string> {
        query: (text?: string) => ng.IPromise<Array<ILab>>;
    }

    interface ILabResource extends IResourceService<ILab> {

    }

    class LabService extends EntityService<ILab, string, ILabResource> implements ILabService {

        static $inject = ["LabResource"];
        constructor(private resource: ILabResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ILab>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("LabResource", ["$resource",
        ($resource: ng.resource.IResourceService): ILabResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/laboratories/:id");

            return <ILabResource>$resource(resourceUrl, {}, {
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

    app.service("LabService", LabService);

}