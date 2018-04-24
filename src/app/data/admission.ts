namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAdmission extends IAggregateRoot<string> {
        wardId: string;
        personId: string;
        facilityId: string;
        discharged?: Date;
        absconded: boolean;
        time: Date;
    }

    export interface IChangeWard extends IAggregateRoot<string> {
        toWardId: string;
        personId: string;
        fromWardId: string;        
    }
    export interface IAdmissionService extends data.IAggregateRootService<IAdmission, string> {

        query(text?: string): ng.IPromise<Array<IAdmission>>;
        people(wardId: string): ng.IPromise<Array<IPerson>>;
        encounters(id: string): ng.IPromise<Array<IEncounter>>;
        current(personId: string): ng.IPromise<IAdmissionWard>;
        discharge(admissionId: string): ng.IPromise<IAdmission>;
        startEncounter(wardId: string, admissionId: string): ng.IPromise<IEncounter>;
        changeWard(newWard: IChangeWard): ng.IPromise<IChangeWard>;

    }

    interface IAdmissionResource extends IResourceService<IAdmission> {
        people: ng.resource.IResourceArrayMethod<IPerson>;
        encounters: ng.resource.IResourceArrayMethod<IEncounter>;
        current: ng.resource.IResourceMethod<IAdmissionWard>;
        discharged: ng.resource.IResourceMethod<IAdmission>;
        startEncounter: ng.resource.IResourceMethod<IEncounter>;
        discharge: ng.resource.IResourceMethod<IAdmission>;
        changeWard: ng.resource.IResourceMethod<IChangeWard>;
    }

    class AdmissionService extends EntityService<IAdmission, string, IAdmissionResource> implements IAdmissionService {

        static $inject = ["AdmissionResource"];
        constructor(private resource: IAdmissionResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IAdmission>> => {
            return this.getResource().query({ text: text }).$promise;
        }

        people = (wardId: string): ng.IPromise<Array<IPerson>> => {
            return this.getResource().people({ wardId: wardId }).$promise;
        }

        encounters = (id: string): ng.IPromise<Array<IEncounter>> => {
            return this.getResource().encounters({ id: id }).$promise;
        }

        current = (personId: string): ng.IPromise<IAdmissionWard> => {
            return this.getResource().current({ personId: personId }).$promise;
        }

        discharge = (admissionId: string): ng.IPromise<IAdmission> => {
            return this.getResource().discharge({ admissionId: admissionId }, {}).$promise;
        }
        changeWard = (newWard: IChangeWard): ng.IPromise<IChangeWard> => {
            return this.getResource().changeWard(  newWard ).$promise;
        }

        startEncounter = (wardId: string, admissionId: string): ng.IPromise<IEncounter> => {
            return this.getResource().startEncounter({ id: admissionId, wardId: wardId }).$promise;
        }
    }

    app.factory("AdmissionResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): IAdmissionResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/admissions/:id");

            return <IAdmissionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "people": {
                    url: mrs.config.Settings.serverResource("api/admissions/people/:wardId"),
                    method: "GET", isArray: true
                }, "encounters": {
                    url: mrs.config.Settings.serverResource("api/admissions/:id/encounters"),
                    method: "GET",
                    isArray: true
                }, "startEncounter": {
                    method: "GET",
                    url: mrs.config.Settings.serverResource("api/admissions/:id/encounters/:wardId")

                }, "current": {
                    method: "GET",
                    isArray: false,
                    url: mrs.config.Settings.serverResource("api/admissions/people/:personId/current"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.time = DateUtils.convertLocalDateTimeToServer(copy.time);
                        copy.discharged = DateUtils.convertLocalDateToServer(copy.discharged);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);

                        if (copy.absconded == null) {
                            copy.absconded = false;
                        }

                        copy.time = DateUtils.convertLocalDateTimeToServer(copy.time);
                        copy.discharged = DateUtils.convertLocalDateTimeToServer(copy.discharged);

                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);

                        }
                        return data;
                    }
                },
                "discharge": {
                    method: "POST",
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/discharge")
                },
                "changeWard": {
                    method: "POST",
                    url: mrs.config.Settings.serverResource("api/admissions/change-ward")
                }

            });

        }]);

    app.service("AdmissionService", AdmissionService);

}