namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonArtIptStatus extends IAggregateRoot<string> {
        date: string;
        iptReasonId: string;
        artId: string;
        statusId: string;
    }

    export interface IPersonArtIptStatusService extends data.IAggregateRootService<IPersonArtIptStatus, string> {
        getCurrent: (artId: string) => ng.IPromise<IPersonArtIptStatus>;
    }

    interface IPersonArtIptStatusResource extends IResourceService<IPersonArtIptStatus> {
        getCurrent: ng.resource.IResourceMethod<IPersonArtIptStatus>;
    }

    class PersonArtIptStatusService extends EntityService<IPersonArtIptStatus, string, IPersonArtIptStatusResource> implements IPersonArtIptStatusService {

        static $inject = ["PersonArtIptStatusResource"];
        constructor(private resource: IPersonArtIptStatusResource) {
            super(resource);
        }

        getCurrent = (artId: string): ng.IPromise<IPersonArtIptStatus> => {
            return this.getResource().getCurrent({ artId: artId }).$promise;
        }

    }

    app.factory("PersonArtIptStatusResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonArtIptStatusResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-art-ipt-statuses/:id");

            return <IPersonArtIptStatusResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getCurrent": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-ipt-statuses/getCurrent/:artId")
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("PersonArtIptStatusService", PersonArtIptStatusService);

}