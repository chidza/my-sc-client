namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEducationLevel extends IAggregateRoot<string> {
        name: string;
    }

    export interface IEducationLevelService extends data.IAggregateRootService<IEducationLevel, string> {
        query: (text?: string) => ng.IPromise<Array<IEducationLevel>>;
    }

    interface IEducationLevelResource extends IResourceService<IEducationLevel> {

    }

    class EducationLevelService extends EntityService<IEducationLevel, string, IEducationLevelResource> implements IEducationLevelService {

        static $inject = ["EducationLevelResource"];
        constructor(private resource: IEducationLevelResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IEducationLevel>> => {
            return this.getResource().query({ text: text }).$promise;
        }

    }

    app.factory("EducationLevelResource", ["$resource",
        ($resource: ng.resource.IResourceService): IEducationLevelResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/education-levels/:id");

            return <IEducationLevelResource>$resource(resourceUrl, {}, {
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

    app.service("EducationLevelService", EducationLevelService);

}