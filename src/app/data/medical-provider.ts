namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IMedicalAidProvider extends IAggregateRoot<string> {
        name: string;
    }

    export interface IMedicalAidProviderService extends data.IAggregateRootService<IMedicalAidProvider, string> {
        query: (text?: string) => ng.IPromise<Array<IMedicalAidProvider>>;
    }

    interface IMedicalAidProviderResource extends IResourceService<IMedicalAidProvider> {

    }

    class MedicalAidProviderService extends EntityService<IMedicalAidProvider, string, IMedicalAidProviderResource> implements IMedicalAidProviderService {

        static $inject = ["MedicalAidProviderResource"];
        constructor(private resource: IMedicalAidProviderResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IMedicalAidProvider>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("MedicalAidProviderResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IMedicalAidProviderResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/medical-aid-providers/:id");

            return <IMedicalAidProviderResource>$resource(resourceUrl, {}, {
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

    app.service("MedicalAidProviderService", MedicalAidProviderService);

}