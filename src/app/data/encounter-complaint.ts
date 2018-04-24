namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IEncounterComplaint extends IAggregateRoot<string> {
        encounterId: string;
        personComplaintId: string;
    }

    export interface IEncounterComplaintListArray {
        id: string;
        date?: Date;
        complaintName?: string;
        present?: boolean;
        duration?: number;
        note?: string;
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
        encounterId: string;
    }

    export interface IEncounterComplaintService extends data.IAggregateRootService<IEncounterComplaint, string> {
        saveEncounterComplaint(encounterId: string, entity: IPersonComplaint): ng.IPromise<IEncounterComplaint>;
        getByEncounterId(encounterId: string): ng.IPromise<Array<IEncounterComplaintListArray>>;
        getForOpd(opdId: string): ng.IPromise<Array<IEncounterComplaintList>>;
        getForAdmission(AdmissionId: string): ng.IPromise<Array<IEncounterComplaintList>>;
    }

    interface IEncounterComplaintResource extends IResourceService<IEncounterComplaint> {
        fetchByEncounterId: ng.resource.IResourceMethod<Array<IEncounterComplaint>>;
        fetchByPersonComplaintEncounterId: ng.resource.IResourceMethod<Array<IPersonComplaint>>;
        fetchComplaintsByEncounterId: ng.resource.IResourceMethod<Array<IComplaint>>;
        getForOpd: ng.resource.IResourceMethod<Array<IEncounterComplaintList>>;
        getForAdmission: ng.resource.IResourceMethod<Array<IEncounterComplaintList>>;
    }

    class EncounterComplaintService extends EntityService<IEncounterComplaint, string, IEncounterComplaintResource> implements IEncounterComplaintService {

        static $inject = ["EncounterComplaintResource", "PersonComplaintService", "$q"];
        constructor(private resource: IEncounterComplaintResource,
            private personComplaintService: IPersonComplaintService,
            private q: ng.IQService) {
            super(resource);
        }

        saveEncounterComplaint = (encounterId: string, entity: IPersonComplaint): ng.IPromise<IEncounterComplaint> => {
            return this.getResource().save({ encounterId: encounterId }, entity).$promise;
        }

        getForOpd = (opdId: string): ng.IPromise<Array<IEncounterComplaintList>> => {
            return this.getResource().getForOpd({ opdId: opdId }).$promise;
        }

        getForAdmission = (admissionId: string): ng.IPromise<Array<IEncounterComplaintList>> => {
            return this.getResource().getForAdmission({ admissionId: admissionId }).$promise;
        }

        getByEncounterId = (encounterId: string): ng.IPromise<Array<IEncounterComplaintListArray>> => {

            let defer = this.q.defer();

            this.q.all<IEncounterComplaint[], IPersonComplaint[], IComplaint[]>(
                [this.getResource().fetchByEncounterId({ encounterId: encounterId }).$promise,
                this.getResource().fetchByPersonComplaintEncounterId({ encounterId: encounterId }).$promise,
                this.getResource().fetchComplaintsByEncounterId({ encounterId: encounterId }).$promise
                ]).then((response) => {

                    let ecs = response[0];

                    let pcs = response[1];

                    let cs = response[2];

                    let result: Array<IEncounterComplaintListArray> = [];

                    // code to builde Array
                    ecs.forEach((encounterComplaint) => {

                        let entry: IEncounterComplaintListArray = { id: encounterComplaint.personComplaintId };

                        pcs.forEach((personComplaint) => {
                            if (personComplaint.id === encounterComplaint.personComplaintId) {
                                entry.duration = personComplaint.duration;
                                entry.present = personComplaint.present;
                                entry.date = personComplaint.date;
                                entry.note = personComplaint.note;


                                cs.forEach((complaint) => {
                                    if (complaint.id === personComplaint.complaintId) {
                                        entry.complaintName = complaint.name;
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
    }

    app.factory("EncounterComplaintResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IEncounterComplaintResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/encounter-complaints/:id");

            return <IEncounterComplaintResource>$resource(resourceUrl, {}, {
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
                    url: mrs.config.Settings.serverResource("api/encounter-complaints/:encounterId"),
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.convertLocalDateToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getForOpd": {
                    url: mrs.config.Settings.serverResource("api/opds/:opdId/encounter-complaints"),
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
                    url: mrs.config.Settings.serverResource("api/admissions/:admissionId/encounter-complaints"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-complaints/getByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchByPersonComplaintEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-complaints/getPersonComplaintsByEncounterId/:encounterId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateFromServer(data.date);
                        }
                        return data;
                    }
                },
                "fetchComplaintsByEncounterId": {
                    url: mrs.config.Settings.serverResource("api/encounter-complaints/getByComplaintsEncounterId/:encounterId"),
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

    app.service("EncounterComplaintService", EncounterComplaintService);

}