namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ILaborActivePhaseMedication extends IAggregateRoot<string> {
        date: Date;
        time: Date;
        personMedicationId: string;
        quantity: number;
        strength: string;
        dispenseId: string;
        name: string;
        formulation: string;
        units: string;
        frequency: string;

    }

    export interface IMedicationView {
        date: Date;
        time: Date;
        personMedicationId: string;
        quantity: number;
        strength: string;
        dispenseId: string;
        name: string;
        formulation: string;
        units: string;
        frequency: string;
    }

    export interface IMedicationList extends ng.resource.IResource<IMedicationList> {
        drugs: Array<IDrugName>;
        time: string;

    }

    export interface IMedicationListData {
        time: string;
        result: string;
        frequency: string;
    }


    export interface ILaborActivePhaseMedicationService extends data.IAggregateRootService<ILaborActivePhaseMedication, string> {
        getByDeliveryIdAndDateTimeBetween(deliveryId: string, start: Date, end: Date): ng.IPromise<Array<IMedicationList>>;
    }




    interface ILaborActivePhaseMedicationResource extends IResourceService<ILaborActivePhaseMedication> {
        getByDeliveryIdAndDateTimeBetween: ng.resource.IResourceArrayMethod<IMedicationList>;
    }

    class LaborActivePhaseMedicationService extends EntityService<ILaborActivePhaseMedication, string, ILaborActivePhaseMedicationResource> implements ILaborActivePhaseMedicationService {

        static $inject = ["LaborActivePhaseMedicationResource"];
        constructor(private resource: ILaborActivePhaseMedicationResource) {
            super(resource);
        }

        getByDeliveryIdAndDateTimeBetween(deliveryId: string, start: Date, end: Date): ng.IPromise<Array<IMedicationList>> {
            return this.getResource().getByDeliveryIdAndDateTimeBetween({
                deliveryId: deliveryId,
                start: start,
                end: end
            }).$promise;
        }

    }

    app.factory("LaborActivePhaseMedicationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): ILaborActivePhaseMedicationResource => {
            let resourceUrl = mrs.config.Settings.serverResource("/api/deliveries/:id");

            return <ILaborActivePhaseMedicationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },

                "getByDeliveryIdAndDateTimeBetween": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("/api/deliveries/:deliveryId/partogram/medications"),

                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("LaborActivePhaseMedicationService", LaborActivePhaseMedicationService);

}