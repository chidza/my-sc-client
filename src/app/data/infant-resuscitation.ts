namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IInfantResuscitation extends IAggregateRoot<string> {
        infantId: string;
        resuscitationItemId: string;
        value: string;
    }

    export interface IInfantResuscitationService extends data.IAggregateRootService<IInfantResuscitation, string> {
        getByInfant(infantId: string): ng.IPromise<Array<IInfantResuscitation>>;
        getByInfantAndResuscitation(infantId: string, resuscitationItemId: string): ng.IPromise<IInfantResuscitation>;
        removeByInfant(infantId: string): ng.IPromise<IInfantResuscitation>;
    }

    interface IInfantResuscitationItemResource extends IResourceService<IInfantResuscitation> {
        getByInfant: ng.resource.IResourceMethod<Array<IInfantResuscitation>>;
        getByInfantAndResuscitation: ng.resource.IResourceMethod<IInfantResuscitation>;
        removeByInfant: ng.resource.IResourceMethod<IInfantResuscitation>;
    }

    class InfantResuscitationService extends EntityService<IInfantResuscitation, string, IInfantResuscitationItemResource> implements InfantResuscitationService {

        static $inject = ["InfantResuscitationItemResource"];
        constructor(private resource: IInfantResuscitationItemResource) {
            super(resource);
        }

        getByInfant = (infantId: string): ng.IPromise<Array<IInfantResuscitation>> => {
            return this.getResource().getByInfant({ infantId: infantId }).$promise;
        }

        getByInfantAndResuscitation(infantId: string, resuscitationItemId: string): ng.IPromise<IImnciVisit> {
            return this.getResource().getByInfantAndResuscitation({ infantId: infantId, resuscitationItemId: resuscitationItemId }).$promise;
        }

        removeByInfant(infantId: string): ng.IPromise<IImnciVisit> {
            return this.getResource().removeByInfant({ infantId: infantId }).$promise;
        }


    }

    app.factory("InfantResuscitationItemResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): IInfantResuscitationItemResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/infant-resuscitation-items/:id");

            return <IInfantResuscitationItemResource>$resource(resourceUrl, {}, {
                "removeByInfant": {
                    method: "DELETE", isArray: false,
                    url: mrs.config.Settings.serverResource("api/infant-resuscitation-items/:infantId/remove")
                }, "getByInfantAndResuscitation": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/infants/:infantId/resuscitation-items/:resuscitationItemId")
                },
                "getByInfant": {
                    method: "GET",
                    isArray: true,
                    url: mrs.config.Settings.serverResource("api/infants/:infantId/infant-resuscitation-items"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
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
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);

                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }

            });

        }]);

    app.service("InfantResuscitationService", InfantResuscitationService);

}