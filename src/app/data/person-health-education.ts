namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonHealthEducation extends IAggregateRoot<string> {
        healthEducationTopicId: string;
        date: Date;
        type: string;
        personId: string;
        note: string;
    }


    export interface IPersonHealthEducationList extends IAggregateRoot<string> {
        date: string;
        name: string;
        type: string;
        note: string;
    }

    export interface IPersonHealthEducationService extends data.IAggregateRootService<IPersonHealthEducation, string> {
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IPersonHealthEducationList>>;
        getByPersonId(personId: string, date: string): ng.IPromise<Array<IPersonHealthEducationList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IPersonHealthEducationList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IPersonHealthEducationList>>;
    }

    interface IPersonHealthEducationResource extends IResourceService<IPersonHealthEducation> {
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IPersonHealthEducationList>>;
        getByPersonId: ng.resource.IResourceArrayMethod<IPersonHealthEducationList>;
        getForAdmission: ng.resource.IResourceArrayMethod<IPersonHealthEducationList>;
        getForOpd: ng.resource.IResourceArrayMethod<IPersonHealthEducationList>;
    }

    class PersonHealthEducationService extends EntityService<IPersonHealthEducation, string, IPersonHealthEducationResource> implements IPersonHealthEducationService {

        static $inject = ["PersonHealthEducationResource"];
        constructor(private resource: IPersonHealthEducationResource) {
            super(resource);
        }
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IPersonHealthEducationList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }
        getByPersonId(personId: string, date: string): ng.IPromise<Array<IPersonHealthEducationList>> {
            return this.getResource().getByPersonId({ personId: personId, date: date }).$promise;
        }
        getForAdmission(admissionId: string): ng.IPromise<Array<IPersonHealthEducationList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IPersonHealthEducationList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

    }

    app.factory("PersonHealthEducationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonHealthEducationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-health-education/:id");

            return <IPersonHealthEducationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },

                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-health-education/history"),
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
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-health-education")
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-health-education")
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
                "getByPersonId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-health-educations"),
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
                }
            });

        }]);

    app.service("PersonHealthEducationService", PersonHealthEducationService);

}