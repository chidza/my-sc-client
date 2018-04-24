namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IArtInvestigationHistory extends IAggregateRoot<string> {
        artId: string;
        personInvestigationId: string;
    }

    export interface IInvestigationHistoryList {
        id: string;
        date?: Date;
        testName?: String;
        result?: String;
        investigationId?: string;
    }

    export interface IArtInvestigationHistoryList extends ng.resource.IResource<IArtInvestigationHistoryList> {
        id: string;
        personInvestigationId: string;
        date?: Date;
        testName?: String;
        result?: String;
        investigationId?: string;
    }



    export interface IArtInvestigationHistoryService extends data.IAggregateRootService<IArtInvestigationHistory, string> {
        getByArtId: (artId: string) => ng.IPromise<Array<IArtInvestigationHistoryList>>;
    }

    interface IArtInvestigationHistoryResource extends IResourceService<IArtInvestigationHistory> {
        getByArtId: ng.resource.IResourceMethod<Array<IArtInvestigationHistoryList>>;
    }

    class ArtInvestigationHistoryService extends EntityService<IArtInvestigationHistory, string, IArtInvestigationHistoryResource> implements IArtInvestigationHistoryService {

        static $inject = ["ArtInvestigationHistoryResource", "SampleService", "LabTestService", "$q"];
        constructor(private resource: IArtInvestigationHistoryResource,
            private sampleService: ISampleService,
            private labTestService: ILabTestService,
            private q: ng.IQService) {
            super(resource);
        }

        getByArtId = (artId: string): ng.IPromise<Array<IArtInvestigationHistoryList>> => {
            return this.getResource().getByArtId({ artId: artId }).$promise;
        }

    }

    app.factory("ArtInvestigationHistoryResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IArtInvestigationHistoryResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/art-investigation-histories/:id");

            return <IArtInvestigationHistoryResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },
                "getByArtId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/art-investigation-histories/getByArtId/:artId"),
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

    app.service("ArtInvestigationHistoryService", ArtInvestigationHistoryService);

}