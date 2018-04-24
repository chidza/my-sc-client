namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IClassName extends IAggregateRoot<string> {
        name: string;
        wardId: string;
    }



    interface IClassNameResource extends IResourceService<IClassName> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IClassName>>;
    }

    class ClassNameService extends EntityService<IClassName, string, IClassNameResource>  {

        static $inject = ["ClassNameResource", "$http"];
        constructor(private resource: IClassNameResource,
            private http: ng.IHttpService) {
            super(resource);
        }



    }

    app.factory("ClassNameService", ["$resource",
        ($resource: ng.resource.IResourceService): IClassNameResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ward-check-lists/:id");

            return <IClassNameResource>$resource(resourceUrl, {}, {
                "query": {
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }

                },
                "fetch": {
                    method: "GET", isArray: false
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

    app.service("ClassNameService", ClassNameService);

}