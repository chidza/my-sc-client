namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPhone extends IAggregateRoot<string> {
        number: string;
        personId: string;
    }

    export interface IPhoneService extends data.IAggregateRootService<IPhone, string> {
        getByPersonId: (personId: string) => ng.IPromise<Array<IPhone>>;
    }

    interface IPhoneResource extends IResourceService<IPhone> {
        getByPersonId: ng.resource.IResourceArrayMethod<IPhone>;
    }

    class PhoneService extends EntityService<IPhone, string, IPhoneResource> implements IPhoneService {

        static $inject = ["PhoneResource"];
        constructor(private resource: IPhoneResource) {
            super(resource);
        }

        getByPersonId = (personId: string): ng.IPromise<Array<IPhone>> => {
            return this.getResource().getByPersonId({ personId: personId }).$promise;
        }

    }

    app.factory("PhoneResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPhoneResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/phones/:id");

            return <IPhoneResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
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
                },
                "getByPersonId": {
                    url: mrs.config.Settings.serverResource("/api/phones/people/:personId"),
                    method: "GET", isArray: true
                }
            });

        }]);

    app.service("PhoneService", PhoneService);

}