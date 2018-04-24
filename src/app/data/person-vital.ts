namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonVital extends IAggregateRoot<string> {
        date: Date;
        time: Date;
        value: string;
        personId: string;
        vitalId: string;
    }
    export interface IEncounterVitalList extends IEntity {
        date: Date;
        unit: string;
        name: string;
        encounterVitalId: string;
        personVitalId: string;
        encounterId: string;
        value: string;
    }
    export interface IVitalValidation extends ng.resource.IResource<IVitalValidation> {
        name: string;
        status: string;
        vitalId: string;
        diastolic?: string;
        systolic?: string;
    }

    export interface IVitalView extends ng.resource.IResource<IVitalView> {
        time: string;
        status: string;
    }

    export interface IPersonVitalService extends data.IAggregateRootService<IPersonVital, string> {
        findByIds(ids: Array<string>): ng.IPromise<Array<IPersonVital>>;
        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterVitalList>>;
        getPersonHistoryByVitalId(personId: string, vitalId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterVitalList>>;
        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getForOpdAndVital(opdId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getForAdmissionAndVital(admissionId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getByPersonId(personId: string, date: string): ng.IPromise<Array<IEncounterVitalList>>;
        getByPersonIdOnly(personId: string): ng.IPromise<Array<IEncounterVitalList>>;
        getByPersonIdAndDate(personId: string, vitalId: string, date: string): ng.IPromise<Array<IPersonVital>>;
        getByPersonIdVitalIdAndDate(personId: string, vitalId: string, date: string): ng.IPromise<IPersonVital>;
        getByPersonIdVitalId(personId: string, vitalId: string): ng.IPromise<IPersonVital>;
        checkVitalByVitalId(personId: string, vitalId: string): ng.IPromise<IVitalValidation>;
        getByDateTimeInterval(personId: string, vitalId: string, interval: number, start: string, end: string): ng.IPromise<Array<IVitalView>>;

    }

    interface IPersonVitalResource extends IResourceService<IPersonVital> {
        findByIds: ng.resource.IResourceArrayMethod<IPersonVital>;
        getPersonHistory: ng.resource.IResourceMethod<IPageReponse<IEncounterVitalList>>;
        getPersonHistoryByVitalId: ng.resource.IResourceMethod<IPageReponse<IEncounterVitalList>>;
        getForAdmission: ng.resource.IResourceArrayMethod<IEncounterVitalList>;
        getForOpd: ng.resource.IResourceArrayMethod<IEncounterVitalList>;
        getForOpdAndVital: ng.resource.IResourceArrayMethod<IEncounterVitalList>;
        getForAdmissionAndVital: ng.resource.IResourceArrayMethod<IEncounterVitalList>;
        getByPersonId: ng.resource.IResourceArrayMethod<IEncounterVitalList>;
        getByPersonIdOnly: ng.resource.IResourceArrayMethod<IEncounterVitalList>;
        getByPersonIdAndDate: ng.resource.IResourceArrayMethod<IPersonVital>;
        getByPersonIdVitalIdAndDate: ng.resource.IResourceMethod<IPersonVital>;
        getByPersonIdVitalId: ng.resource.IResourceMethod<IPersonVital>;
        checkVitalByVitalId: ng.resource.IResourceMethod<IVitalValidation>;
        getByDateTimeInterval: ng.resource.IResourceArrayMethod<IVitalView>;
    }

    class PersonVitalService extends EntityService<IPersonVital, string, IPersonVitalResource> implements IPersonVitalService {

        static $inject = ["PersonVitalResource"];
        constructor(private resource: IPersonVitalResource) {
            super(resource);
        }

        findByIds = (ids: Array<string>): ng.IPromise<Array<IPersonVital>> => {
            return this.getResource().findByIds({ personVitalId: ids.join(",") }).$promise;
        }

        getPersonHistory(personId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterVitalList>> {
            return this.getResource().getPersonHistory({ personId: personId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getByPersonId(personId: string, date: string): ng.IPromise<Array<IEncounterVitalList>> {
            return this.getResource().getByPersonId({ personId: personId, date: date }).$promise;
        }

        getByPersonIdOnly(personId: string): ng.IPromise<Array<IEncounterVitalList>> {
            return this.getResource().getByPersonIdOnly({ personId: personId}).$promise;
        }
        getByPersonIdAndDate(personId: string, vitalId: string, date: string): ng.IPromise<Array<IPersonVital>> {
            return this.getResource().getByPersonIdAndDate({ personId: personId, vitalId: vitalId, date: date }).$promise;
        }

        //////////

        getByDateTimeInterval(personId: string, vitalId: string, interval: number, start: string, end: string): ng.IPromise<Array<IVitalView>> {
            return this.getResource().getByDateTimeInterval({
                personId: personId,
                vitalId: vitalId,
                interval: interval,
                start: start,
                end: end
            }).$promise;
        }

        /////////////////
        getByPersonIdVitalIdAndDate(personId: string, vitalId: string, date: string): ng.IPromise<IPersonVital> {
            return this.getResource().getByPersonIdVitalIdAndDate({ personId: personId, vitalId: vitalId, date: date }).$promise;
        }

        getByPersonIdVitalId(personId: string, vitalId: string): ng.IPromise<IPersonVital> {
            return this.getResource().getByPersonIdVitalId({ personId: personId, vitalId: vitalId}).$promise;
        }
        getPersonHistoryByVitalId(personId: string, vitalId: string, page: IPageRequest): ng.IPromise<IPageReponse<IEncounterVitalList>> {
            return this.getResource().getPersonHistoryByVitalId({ personId: personId, vitalId: vitalId, page: page.page, size: page.size, sort: page.sort }).$promise;
        }

        getForAdmission(admissionId: string): ng.IPromise<Array<IEncounterVitalList>> {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getForOpd(opdId: string): ng.IPromise<Array<IEncounterVitalList>> {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }
        getForOpdAndVital(opdId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>> {
            return this.getResource().getForOpdAndVital({ opdId: opdId, vitalId: vitalId }).$promise;
        }

        getForAdmissionAndVital(admissionId: string, vitalId: string): ng.IPromise<Array<IEncounterVitalList>> {
            return this.getResource().getForAdmissionAndVital({ admissionId: admissionId, vitalId: vitalId }).$promise;
        }
        checkVitalByVitalId(personId: string, vitalId: string): ng.IPromise<IVitalValidation> {
            return this.getResource().checkVitalByVitalId({ personId: personId, vitalId: vitalId }).$promise;
        }
    }

    app.factory("PersonVitalResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPersonVitalResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-vitals/:id");

            return <IPersonVitalResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
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
                "findByIds": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/person-vitals/vitals"),
                },
                "getPersonHistory": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals/history"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.content.forEach((d: any) => {
                                d.date = dateUtils.convertToLocalDateTimeFormat(d.date);
                                d.value = d.value + " " + d.unit;
                            });
                        }
                        return data;
                    }
                },
                "getByPersonId": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },

                "getByPersonIdOnly": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vital"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },


                "getByPersonIdAndDate": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals/:vitalId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                /////////


                "getByDateTimeInterval": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals/:vitalId/:interval"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                //////



                "getByPersonIdVitalId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vital/:vitalId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },



                "getByPersonIdVitalIdAndDate": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals/:vitalId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },





                ////////////
                "getPersonHistoryByVitalId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals/history/:vitalId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForAdmission": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-vitals"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForOpd": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-vitals"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForOpdAndVital": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/person-vitals/:vitalId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "getForAdmissionAndVital": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/person-vitals/:vitalId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "checkVitalByVitalId": {
                    method: "GET", isArray: false,
                    url: mrs.config.Settings.serverResource("api/people/:personId/vitals/partogram/:vitalId/check-vital"),
                },
            });

        }]);

    app.service("PersonVitalService", PersonVitalService);

}