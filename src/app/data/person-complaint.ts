namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonComplaint extends IAggregateRoot<string> {
        complaintId: string;
        date: Date;
        duration: number;
        personId: string;
        present: boolean;
        note: string;

    }


    export interface IEncounterComplaintList extends IEntity {
        date: string;
        name: string;
        code: string;
        present: boolean;
        duration: number;
        note: string;
        encounterPersonComplaintId: string;
        personComplaintId: string;
    }

    export interface IPersonComplaintService extends data.IAggregateRootService<IPersonComplaint, string> {
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterComplaintList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterComplaintList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterComplaintList>>;
    }

    interface IPersonComplaintResource extends IResourceService<IPersonComplaint> {
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IEncounterComplaintList>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterComplaintList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterComplaintList>;
    }

    class PersonComplaintService extends EntityService<IPersonComplaint, string, IPersonComplaintResource> implements IPersonComplaintService {

        static $inject = ["PersonComplaintResource"];
        constructor(private resource: IPersonComplaintResource) {
            super(resource);
        }
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterComplaintList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterComplaintList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterComplaintList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

    }

    app.factory("PersonComplaintResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonComplaintResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-complaints/:id");

            return <IPersonComplaintResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },

                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-complaints/history")
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-complaints")
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-complaints")
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

    app.service("PersonComplaintService", PersonComplaintService);

}