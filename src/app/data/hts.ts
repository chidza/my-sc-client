namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHts extends IAggregateRoot<string> {
        approach: string;
        coupleCounselling: boolean;
        encounterId: string;
        investigationId: string;
        modelId: string;
        postTestCounselling: boolean;
        purposeOfTestId: string;
        preTestInformationGiven: boolean;
        reasonForNotIssuingResultId: string;
        resultsIssued: boolean;
        retest: boolean;
        testForPregnancy: string;
    }

    export interface IHtsService extends data.IAggregateRootService<IHts, string> {
        htsSession: (opdId: string, queueId: string) => ng.IPromise<IHts>;
        htsAdmissionSession: (admissionId: string, wardId: string) => ng.IPromise<IHts>;
    }

    interface IHtsResource extends IResourceService<IHts> {
        htsSession: ng.resource.IResourceMethod<IHts>;
        htsAdmissionSession: ng.resource.IResourceMethod<IHts>;
    }

    class HtsService extends EntityService<IHts, string, IHtsResource> implements IHtsService {

        static $inject = ["HtsResource"];
        constructor(private resource: IHtsResource) {
            super(resource);
        }

        htsSession = (opdId: string, queueId: string): ng.IPromise<IHts> => {
            return this.getResource().htsSession({ opdId: opdId, queueId: queueId }).$promise;
        }

        htsAdmissionSession = (admissionId: string, wardId: string): ng.IPromise<IHts> => {
            return this.getResource().htsAdmissionSession({ admissionId: admissionId, wardId: wardId }).$promise;
        }

    }

    app.factory("HtsResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IHtsResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/hts/:id");

            return <IHtsResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "htsSession": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounters/:queueId/hts"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "htsAdmissionSession": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounters/:wardId/hts"),
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
                        copy.birthdate = DateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.birthdate = DateUtils.convertLocalDateToServer(copy.birthdate);
                        return angular.toJson(copy);
                    }
                }
            });

        }]);

    app.service("HtsService", HtsService);

}