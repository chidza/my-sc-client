namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IResuscitationItem extends IAggregateRoot<string> {
        name: string;
    }

    export interface IResuscitationItemService extends data.IAggregateRootService<IResuscitationItem, string> {
        query: (text?: string) => ng.IPromise<Array<IResuscitationItem>>;
    }

    interface IResuscitationItemResource extends IResourceService<IResuscitationItem> {

    }

    class ResuscitationItemService extends EntityService<IResuscitationItem, string, IResuscitationItemResource> implements IResuscitationItemService {

        static $inject = ["ResuscitationItemResource"];
        constructor(private resource: IResuscitationItemResource,
            private q: ng.IQService,
            private departmentService: IDepartmentService) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IResuscitationItem>> => {
            return this.getResource().query({ text: text }).$promise;
        }


    }

    app.factory("ResuscitationItemResource", ["$resource",
        ($resource: ng.resource.IResourceService): IResuscitationItemResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/resuscitation-items/:id");

            return <IResuscitationItemResource>$resource(resourceUrl, {}, {
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

    app.service("ResuscitationItemService", ResuscitationItemService);

}