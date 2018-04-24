namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonArtFunctionalStatus extends IAggregateRoot<string> {
        date: string;
        functionalStatusId: string;
        artId: string;
    }

    export interface IPersonArtFunctionalStatusService extends data.IAggregateRootService<IPersonArtFunctionalStatus, string> {
        getCurrent: (artId: string) => ng.IPromise<IPersonArtFunctionalStatus>;
    }

    interface IPersonArtFunctionalStatusResource extends IResourceService<IPersonArtFunctionalStatus> {
        getCurrent: ng.resource.IResourceMethod<IPersonArtFunctionalStatus>;
    }

    class PersonArtFunctionalStatusService extends EntityService<IPersonArtFunctionalStatus, string, IPersonArtFunctionalStatusResource> implements IPersonArtFunctionalStatusService {

        static $inject = ["PersonArtFunctionalStatusResource"];
        constructor(private resource: IPersonArtFunctionalStatusResource) {
            super(resource);
        }

        getCurrent = (artId: string): ng.IPromise<IPersonArtFunctionalStatus> => {
            return this.getResource().getCurrent({ artId: artId }).$promise;
        }

    }

    app.factory("PersonArtFunctionalStatusResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonArtFunctionalStatusResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-art-functional-statuses/:id");

            return <IPersonArtFunctionalStatusResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getCurrent": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-functional-statuses/getCurrent/:artId")
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

    app.service("PersonArtFunctionalStatusService", PersonArtFunctionalStatusService);

}