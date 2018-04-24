namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDeliverySummary extends IAggregateRoot<string> {
        assistedBy: string;
        bloodLoss: number;
        bpAfterDeliveryId: string;
        bpAfterHrDeliveryId: string;
        deliveredBy: string;
        estimatedBloodLoss: number;
        measuredBloodLoss: number;
        methodOfRepair: string;
        pph: string;
        pulseAfterDeliveryId: string;
        pulseAfterHrDeliveryId: string;
        repairedBy: string;
        sutureType: string;
        tempAfterDeliveryId: string;
        totalBloodLoss: number;
        uterusContracted: string;
        degreeId: string;
        perineum: string;
        skinToSkin: boolean;
    }

    export interface IDeliverySummaryService extends data.IAggregateRootService<IDeliverySummary, string> {
        query: (text?: string) => ng.IPromise<Array<IDeliverySummary>>;
    }

    interface IDeliverySummaryResource extends IResourceService<IDeliverySummary> {

    }

    class DeliverySummaryService extends EntityService<IDeliverySummary, string, IDeliverySummaryResource> implements IDeliverySummaryService {

        static $inject = ["DeliverySummaryResource"];
        constructor(private resource: IDeliverySummaryResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDeliverySummary>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("DeliverySummaryResource", ["$resource",
        ($resource: ng.resource.IResourceService): IDeliverySummaryResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/delivery-summaries/:id");

            return <IDeliverySummaryResource>$resource(resourceUrl, {}, {
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
            });

        }]);

    app.service("DeliverySummaryService", DeliverySummaryService);

}