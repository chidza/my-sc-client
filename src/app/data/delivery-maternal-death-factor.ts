namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMaternalDeathHistory extends IAggregateRoot<string> {
        maternalDeathId: string;
        maternalDeathFactorId: string;
        state: string;
    }

    export interface IMaternalDeathHistoryService extends data.IAggregateRootService<IMaternalDeathHistory, string> {
        getByMaternalDeathId: (maternalDeathId: string) => ng.IPromise<Array<IMaternalDeathHistory>>;
        add: (maternalDeathId: string, questionId: string) => ng.IPromise<IMaternalDeathHistory>;
        removeQuestion: (maternalDeathId: string, questionId: string) => ng.IPromise<IMaternalDeathHistory>;
    }

    interface IMaternalDeathHistoryResource extends IResourceService<IMaternalDeathHistory> {
        getByMaternalDeathId: ng.resource.IResourceMethod<Array<IMaternalDeathHistory>>;
    }

    class MaternalDeathHistoryService extends EntityService<IMaternalDeathHistory, string, IMaternalDeathHistoryResource> implements IMaternalDeathHistoryService {

        static $inject = ["MaternalDeathHistoryResource", "$q"];
        constructor(private resource: IMaternalDeathHistoryResource,
            private q: ng.IQService) {
            super(resource);
        }

        getByMaternalDeathId = (maternalDeathId: string): ng.IPromise<Array<IMaternalDeathHistory>> => {
            return this.getResource().getByMaternalDeathId({ maternalDeathId: maternalDeathId }).$promise;
        }

        add = (maternalDeathId: string, questionId: string): ng.IPromise<IMaternalDeathHistory> => {
            return this.getResource().save({
                maternalDeathId: maternalDeathId,
                maternalDeathFactorId: questionId,
                state: "YES"
            }).$promise;
        }

        removeQuestion = (maternalDeathId: string, questionId: string): ng.IPromise<IMaternalDeathHistory> => {
            let d = this.q.defer();

            this.getByMaternalDeathId(maternalDeathId).then((response) => {

                response.forEach((survey) => {
                    if (survey.maternalDeathFactorId === questionId) {

                        this.remove(survey.id);

                        d.resolve(survey);
                    }
                });

            }, (e) => {
                d.reject(e);
            });


            return d.promise;
        }
    }

    app.factory("MaternalDeathHistoryResource", ["$resource",
        ($resource: ng.resource.IResourceService): IMaternalDeathHistoryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/delivery-maternal-death-factors/:id");

            return <IMaternalDeathHistoryResource>$resource(resourceUrl, {}, {
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
                ,
                "getByMaternalDeathId": {

                    url: mrs.config.Settings.serverResource("api/delivery-maternal-death/:maternalDeathId/delivery-maternal-death-factors"),
                    method: "GET", isArray: true
                }
            });

        }]);

    app.service("MaternalDeathHistoryService", MaternalDeathHistoryService);

}