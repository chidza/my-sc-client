namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IComplaint extends IAggregateRoot<string> {
        code: string;
        name: string;
        standardId: string;
    }

    export interface IComplaintService extends data.IAggregateRootService<IComplaint, string> {
        query: (text?: string, page?: IPageRequest) => ng.IPromise<IPageReponse<IComplaint>>;
    }

    interface IComplaintResource extends IResourceService<IComplaint> {
        fetch: ng.resource.IResourceMethod<IPageReponse<IComplaint>>;
    }

    class ComplaintService extends EntityService<IComplaint, string, IComplaintResource> implements IComplaintService {

        static $inject = ["ComplaintResource", "$http"];
        constructor(private resource: IComplaintResource,
            private http: ng.IHttpService) {
            super(resource);
        }

        query = (text?: string, page?: IPageRequest): ng.IPromise<IPageReponse<IComplaint>> => {
            if (angular.isUndefined(page)) {
                page = {
                    page: 0,
                    size: 32000
                };
            }
            return this.getResource().fetch({ text: text, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

    }

    app.factory("ComplaintResource", ["$resource",
        ($resource: ng.resource.IResourceService): IComplaintResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/complaints/:id");

            return <IComplaintResource>$resource(resourceUrl, {}, {
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

    app.service("ComplaintService", ComplaintService);

}