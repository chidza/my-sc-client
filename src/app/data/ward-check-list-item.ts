namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IWardCheckListItem extends IAggregateRoot<string> {
        value: string;
        wardCheckListId: string;
        admissionWardCheckListId: string;
    }

    export interface IWardCheckListItemService extends data.IAggregateRootService<IWardCheckListItem, string> {
        getByCheckList: (wardCheckListId: string) => ng.IPromise<Array<IWardCheckListItem>>;

    }

    interface IWardCheckListItemResource extends IResourceService<IWardCheckListItem> {
        getByCheckList: ng.resource.IResourceArrayMethod<IWardCheckListItem>;

    }

    class WardCheckListItemService extends EntityService<IWardCheckListItem, string, IWardCheckListItemResource> implements IWardCheckListItemService {

        static $inject = ["WardCheckListItemResource"];
        constructor(private resource: IWardCheckListItemResource,
        ) {
            super(resource);
        }

        getByCheckList = (wardCheckListId: string): ng.IPromise<Array<IWardCheckListItem>> => {
            return this.getResource().getByCheckList({ wardCheckListId: wardCheckListId }).$promise;
        }



    }

    app.factory("WardCheckListItemResource", ["$resource",
        ($resource: ng.resource.IResourceService): IWardCheckListItemResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/ward-check-list-items/:id");

            return <IWardCheckListItemResource>$resource(resourceUrl, {}, {
                "getByCheckList": {
                    url: mrs.config.Settings.serverResource("api/ward-check-Lists/:wardCheckListId/ward-check-list-items"),
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

    app.service("WardCheckListItemService", WardCheckListItemService);

}