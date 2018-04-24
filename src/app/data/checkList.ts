namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ICheckList extends IAggregateRoot<string> {
        name: string;
        wardId: string;
    }



    interface ICheckListResource extends IResourceService<ICheckList> {
        fetch: ng.resource.IResourceMethod<IPageReponse<ICheckList>>;
    }

    class CheckListService extends EntityService<ICheckList, string, ICheckListResource>  {

        static $inject = ["CheckListResource", "$http"];
        constructor(private resource: ICheckListResource,
            private http: ng.IHttpService) {
            super(resource);
        }



    }

    app.factory("CheckListResource", ["$resource",
        ($resource: ng.resource.IResourceService): ICheckListResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ward-check-lists/:id");

            return <ICheckListResource>$resource(resourceUrl, {}, {
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

    app.service("CheckListService", CheckListService);

}