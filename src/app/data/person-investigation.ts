namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonInvestigation extends IAggregateRoot<string> {
        date: Date;
        time: Date;
        investigationId: string;
        issueDate: Date;
        personId: string;
        result: string;
        resultDate: Date;
    }

    export interface IPartogramInvestigation extends ng.resource.IResource<IPartogramInvestigation> {
        personInvestigationId: string;
        investigationId: string;
        test: string;
        result: string;
        date: Date;
    }

    export interface IUrinalysis
        extends ng.resource.IResource<IUrinalysis> {
        time: Date;
        protein: string;
        proteinStatus: string;
        acetone: string;
        acetoneStatus: string;
        volume: string;
        volumeStatus: string;
    }

    export interface IUrinalysisView
        extends ng.resource.IResource<IUrinalysisView> {
        times: Array<string>;
        proteins: Array<IUrinalysisViewData>;
        acetones: Array<IUrinalysisViewData>;
        volumes: Array<IUrinalysisViewData>;
    }

    export interface IUrinalysisViewData {
        time: string;
        result: string;
    }

    export interface IUrinalysisStatus extends ng.resource.IResource<IUrinalysisStatus> {
        acetone: string;
        protein: string;
        volume: string;
    }
    export interface IUrinalysisRecording extends ng.resource.IResource<IUrinalysisRecording> {
        volume: Array<IUrinalysisRecordingData>;
        acetons: Array<IUrinalysisRecordingData>;
        proteins: Array<IUrinalysisRecordingData>;
    }

    export interface IUrinalysisRecordingData {
        time: string;
        status: string;
    }

    export interface IPersonInvestigationService extends data.IAggregateRootService<IPersonInvestigation, string> {
        getByPersonId(personId: string, date?: string): ng.IPromise<Array<IPersonInvestigation>>;
        getCurrentByPersonIdAndInvestigationId(personId: string, investigationId: string): ng.IPromise<IPersonInvestigation>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterInvestigationList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterInvestigationList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterInvestigationList>>;
        getUrinalysisView(deliveryId: string, start: string, end: string): ng.IPromise<Array<IUrinalysis>>;
        checkUrinalysis(personId: string, time: string): ng.IPromise<IUrinalysisStatus>;
        getUrinalysisList(personId: string, start: string, end: string): ng.IPromise<Array<IInvestigationHistoryList>>;
        getPartogramUrinalysis(personId: string, start: string, end: string): ng.IPromise<IUrinalysisView>;
        getByPartogramInvestigations(personId: string, date: string): ng.IPromise<Array<IPartogramInvestigation>>;
        checkMissingUrinalysis: (personId: string, start: string, end: string, interval: number) => ng.IPromise<IUrinalysisRecording>;

    }

    interface IPersonInvestigationResource extends IResourceService<IPersonInvestigation> {
        getByPersonId: ng.resource.IResourceMethod<Array<IPersonInvestigation>>;
        getInvestigationsByPersonId: ng.resource.IResourceMethod<Array<IInvestigation>>;
        getCurrentByPersonIdAndInvestigationId: ng.resource.IResourceMethod<IPersonInvestigation>;
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IEncounterInvestigationList>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterInvestigationList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterInvestigationList>;
        getUrinalysisView: ng.resource.IResourceArrayMethod<IUrinalysis>;
        checkUrinalysisStatus: ng.resource.IResourceMethod<IUrinalysisStatus>;
        getUrinalysisList: ng.resource.IResourceArrayMethod<IInvestigationHistoryList>;
        getPartogramUrinalysis: ng.resource.IResourceMethod<IUrinalysisView>;
        getByPartogramInvestigations: ng.resource.IResourceMethod<Array<IPartogramInvestigation>>;
        checkMissingUrinalysis: ng.resource.IResourceMethod<IUrinalysisRecording>;
    }

    class PersonInvestigationService extends EntityService<IPersonInvestigation, string, IPersonInvestigationResource> implements IPersonInvestigationService {

        static $inject = ["PersonInvestigationResource", "$q", "LabTestService"];
        constructor(private resource: IPersonInvestigationResource,
            private q: ng.IQService,
            private testService: ILabTestService) {
            super(resource);
        }

        getByPersonId = (personId: string, date?: string): ng.IPromise<Array<IPersonInvestigation>> => {
            let defer = this.q.defer();
            let allPages: IPageRequest = {
                page: 0,
                size: 32000
            };

            this.q.all<IPersonInvestigation[], ILabTest[], IInvestigation[]>(
                [
                    this.getResource().getByPersonId({ personId: personId, date: date }).$promise,
                    this.testService.query("", allPages),
                    this.getResource().getInvestigationsByPersonId({ personId: personId }).$promise,
                ]).then((response) => {
                    let pis = response[0];
                    let tests = response[1];
                    let is = response[2];

                    let result: Array<IInvestigationHistoryList> = [];

                    pis.forEach((pi) => {
                        let entry = {} as IInvestigationHistoryList;
                        entry.id = pi.id;
                        entry.date = pi.date;
                        entry.investigationId = pi.investigationId;
                        entry.result = pi.result;

                        is.forEach((investigation) => {
                            if (investigation.id === pi.investigationId) {
                                tests.forEach((test) => {
                                    if (test.id === investigation.testId) {
                                        entry.testName = test.name;
                                    }
                                });
                            }
                        });

                        result.push(entry);
                    });
                    defer.resolve(result);

                }, (error) => {
                    defer.reject(error);
                });
            return defer.promise;
        }
        getByPartogramInvestigations(personId: string, date: string): ng.IPromise<Array<IPartogramInvestigation>> {
            return this.getResource().getByPartogramInvestigations({ personId: personId, date: date }).$promise;
        }

        getCurrentByPersonIdAndInvestigationId = (personId: string, investigationId: string): ng.IPromise<IPersonInvestigation> => {
            return this.getResource().getCurrentByPersonIdAndInvestigationId({ personId: personId, investigationId: investigationId }).$promise;
        }
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterInvestigationList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterInvestigationList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterInvestigationList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getUrinalysisView(deliveryId: string, start: string, end: string): ng.IPromise<Array<IUrinalysis>> {
            return this.getResource().getUrinalysisView({ deliveryId: deliveryId, start: start, end: end }).$promise;
        }

        checkUrinalysis(personId: string, time: string): ng.IPromise<IUrinalysisStatus> {
            return this.getResource().checkUrinalysisStatus({ personId: personId, time: time }).$promise;
        }

        getUrinalysisList(personId: string, start: string, end: string): ng.IPromise<Array<IInvestigationHistoryList>> {
            return this.getResource().getUrinalysisList({ personId: personId, start: start, end: end }).$promise;
        }

        getPartogramUrinalysis(personId: string, start: string, end: string): ng.IPromise<IUrinalysisView> {
            return this.getResource().getPartogramUrinalysis({ personId: personId, start: start, end: end }).$promise;
        }


        checkMissingUrinalysis = (personId: string, start: string, end: string, interval: number): ng.IPromise<IUrinalysisRecording> => {
            return this.getResource().checkMissingUrinalysis({ personId: personId, start: start, end: end, interval: interval }).$promise;
        }

    }

    app.factory("PersonInvestigationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonInvestigationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-investigations/:id");

            return <IPersonInvestigationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },

                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-investigations/history"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.content.forEach((d: any) => {
                                d.date = dateUtils.convertToLocalDateTimeFormat(d.date);
                            });

                        }
                        return data;
                    }
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-investigations")
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-investigations")
                },
                "getByPartogramInvestigations": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/partogram/investigations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "checkMissingUrinalysis": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/person/:personId/partogram/person-investigations/urinalysis/missing-information")
                },
                "getByPersonId": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-investigations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }, "getInvestigationsByPersonId": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/investigations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "getCurrentByPersonIdAndInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-investigations/current/:investigationId"),
                    method: "GET", isArray: false,
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
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getUrinalysisList": {
                    method: "GET",
                    isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/partogram/person-investigations/urinalysis"),
                },
                "getUrinalysisView": {
                    method: "GET",
                    isArray: true,
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/person-investigations/urinalysis/view"),
                },
                "checkUrinalysisStatus": {
                    method: "GET",
                    isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/partogram/person-investigations/check-urinalysis"),
                },
                "getPartogramUrinalysis": {
                    method: "GET",
                    isArray: false,
                    url: mrs.config.Settings.serverResource("api/deliveries/:personId/partogram/person-investigations/urinalysis"),
                }
            });

        }]);

    app.service("PersonInvestigationService", PersonInvestigationService);

}