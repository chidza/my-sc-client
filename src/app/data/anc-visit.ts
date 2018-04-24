namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAncVisit extends IAggregateRoot<string> {
        visitNumber: string;
        encounterId: string;
        generalAssessmentId: string;
        ancId: string;
        obstetricExaminationId: string;
    }

    export interface IAncVisitList extends IAggregateRoot<string> {
        visitNumber: number;
        date?: Date;
        tbScreening: boolean;
        malariaResult: string;
        treatment: string;
    }

    export interface IAncVisitHistoryInit {
        ancId: string;
        date: Date;
        visitNumber: number;
        queueId: string;
    }

    export interface IAncVisitService extends data.IAggregateRootService<IAncVisit, string> {
        ancSession: (opdId: string, queueId: string, ancId: string) => ng.IPromise<IAncVisit>;
        createHistoricVisit: (ancVisit: IAncVisitHistoryInit) => ng.IPromise<IAncVisit>;
        getByAncId: (ancId: string) => ng.IPromise<Array<IAncVisit>>;
        ancVisits: (ancId: string) => ng.IPromise<Array<IAncVisitList>>;
    }

    interface IAncVisitResource extends IResourceService<IAncVisit> {
        ancSession: ng.resource.IResourceMethod<IAncVisit>;
        createHistoricVisit: ng.resource.IResourceMethod<IAncVisit>;
        getByAncId: ng.resource.IResourceArrayMethod<IAncVisit>;
    }

    class AncVisitService extends EntityService<IAncVisit, string, IAncVisitResource> implements IAncVisitService {

        static $inject = ["AncVisitResource", "$q", "EncounterService", "PersonInvestigationService",
            "PersonMedicationService", "AncService", "SiteSettingService", "AncGeneralAssessmentService", "DateUtils"];
        constructor(private resource: IAncVisitResource,
            private q: ng.IQService,
            private encounterService: data.IEncounterService,
            private personInvestigationService: data.IPersonInvestigationService,
            private personMedicationService: data.IPersonMedicationService,
            private ancService: data.IAncService,
            private siteSettingService: ISiteSettingService,
            private generalAssessmentService: IAncGeneralAssessmentService,
            private dateUtils: utils.IDateUtils) {
            super(resource);
        }



        getByAncId = (ancId: string): ng.IPromise<Array<IAncVisit>> => {
            return this.getResource().getByAncId({ ancId: ancId }).$promise;
        }


        ancSession = (opdId: string, queueId: string, ancId: string): ng.IPromise<IAncVisit> => {
            return this.getResource().ancSession({ opdId: opdId, queueId: queueId, ancId: ancId }).$promise;
        }
        createHistoricVisit = (ancVisit: IAncVisitHistoryInit): ng.IPromise<IAncVisit> => {
            return this.getResource().createHistoricVisit({ ancId: ancVisit.ancId },
                { ancId: ancVisit.ancId, date: this.dateUtils.convertLocalDateToServer(ancVisit.date), queueId: ancVisit.queueId, visitNumber: ancVisit.visitNumber }).$promise;
        }

        ancVisits = (ancId: string): ng.IPromise<Array<IAncVisitList>> => {
            let defer = this.q.defer();
            let result: Array<IAncVisitList> = [];
            this.getResource().getByAncId({ ancId: ancId }).$promise.then((response) => {
                response.forEach((anc) => {
                    let entry = {} as IAncVisitList;
                    entry.id = anc.id;
                    entry.visitNumber = +anc.visitNumber;
                    entry.treatment = "";

                    this.generalAssessmentService.get(anc.generalAssessmentId).then((response) => {
                        entry.tbScreening = response.tbScreeningDone;
                    });
                    if (anc.encounterId) {
                        this.encounterService.get(anc.encounterId).then((encounter) => {
                            entry.date = encounter.date;
                            this.ancService.get(ancId).then((response) => {
                                let date: string = moment(encounter.date).format("YYYY-MM-DDTHH:mm:ss");
                                this.personInvestigationService.getByPersonId(response.personId, date).then((response) => {
                                    let malariaId: string;
                                    this.siteSettingService.fetch("INVESTIGATION_MALARIA_ID").then((setting) => {
                                        malariaId = setting.value;
                                        response.forEach((investigation) => {
                                            if (investigation.investigationId === malariaId) {
                                                entry.malariaResult = investigation.result;
                                            }
                                        });
                                    });
                                });
                                this.personMedicationService.getByPersonId(response.personId, date).then((response) => {
                                    response.forEach((med) => {
                                        entry.treatment = entry.treatment + med.drugName + ", ";
                                    });
                                    if (entry.treatment.length > 0) {

                                        entry.treatment = entry.treatment.substring(0, entry.treatment.length - 2);
                                    }
                                });
                            });
                        });
                    }


                    result.push(entry);
                });
                defer.resolve(result);
            });


            return defer.promise;
        }


    }

    app.factory("AncVisitResource", ["$resource",
        ($resource: ng.resource.IResourceService): IAncVisitResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/anc-visits/:id");

            return <IAncVisitResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getByAncId": {
                    method: "GET", isArray: true,

                    url: mrs.config.Settings.serverResource("api/ancs/:ancId/anc-visits")
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
                "update": { method: "PUT" }
                ,
                "ancSession": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounters/:queueId/anc/:ancId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "ancVisits": {
                    url: mrs.config.Settings.serverResource("api/ancs/:ancId/anc-visits"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "createHistoricVisit": {
                    url: mrs.config.Settings.serverResource("api/ancs/:ancId/anc-visits/history"),
                    method: "POST", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("AncVisitService", AncVisitService);

}