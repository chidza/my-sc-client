namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILabInvestigation extends IAggregateRoot<string> {

        dateSampleTaken: Date;
        labLocation: string;
        result: string;
        resultDate: Date;
        personInvestigationId: string;
        laboratoryId: string;
        refNumber: string;

    }

    export interface ILabInvestigationList extends IAggregateRoot<string> {
        labInvestigationId: string;
        personInvestigationId: string;
        personId: string;
        name: string;
        sampleName: string;
        sampleDate: Date;
        testName: string;
        labName: string;
        resultStatus: boolean;
        investigationId: string;

    }

    export interface ILabInvestigationService extends data.IAggregateRootService<ILabInvestigation, string> {
        query: (text?: string) => ng.IPromise<Array<ILabInvestigation>>;
        getLabInvestigationBydate(from: string, to: string): ng.IPromise<Array<IPerson>>;
        getLabInvestigationId(labInvestigationId: string): ng.IPromise<ILabInvestigationList>;
        getLabInvestigationByPersonInvestigationId(personInvestigationId: string): ng.IPromise<ILabInvestigation>;
        getLabInvestigationByPerson(personId: string, from: string, to: string): ng.IPromise<Array<ILabInvestigationList>>;
        getLabInvestigationByPersonId(personId: string): ng.IPromise<Array<ILabInvestigation>>;
    }

    interface ILabInvestigationResource extends IResourceService<ILabInvestigation> {
        getLabInvestigationBydate: ng.resource.IResourceMethod<Array<IPerson>>;
        getLabInvestigationId: ng.resource.IResourceMethod<ILabInvestigationList>;
        getLabInvestigationByPersonInvestigationId: ng.resource.IResourceMethod<ILabInvestigation>;
        getLabInvestigationByPerson: ng.resource.IResourceMethod<Array<ILabInvestigationList>>;
        getLabInvestigationByPersonId: ng.resource.IResourceMethod<Array<ILabInvestigation>>;
    }

    class LabInvestigationService extends EntityService<ILabInvestigation, string, ILabInvestigationResource> implements ILabInvestigationService {

        static $inject = ["LabInvestigationResource", "$q", "DepartmentService"];
        constructor(private resource: ILabInvestigationResource,
            private q: ng.IQService,
            private departmentService: IDepartmentService) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<ILabInvestigation>> => {
            return this.getResource().query({ text: text }).$promise;
        }

        getLabInvestigationBydate = (from: string, to: string): ng.IPromise<Array<IPerson>> => {
            return this.getResource().getLabInvestigationBydate({ from: from, to: to }).$promise;
        }


        getLabInvestigationId = (labInvestigationId: string): ng.IPromise<ILabInvestigationList> => {
            return this.getResource().getLabInvestigationId({ labInvestigationId: labInvestigationId }).$promise;
        }

        getLabInvestigationByPersonInvestigationId = (personInvestigationId: string): ng.IPromise<ILabInvestigation> => {
            return this.getResource().getLabInvestigationByPersonInvestigationId({ personInvestigationId: personInvestigationId }).$promise;
        }


        getLabInvestigationByPerson = (personId: string, from: string, to: string): ng.IPromise<Array<ILabInvestigationList>> => {
            return this.getResource().getLabInvestigationByPerson({ personId: personId, from: from, to: to }).$promise;
        }

        getLabInvestigationByPersonId = (personId: string): ng.IPromise<Array<ILabInvestigation>> => {
            return this.getResource().getLabInvestigationByPersonId({ personId: personId }).$promise;
        }


    }

    app.factory("LabInvestigationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): ILabInvestigationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/labInvestigations/:id");

            return <ILabInvestigationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
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
                "getLabInvestigationBydate": {
                    url: mrs.config.Settings.serverResource("api/labInvestigations/getLabInvestigationBydate"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },

                "getLabInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/labInvestigations/:labInvestigationId/getLabInvestigationId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getLabInvestigationByPerson": {
                    url: mrs.config.Settings.serverResource("api/labInvestigations/:personId/getLabInvestigationByPerson"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getLabInvestigationByPersonInvestigationId": {
                    url: mrs.config.Settings.serverResource("api/labInvestigations/:personInvestigationId/getLabInvestigationByPersonInvestigationId"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "getLabInvestigationByPersonId": {
                    url: mrs.config.Settings.serverResource("api/labInvestigations/:personId/getLabInvestigationByPersonId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("LabInvestigationService", LabInvestigationService);

}