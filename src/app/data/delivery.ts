namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDelivery extends IAggregateRoot<string> {
        date: Date;
        deliverySummaryId: string;
        doctorExaminationId: string;
        doctorGeneralExaminationId: string;
        historyId: string;
        labourSummaryId: string;
        nurseExaminationId: string;
        nurseGeneralExaminationId: string;
        personId: string;
        placentaAndMembraneId: string;
        pncId?: string;
        state: string;
        time: Date;
        admissionId: string;
    }

    export interface IActivePhase extends IAggregateRoot<string> {
        startTime: string;
        endTime: string;
        times: Array<string>;

    }

    export interface ILabourStage extends IAggregateRoot<string> {
        stage1StartDate: Date;
        stage1StartTime: string;
        stage2StartDate: Date;
        stage2StartTime: string;
        stage3StartDate: Date;
        stage3StartTime: string;
        stage3EndDate: Date;
        stage3EndTime: string;
    }
    export interface IDeliveryWardNotification extends IAggregateRoot<string> {
        deliveryId: string;
        personId: string;
        active: boolean;
        activePhaseStartTime: Date;
        activePhaseEndTime: Date;
        currentDeliveryPartogramId: string;
        alertLineStatus: string;
        transferLineStatus: string;
        actionLineStatus: string;
        minsToNextReading: number;
    }

    export interface IDilatationStatus extends IAggregateRoot<string> {
        alert: string;
        transfer: string;
        action: string;
    }

    export interface IDescentStatus extends IAggregateRoot<string> {
        descent: string;

    }

    export interface IPersonDelivery extends IAggregateRoot<string> {
        deliveryId: string;
        firstName: String;
        lastName: String;
        admissionDate: Date;

    }

    export interface IPersonMedicationActive extends IAggregateRoot<string> {

        date: string;
        drugNameId: string;
        drugOptionId: string;
        personId: string;

    }


    export interface IBirthOutcome extends IAggregateRoot<string> {

        status: string;
        weight: number;
        action: string;
        gender: string;

    }



    export interface IDeliveryService extends data.IAggregateRootService<IDelivery, string> {
        current: (personId: string) => ng.IPromise<IDelivery>;
        getByPncId: (pncId: string) => ng.IPromise<IDelivery>;
        getPendingPnc: (personId: string) => ng.IPromise<Array<IDelivery>>;
        getActivePhase: (deliveryId: string) => ng.IPromise<IActivePhase>;
        checkDilatation: (deliveryId: string, cervixId: string) => ng.IPromise<IDilatationStatus>;
        checkDescent: (deliveryId: string, cervixId: string) => ng.IPromise<IDescentStatus>;
        getLabourStages: (deliveryId: string) => ng.IPromise<ILabourStage>;
        getPersonMedications: (deliveryId: string) => ng.IPromise<IPersonMedication>;
        getActiveLabourPhaseDeliveries: () => ng.IPromise<IPersonDelivery>;
    }

    interface IDeliveryResource extends IResourceService<IDelivery> {
        current: ng.resource.IResourceMethod<IDelivery>;
        getByPncId: ng.resource.IResourceMethod<IDelivery>;
        getPendingPnc: ng.resource.IResourceArrayMethod<IDelivery>;
        getActivePhase: ng.resource.IResourceMethod<IActivePhase>;
        checkDilatation: ng.resource.IResourceMethod<IDilatationStatus>;
        checkDescent: ng.resource.IResourceMethod<IDescentStatus>;
        getLabourStages: ng.resource.IResourceMethod<ILabourStage>;
        getPersonMedications: ng.resource.IResourceMethod<IPersonMedication>;
        getActiveLabourPhaseDeliveries: ng.resource.IResourceMethod<IPersonDelivery>;
    }

    class DeliveryService extends EntityService<IDelivery, string, IDeliveryResource> implements IDeliveryService {

        static $inject = ["DeliveryResource"];
        constructor(private resource: IDeliveryResource) {
            super(resource);
        }
        current = (personId: string): ng.IPromise<IDelivery> => {
            return this.getResource().current({ personId: personId }).$promise;
        }

        getByPncId = (pncId: string): ng.IPromise<IDelivery> => {
            return this.getResource().getByPncId({ pncId: pncId }).$promise;
        }

        getPendingPnc = (personId: string): ng.IPromise<Array<IDelivery>> => {
            return this.getResource().getPendingPnc({ personId: personId }).$promise;
        }

        getActivePhase = (deliveryId: string): ng.IPromise<IActivePhase> => {
            return this.getResource().getActivePhase({ deliveryId: deliveryId }).$promise;
        }

        checkDilatation = (deliveryId: string, cervixId: string): ng.IPromise<IDilatationStatus> => {
            return this.getResource().checkDilatation({ deliveryId: deliveryId, cervixId: cervixId }).$promise;
        }

        checkDescent = (deliveryId: string, cervixId: string): ng.IPromise<IDescentStatus> => {
            return this.getResource().checkDescent({ deliveryId: deliveryId, cervixId: cervixId }).$promise;
        }

        getLabourStages = (deliveryId: string): ng.IPromise<ILabourStage> => {
            return this.getResource().getLabourStages({ deliveryId: deliveryId }).$promise;
        }

        getPersonMedications = (deliveryId: string): ng.IPromise<IPersonMedication> => {
            return this.getResource().getPersonMedications({ deliveryId: deliveryId }).$promise;
        }

        getActiveLabourPhaseDeliveries = (): ng.IPromise<IPersonDelivery> => {
            return this.getResource().getActiveLabourPhaseDeliveries({}).$promise;
        }

    }

    app.factory("DeliveryResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IDeliveryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/deliveries/:id");

            return <IDeliveryResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "current": {
                    url: mrs.config.Settings.serverResource("api/deliveries/people/:personId/current"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getByPncId": {
                    url: mrs.config.Settings.serverResource("api/pncs/:pncId/delivery"),
                    method: "GET", isArray: false,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getPendingPnc": {
                    url: mrs.config.Settings.serverResource("api/deliveries/people/:personId/pending-pnc"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }, "getActivePhase": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/status"),
                    method: "GET", isArray: false,
                }, "checkDilatation": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/dilatation-status/:cervixId"),
                    method: "GET", isArray: false,
                }, "checkDescent": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/descent-status/:cervixId"),
                    method: "GET", isArray: false,
                },

                "getLabourStages": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/labour-stages"),
                    method: "GET", isArray: false,

                }, "getPersonMedications": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/labour-medication"),
                    method: "GET", isArray: false,
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(copy.date);
                        return angular.toJson(copy);
                    }
                },
                "getActiveLabourPhaseDeliveries": {
                    url: mrs.config.Settings.serverResource("api/deliveries/people/active-phase"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateFromServer(data.date);
                            data.time = DateUtils.convertDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("DeliveryService", DeliveryService);

}