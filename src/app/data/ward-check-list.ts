namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IWardCheckList extends IAggregateRoot<string> {
        name: string;
        wardId: string;
    }

    export interface IWardCheckListService extends data.IAggregateRootService<IWardCheckList, string> {
        getByWard: (wardId: string) => ng.IPromise<Array<IWardCheckList>>;
        query: (text?: string) => ng.IPromise<Array<IWardCheckList>>;
    }

    interface IWardCheckListResource extends IResourceService<IWardCheckList> {
        getByWard: ng.resource.IResourceArrayMethod<IWardCheckList>;
        query: ng.resource.IResourceArrayMethod<IWardCheckList>;
    }

    class WardCheckListService extends EntityService<IWardCheckList, string, IWardCheckListResource> implements IWardCheckListService {

        static $inject = ["WardCheckListResource"];
        constructor(private resource: IWardCheckListResource,
        ) {
            super(resource);
        }

        getByWard = (wardId: string): ng.IPromise<Array<IWardCheckList>> => {
            return this.getResource().getByWard({ wardId: wardId }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<IWardCheckList>> => {
            return this.getResource().query({ text: text }).$promise;
        }

    }

    app.factory("WardCheckListResource", ["$resource",
        ($resource: ng.resource.IResourceService): IWardCheckListResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ward-check-lists/:id");

            return <IWardCheckListResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByWard": {
                    url: mrs.config.Settings.serverResource("api/wards/:wardId/ward-check-lists"),
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

    app.service("WardCheckListService", WardCheckListService);

}