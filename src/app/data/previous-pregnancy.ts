namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPreviousPregnancy extends IAggregateRoot<string> {
        date: Date;
        personId: string;
        placeOfBirth?: string;
        pregnancyOutcome: string;
    }


    export interface IPreviousPregnancyService extends data.IAggregateRootService<IPreviousPregnancy, string> {
        savePreviousPregnancy: (previousPregnancy: Object) => ng.IPromise<IPreviousPregnancy>;
    }

    interface IPreviousPregnancyResource extends IResourceService<IPreviousPregnancy> {
        savePreviousPregnancy: ng.resource.IResourceMethod<IPreviousPregnancy>;
    }

    class PreviousPregnancyService extends EntityService<IPreviousPregnancy, string, IPreviousPregnancyResource> implements IPreviousPregnancyService {

        static $inject = ["PreviousPregnancyResource"];
        constructor(private resource: IPreviousPregnancyResource) {
            super(resource);
        }

        savePreviousPregnancy = (previousPregnancy: Object): ng.IPromise<IPreviousPregnancy> => {
            return this.savePreviousPregnancy({ previousPregnancy: { deliveryId: 1, ancId: 2, childPersonId: 21, personId: 1 } });
            // return this.getResource().getByPerson({ personId: personId }).$promise;
        }

    }

    app.factory("PreviousPregnancyResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPreviousPregnancyResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/pncs/:id");

            return <IPreviousPregnancyResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    isArray: false,
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

    app.service("PreviousPregnancyService", PreviousPregnancyService);

}