namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILaborActivePhaseVital extends IAggregateRoot<string> {
        date: Date;
        time: Date;
        value: string;
        personId: string;
        vitalId: string;
    }
    export interface ILaborActivePhaseVitalList extends ng.resource.IResource<ILaborActivePhaseVitalList> {
        date: Date;
        unit: string;
        name: string;
        id: string;
        value: string;
    }

    export interface ILaborActivePhaseVitalIntervalList extends ng.resource.IResource<ILaborActivePhaseVitalIntervalList> {
        time: Date;
        value: string;
    }

    export interface ILaborActivePhaseVitalBPList {
        time1: Date[];
        systolic: string[];
        diastolic: string[];
        time0: Date[];
        last: Date[];
        first: Date[];

    }



    export interface ILaborActivePhaseVitalService extends data.IAggregateRootService<ILaborActivePhaseVital, string> {

        getByPersonIdAndDateTimeBetween(personId: string, from: string, to: string): ng.IPromise<Array<ILaborActivePhaseVitalList>>;

        findForGraphsByDeliveryId(deliveryId: string, vitalId: string, start: string, end: string): ng.IPromise<Array<ILaborActivePhaseVitalList>>;


        findForBpGraphByDeliveryId(deliveryId: string, vitalId: string, start: string, end: string): ng.IPromise<Array<ILaborActivePhaseVitalBPList>>;


    }

    interface ILaborActivePhaseVitalResource extends IResourceService<ILaborActivePhaseVital> {

        getByPersonIdAndDateTimeBetween: ng.resource.IResourceArrayMethod<ILaborActivePhaseVitalList>;
        findForGraphsByDeliveryId: ng.resource.IResourceArrayMethod<ILaborActivePhaseVitalList>;
        findForBpGraphByDeliveryId: ng.resource.IResourceArrayMethod<ILaborActivePhaseVitalBPList>;




    }

    class LaborActivePhaseVitalService extends EntityService<ILaborActivePhaseVital, string, ILaborActivePhaseVitalResource> implements ILaborActivePhaseVitalService {

        static $inject = ["LaborActivePhaseVitalResource"];
        constructor(private resource: ILaborActivePhaseVitalResource) {
            super(resource);
        }



        getByPersonIdAndDateTimeBetween(personId: string, from: string, to: string): ng.IPromise<Array<ILaborActivePhaseVitalList>> {

            return this.getResource().getByPersonIdAndDateTimeBetween({
                personId: personId,
                from: from,
                to: to
            }).$promise;
        }




        findForGraphsByDeliveryId(deliveryId: string, vitalId: string, start: string, end: string): ng.IPromise<Array<ILaborActivePhaseVitalList>> {



            return this.getResource().findForGraphsByDeliveryId({
                deliveryId: deliveryId,
                vitalId: vitalId,
                start: start,
                end: end
            }).$promise;
        }



        findForBpGraphByDeliveryId(deliveryId: string, vitalId: string, start: string, end: string): ng.IPromise<Array<ILaborActivePhaseVitalBPList>> {



            return this.getResource().findForBpGraphByDeliveryId({
                deliveryId: deliveryId,
                vitalId: vitalId,
                start: start,
                end: end
            }).$promise;
        }

    }

    app.factory("LaborActivePhaseVitalResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): ILaborActivePhaseVitalResource => {

            let resourceUrl = mrs.config.Settings.serverResource("/api/deliveries/:id");

            return <ILaborActivePhaseVitalResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },


                "getByPersonIdAndDateTimeBetween": {
                    method: "GET", isArray: true,

                    url: mrs.config.Settings.serverResource("api/people/:personId/person-vitals-graph/:vitalId"),

                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },

                "findForGraphsByDeliveryId": {
                    method: "GET", isArray: true,


                    url: mrs.config.Settings.serverResource("api/people/:deliveryId/vitals/partogram/:vitalId"),


                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "findForBpGraphByDeliveryId": {
                    method: "GET", isArray: true,


                    url: mrs.config.Settings.serverResource("api/people/:deliveryId/vitals/partogram/:vitalId/bp"),


                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },



            });

        }]);

    app.service("LaborActivePhaseVitalService", LaborActivePhaseVitalService);

}