namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterExamination extends IAggregateRoot<string> {
        encounterId: string;
        personExaminationId: string;
    }

    export interface IEncounterExaminationList extends IEntity {
        id: string;
        date: Date;
        name: String;
        note: String;
        code: number;
        present: boolean;
        encounterPersonExaminationId: string;
        encounterId: string;
    }

    export interface IEncounterExaminationService extends data.IAggregateRootService<IEncounterExamination, string> {
        saveEncounterExamination(encounterId: string, entity: IPersonExamination): ng.IPromise<IEncounterExamination>;
        getByEncounterId(encounterId: string, page?: IPageRequest): ng.IPromise<Array<IEncounterExaminationList>>;
        getTbScreeningByEncounterId(encounterId: string): ng.IPromise<Array<IEncounterExaminationList>>;
        getForOpd(opdId: string): ng.IPromise<IPageReponse<IEncounterExaminationList>>;
        getForAdmission(admissionId: string): ng.IPromise<IPageReponse<IEncounterExaminationList>>;
    }

    interface IEncounterExaminationResource extends IResourceService<IEncounterExamination> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterExamination>>;
        fetchByPersonExaminationEncounterId: ng.resource.IResourceMethod<Array<IPersonExamination>>;
        fetchExaminationsByEncounterId: ng.resource.IResourceMethod<Array<IExamination>>;
        getTbScreeningByEncounterId: ng.resource.IResourceMethod<Array<IEncounterExamination>>;
        getForOpd: ng.resource.IResourceMethod<IPageReponse<IEncounterExaminationList>>;
        getForAdmission: ng.resource.IResourceMethod<IPageReponse<IEncounterExaminationList>>;
    }

    class EncounterExaminationService extends EntityService<IEncounterExamination, string, IEncounterExaminationResource> implements IEncounterExaminationService {

        static $inject = ["EncounterExaminationResource", "$q", "ExaminationService"];
        constructor(private resource: IEncounterExaminationResource,
            private q: ng.IQService,
            private examinationService: IExaminationService) {
            super(resource);
        }


        getForOpd = (opdId: string): ng.IPromise<IPageReponse<IEncounterExaminationList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<IPageReponse<IEncounterExaminationList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        saveEncounterExamination = (encounterId: string, entity: IPersonExamination): ng.IPromise<IEncounterExamination> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }
        getTbScreeningByEncounterId = (encounterId: string): ng.IPromise<Array<IEncounterExaminationList>> => {
            let defer = this.q.defer();
            this.getResource().getTbScreeningByEncounterId({ encounterId: encounterId }).$promise.then((ecs) => {
                this.q.all<IPersonExamination[], IExamination[]>(
                    [
                        this.getResource().fetchByPersonExaminationEncounterId({ encounterId: encounterId }).$promise,
                        this.getResource().fetchExaminationsByEncounterId({ encounterId: encounterId }).$promise
                    ]).then((response) => {
                        let pcs = response[0];
                        let cs = response[1];

                        let result: Array<IEncounterExaminationList> = [];

                        // code to builde Array
                        ecs.forEach((encounterExamination) => {

                            let entry = { id: encounterExamination.personExaminationId } as IEncounterExaminationList;

                            pcs.forEach((personExamination) => {
                                if (personExamination.id === encounterExamination.personExaminationId) {
                                    entry.present = personExamination.present;
                                    entry.date = personExamination.date;
                                    entry.note = personExamination.note;


                                    cs.forEach((examination) => {
                                        if (examination.id === personExamination.examinationId) {
                                            entry.name = examination.name;
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
            });



            return defer.promise;
        }

        getByEncounterId = (encounterId: string, page?: IPageRequest): ng.IPromise<Array<IEncounterExaminationList>> => {

            let defer = this.q.defer();
            this.q.all<IEncounterExamination[], IPersonExamination[], IExamination[]>(
                [this.getResource().fetchByEncounterId({ encounterId: encounterId }).$promise,
                this.getResource().fetchByPersonExaminationEncounterId({ encounterId: encounterId }).$promise,
                this.getResource().fetchExaminationsByEncounterId({ encounterId: encounterId }).$promise
                ]).then((response) => {

                    let ecs = response[0];

                    let pcs = response[1];

                    let cs = response[2];

                    let result: Array<IEncounterExaminationList> = [];

                    // code to builde Array
                    ecs.forEach((encounterExamination) => {

                        let entry = { id: encounterExamination.personExaminationId } as IEncounterExaminationList;

                        pcs.forEach((personExamination) => {
                            if (personExamination.id === encounterExamination.personExaminationId) {
                                entry.present = personExamination.present;
                                entry.date = personExamination.date;
                                entry.note = personExamination.note;

                                cs.forEach((examination) => {
                                    if (examination.id === personExamination.examinationId) {
                                        entry.name = examination.name;
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
            // return this.getResource().fetchByEncounterId({ encounterId: encounterId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }
    }

    app.factory("EncounterExaminationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-examinations/:id");

            return <IEncounterExaminationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
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
                    url: mrs.config.Settings.serverResource("api/encounter-examinations/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "fetchByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-examinations/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonExaminationEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-examinations/getPersonExaminationsByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }, "getTbScreeningByEncounterId": {
                    url: mrs.config.Settings.serverResource("/api/encounter-examinations/encounters/:encounterId/tb-screening"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("/api/opds/:opdId/encounter-examinations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForAdmission": {
                    url: mrs.config.Settings.serverResource("/api/admissions/:admissionId/encounter-examinations"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchExaminationsByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-examinations/getByExaminationsEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
            });

        }]);

    app.service("EncounterExaminationService", EncounterExaminationService);

}