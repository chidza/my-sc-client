namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonArtRegimen extends IAggregateRoot<string> {
        arvCombinationRegimenId: string;
        date: string;
        artId: string;
    }

    export interface IPersonArtRegimenService extends data.IAggregateRootService<IPersonArtRegimen, string> {
        getCurrent: (artId: string) => ng.IPromise<IPersonArtRegimen>;
        getFirst: (artId: string) => ng.IPromise<IPersonArtRegimen>;
    }

    interface IPersonArtRegimenResource extends IResourceService<IPersonArtRegimen> {
        getCurrent: ng.resource.IResourceMethod<IPersonArtRegimen>;
        getFirst: ng.resource.IResourceMethod<IPersonArtRegimen>;
    }

    class PersonArtRegimenService extends EntityService<IPersonArtRegimen, string, IPersonArtRegimenResource> implements IPersonArtRegimenService {

        static $inject = ["PersonArtRegimenResource"];
        constructor(private resource: IPersonArtRegimenResource) {
            super(resource);
        }

        getCurrent = (artId: string): ng.IPromise<IPersonArtRegimen> => {
            return this.getResource().getCurrent({ artId: artId }).$promise;
        }
        getFirst = (artId: string): ng.IPromise<IPersonArtRegimen> => {
            return this.getResource().getFirst({ artId: artId }).$promise;
        }

    }

    app.factory("PersonArtRegimenResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonArtRegimenResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/person-art-regimen/:id");

            return <IPersonArtRegimenResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getCurrent": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-regimen/getCurrent/:artId")
                }, "getFirst": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person-art-regimen/getFirst/:artId")
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

    app.service("PersonArtRegimenService", PersonArtRegimenService);

}