namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFeedingOption extends IAggregateRoot<string> {

        name: string;

    }

    export interface IFeedingOptionService extends data.IAggregateRootService<IFeedingOption, string> {
        query: (text?: string) => ng.IPromise<Array<IFeedingOption>>;
    }

    interface IFeedingOptionResource extends IResourceService<IFeedingOption> {

    }

    class FeedingOptionService extends EntityService<IFeedingOption, string, IFeedingOptionResource> implements IFeedingOptionService {

        static $inject = ["FeedingOptionResource"];
        constructor(private resource: IFeedingOptionResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IFeedingOption>> => {
            return this.getResource().query({ text: text }).$promise;
        }

    }

    app.factory("FeedingOptionResource", ["$resource",
        ($resource: ng.resource.IResourceService): IFeedingOptionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/feeding-options/:id");

            return <IFeedingOptionResource>$resource(resourceUrl, {}, {
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

    app.service("FeedingOptionService", FeedingOptionService);

}