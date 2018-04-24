namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IZepi extends IAggregateRoot<string> {

    }

    export interface IZepiService extends data.IAggregateRootService<IZepi, string> {
        query: (text?: string) => ng.IPromise<Array<IZepi>>;
    }

    interface IZepiResource extends IResourceService<IZepi> {

    }

    class ZepiService extends EntityService<IZepi, string, IZepiResource> implements IZepiService {

        static $inject = ["ZepiResource"];
        constructor(private resource: IZepiResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IZepi>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("ZepiResource", ["$resource",
        ($resource: ng.resource.IResourceService): IZepiResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/zepis/:id");

            return <IZepiResource>$resource(resourceUrl, {}, {
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

    app.service("ZepiService", ZepiService);

}