namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonArtWhoStage extends IAggregateRoot<string> {
        date: string;
        artId: string;
        stage: string;
    }

    export interface IPersonArtWhoStageService extends data.IAggregateRootService<IPersonArtWhoStage, string> {
        getCurrent: (artId: string) => ng.IPromise<IPersonArtWhoStage>;
    }

    interface IPersonArtWhoStageResource extends IResourceService<IPersonArtWhoStage> {
        getCurrent: ng.resource.IResourceMethod<IPersonArtWhoStage>;
    }

    class PersonArtWhoStageService extends EntityService<IPersonArtWhoStage, string, IPersonArtWhoStageResource> implements IPersonArtWhoStageService {

        static $inject = ["PersonArtWhoStageResource"];
        constructor(private resource: IPersonArtWhoStageResource) {
            super(resource);
        }

        getCurrent = (artId: string): ng.IPromise<IPersonArtWhoStage> => {
            return this.getResource().getCurrent({ artId: artId }).$promise;
        }

    }

    app.factory("PersonArtWhoStageResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonArtWhoStageResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-art-who-stages/:id");

            return <IPersonArtWhoStageResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getCurrent": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-who-stages/getCurrent/:artId")
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

    app.service("PersonArtWhoStageService", PersonArtWhoStageService);

}