namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IExamination extends IAggregateRoot<string> {
        name: String;
    }

    export interface IExaminationService extends data.IAggregateRootService<IExamination, string> {

        query(text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IExamination>>;
    }

    interface IExaminationResource extends IResourceService<IExamination> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IExamination>>;
    }

    class ExaminationService extends EntityService<IExamination, string, IExaminationResource> implements IExaminationService {

        static $inject = ["ExaminationResource"];
        constructor(private resource: IExaminationResource) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IExamination>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("ExaminationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/examinations/:id");

            return <IExaminationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "fetch": { method: "GET", isArray: false },
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

    app.service("ExaminationService", ExaminationService);

}