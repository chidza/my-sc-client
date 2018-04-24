namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMedicalProcedure extends IAggregateRoot<string> {
        code: string;
        name: string;
        standardId: string;
    }

    export interface IMedicalProcedureService extends data.IAggregateRootService<IMedicalProcedure, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IMedicalProcedure>>;
    }

    interface IMedicalProcedureResource extends IResourceService<IMedicalProcedure> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IMedicalProcedure>>;
    }

    class MedicalProcedureService extends EntityService<IMedicalProcedure, string, IMedicalProcedureResource> implements IMedicalProcedureService {

        static $inject = ["MedicalProcedureResource", "$http"];
        constructor(private resource: IMedicalProcedureResource,
            private http: ng.IHttpService) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IMedicalProcedure>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("MedicalProcedureResource", ["$resource",
        ($resource: ng.resource.IResourceService): IMedicalProcedureResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/medical-procedures/:id");

            return <IMedicalProcedureResource>$resource(resourceUrl, {}, {
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

    app.service("MedicalProcedureService", MedicalProcedureService);

}