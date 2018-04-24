namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonArtFollowUpStatus extends IAggregateRoot<string> {
        date: string;
        artId: string;
        followUpStatusId: string;
    }

    export interface IPersonArtFollowUpStatusService extends data.IAggregateRootService<IPersonArtFollowUpStatus, string> {
        getCurrent: (artId: string) => ng.IPromise<IPersonArtFollowUpStatus>;
    }

    interface IPersonArtFollowUpStatusResource extends IResourceService<IPersonArtFollowUpStatus> {
        getCurrent: ng.resource.IResourceMethod<IPersonArtFollowUpStatus>;
    }

    class PersonArtFollowUpStatusService extends EntityService<IPersonArtFollowUpStatus, string, IPersonArtFollowUpStatusResource> implements IPersonArtFollowUpStatusService {

        static $inject = ["PersonArtFollowUpStatusResource"];
        constructor(private resource: IPersonArtFollowUpStatusResource) {
            super(resource);
        }

        getCurrent = (artId: string): ng.IPromise<IPersonArtFollowUpStatus> => {

            return this.getResource().getCurrent({ artId: artId }).$promise;
        }

    }

    app.factory("PersonArtFollowUpStatusResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonArtFollowUpStatusResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-art-follow-up-statuses/:id");

            return <IPersonArtFollowUpStatusResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getCurrent": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-follow-up-statuses/getCurrent/:artId")
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.birthdate = dateUtils.convertLocalDateFromServer(data.birthdate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = dateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("PersonArtFollowUpStatusService", PersonArtFollowUpStatusService);

}