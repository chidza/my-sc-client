namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtMedicationHistory extends IAggregateRoot<string> {
        artId: string;
        personMedicationId: string;
    }

    export interface IPersonMedicationHistoryList {
        personMedicationId: string;
        date: Date;
        drugName: string;
    }

    export interface IArtMedicationHistoryList extends ng.resource.IResource<IArtMedicationHistoryList> {
        personMedicationId: string;
        date: Date;
        drugName: string;
        id: string;
        suffix: string;
    }



    export interface IArtMedicationHistoryService extends data.IAggregateRootService<IArtMedicationHistory, string> {
        getByArtId: (artId: string) => ng.IPromise<Array<IArtMedicationHistoryList>>;
    }

    interface IArtMedicationHistoryResource extends IResourceService<IArtMedicationHistory> {
        getByArtId: ng.resource.IResourceMethod<Array<IArtMedicationHistoryList>>;
    }

    class ArtMedicationHistoryService extends EntityService<IArtMedicationHistory, string, IArtMedicationHistoryResource> implements IArtMedicationHistoryService {

        static $inject = ["ArtMedicationHistoryResource", "DrugSuffixService", "$q"];
        constructor(private resource: IArtMedicationHistoryResource,
            private suffixService: IDrugSuffixService,
            private q: ng.IQService) {
            super(resource);
        }

        getByArtId = (artId: string): ng.IPromise<Array<IArtMedicationHistoryList>> => {
            return this.getResource().getByArtId({ artId: artId }).$promise;
        }

    }

    app.factory("ArtMedicationHistoryResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtMedicationHistoryResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-medication-histories/:id");

            return <IArtMedicationHistoryResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByArtId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/person-medications/:artId/art-medication-histories"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
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
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("ArtMedicationHistoryService", ArtMedicationHistoryService);

}