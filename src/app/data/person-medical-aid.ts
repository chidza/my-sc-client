namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMedicalAid extends IAggregateRoot<string> {
        memberName: String;
        number: String;
        expirationDate: Date;
        personId: string;
        providerId: String;
    }

    export interface IMedicalAidService extends data.IAggregateRootService<IMedicalAid, string> {
        query: (text?: string) => ng.IPromise<Array<IMedicalAid>>;
        getByPerson: (personId: string) => ng.IPromise<Array<IMedicalAid>>;
    }

    interface IMedicalAidResource extends IResourceService<IMedicalAid> {
        getByPerson: ng.resource.IResourceArrayMethod<IMedicalAid>;

    }

    class MedicalAidService extends EntityService<IMedicalAid, string, IMedicalAidResource> implements IMedicalAidService {

        static $inject = ["MedicalAidResource"];
        constructor(private resource: IMedicalAidResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IMedicalAid>> => {
            return this.getResource().query({ text: name }).$promise;
        }
        getByPerson = (personId: string): ng.IPromise<Array<IMedicalAid>> => {
            return this.getResource().getByPerson({ personId: personId }).$promise;
        }
    }

    app.factory("MedicalAidResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IMedicalAidResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/medical-aids/:id");

            return <IMedicalAidResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.expirationDate = dateUtils.convertLocalDateFromServer(data.expirationDate);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.expirationDate = dateUtils.convertLocalDateToServer(copy.expirationDate);
                        return angular.toJson(copy);
                    }
                },
                "getByPerson": {
                    url: mrs.config.Settings.serverResource("api/medical-aids/people/:personId"),
                    method: "GET", isArray: true,
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.expirationDate = dateUtils.convertLocalDateToServer(copy.expirationDate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("MedicalAidService", MedicalAidService);

}