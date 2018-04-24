namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILevelOfPresentingPart extends IAggregateRoot<string> {
        name: String;
    }

    export interface ILevelOfPresentingPartService extends data.IAggregateRootService<ILevelOfPresentingPart, string> {
        query: (text?: string) => ng.IPromise<Array<ILevelOfPresentingPart>>;
    }

    interface ILevelOfPresentingPartResource extends IResourceService<ILevelOfPresentingPart> {

    }

    class LevelOfPresentingPartService extends EntityService<ILevelOfPresentingPart, string, ILevelOfPresentingPartResource> implements ILevelOfPresentingPartService {

        static $inject = ["LevelOfPresentingPartResource"];
        constructor(private resource: ILevelOfPresentingPartResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ILevelOfPresentingPart>> => {
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("LevelOfPresentingPartResource", ["$resource",
        ($resource: ng.resource.IResourceService): ILevelOfPresentingPartResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/level-of-presenting-parts/:id");

            return <ILevelOfPresentingPartResource>$resource(resourceUrl, {}, {
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

    app.service("LevelOfPresentingPartService", LevelOfPresentingPartService);

}