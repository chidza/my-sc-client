namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonExamination extends IAggregateRoot<string> {

        date: Date;
        present: boolean;
        personId: string;
        examinationId: string;
        note: string;

    }

    export interface IPersonTbStatus extends IAggregateRoot<string> {

        date: Date;
        request: string;
        status: string;

    }



    export interface IPersonExaminationService extends data.IAggregateRootService<IPersonExamination, string> {
        getOpdTbStatus: (opdId: string) => ng.IPromise<IPersonTbStatus>;
        getAdmissionTbStatus: (admissionId: string) => ng.IPromise<IPersonTbStatus>;
        query(text?: string): ng.IPromise<Array<IPersonExamination>>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterExaminationList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterExaminationList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterExaminationList>>;
    }

    interface IPersonExaminationResource extends IResourceService<IPersonExamination> {
        getOpdTbStatus: ng.resource.IResourceMethod<IPersonTbStatus>;
        getAdmissionTbStatus: ng.resource.IResourceMethod<IPersonTbStatus>;
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IEncounterExaminationList>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterExaminationList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterExaminationList>;
    }

    class PersonExaminationService extends EntityService<IPersonExamination, string, IPersonExaminationResource> implements IPersonExaminationService {

        static $inject = ["PersonExaminationResource"];
        constructor(private resource: IPersonExaminationResource) {
            super(resource);
        }

        getOpdTbStatus = (opdId: string): ng.IPromise<IPersonTbStatus> => {
            return this.getResource().getOpdTbStatus({ opdId: opdId }).$promise;
        }

        getAdmissionTbStatus = (admissionId: string): ng.IPromise<IPersonTbStatus> => {
            return this.getResource().getAdmissionTbStatus({ admissionId: admissionId }).$promise;
        }

        query = (text?: string): ng.IPromise<Array<IPersonExamination>> => {
            return this.getResource().query({ text: text }).$promise;
        }

        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterExaminationList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterExaminationList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterExaminationList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

    }

    app.factory("PersonExaminationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-examinations/:id");

            return <IPersonExaminationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("/api/people/:personId/person-examinations/history")
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-examinations")
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-examinations")
                },

                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                }, "getOpdTbStatus": {
                    url: mrs.config.Settings.serverResource("api/person-examinations/:opdId/opdTbStatus"),
                    method: "GET", isArray: false
                }, "getAdmissionTbStatus": {
                    url: mrs.config.Settings.serverResource("api/person-examinations/:admissionId/admissionTbStatus"),
                    method: "GET", isArray: false
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

    app.service("PersonExaminationService", PersonExaminationService);

}