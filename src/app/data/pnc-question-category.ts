namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncQuestionaireCategory extends IAggregateRoot<string> {


        name: string;
        position: number;
    }

    export interface IPncQuestionaireCategoryService extends data.IAggregateRootService<IPncQuestionaireCategory, string> {
        query: (text?: string) => ng.IPromise<Array<IPncQuestionaireCategory>>;
    }

    interface IPncQuestionaireCategoryResource extends IResourceService<IPncQuestionaireCategory> {

    }

    class PncQuestionaireCategoryService extends EntityService<IPncQuestionaireCategory, string, IPncQuestionaireCategoryResource> implements IPncQuestionaireCategoryService {

        static $inject = ["PncQuestionaireCategoryResource"];
        constructor(private resource: IPncQuestionaireCategoryResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPncQuestionaireCategory>> => {

            console.log("ndasvika");
            return this.getResource().query({ text: text }).$promise;
        }
    }

    app.factory("PncQuestionaireCategoryResource", ["$resource",
        ($resource: ng.resource.IResourceService): IPncQuestionaireCategoryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pnc-questionare-categories/:id");

            return <IPncQuestionaireCategoryResource>$resource(resourceUrl, {}, {
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

    app.service("PncQuestionaireCategoryService", PncQuestionaireCategoryService);

}