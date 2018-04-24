namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDiagnosis extends IAggregateRoot<string> {
        code: string;
        name: string;
        standardId: string;
    }

    export interface IDiagnosisService extends data.IAggregateRootService<IDiagnosis, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IDiagnosis>>;
    }

    interface IDiagnosisResource extends IResourceService<IDiagnosis> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IDiagnosis>>;
    }

    class DiagnosisService extends EntityService<IDiagnosis, string, IDiagnosisResource> implements IDiagnosisService {

        static $inject = ["DiagnosisResource", "$http"];
        constructor(private resource: IDiagnosisResource,
            private http: ng.IHttpService) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IDiagnosis>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("DiagnosisResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDiagnosisResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/diagnoses/:id");

            return <IDiagnosisResource>$resource(resourceUrl, {}, {
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

    app.service("DiagnosisService", DiagnosisService);

}