namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHealthEducationTopic extends IAggregateRoot<string> {
        name: string;
    }

    export interface IHealthEducationTopicService extends data.IAggregateRootService<IHealthEducationTopic, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IHealthEducationTopic>>;
    }

    interface IHealthEducationTopicResource extends IResourceService<IHealthEducationTopic> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IHealthEducationTopic>>;
    }

    class HealthEducationTopicService extends EntityService<IHealthEducationTopic, string, IHealthEducationTopicResource> implements IHealthEducationTopicService {

        static $inject = ["HealthEducationTopicResource", "$http"];
        constructor(private resource: IHealthEducationTopicResource,
            private http: ng.IHttpService) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IHealthEducationTopic>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("HealthEducationTopicResource", ["$resource",
        ($resource: ng.resource.IResourceService): IHealthEducationTopicResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/health-education-topics/:id");

            return <IHealthEducationTopicResource>$resource(resourceUrl, {}, {
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

    app.service("HealthEducationTopicService", HealthEducationTopicService);

}