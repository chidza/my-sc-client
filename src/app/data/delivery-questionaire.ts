namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IDeliveryQuestionaire extends IAggregateRoot<string> {
        name: string;
        type: string;

    }
    export interface IDeliveryQuestionaireData extends IAggregateRoot<string> {
        deliveryQuestionareId: string;
        deliveryId: string;

    }

    export interface IDeliveryQuestionaireService extends data.IAggregateRootService<IDeliveryQuestionaire, string> {
        query: (text?: string) => ng.IPromise<Array<IDeliveryQuestionaire>>;
        getByType(type: string): ng.IPromise<Array<IDeliveryQuestionaire>>;
    }

    interface IDeliveryQuestionaireResource extends IResourceService<IDeliveryQuestionaire> {
        getByType: ng.resource.IResourceMethod<Array<IDeliveryQuestionaire>>;
    }

    class DeliveryQuestionaireService extends EntityService<IDeliveryQuestionaire, string, IDeliveryQuestionaireResource> implements IDeliveryQuestionaireService {

        static $inject = ["DeliveryQuestionaireResource"];
        constructor(private resource: IDeliveryQuestionaireResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IDeliveryQuestionaire>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByType = (type: string): ng.IPromise<Array<IDeliveryQuestionaire>> => {
            return this.getResource().getByType({ type: type }).$promise;
        }

    }

    app.factory("DeliveryQuestionaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IDeliveryQuestionaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/delivery-questionares/:id");

            return <IDeliveryQuestionaireResource>$resource(resourceUrl, {}, {
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
                }
                ,
                "getByType": {
                    url: mrs.config.Settings.serverResource("api/delivery-questionares/getByType/:type"),
                    method: "GET", isArray: true
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

    app.service("DeliveryQuestionaireService", DeliveryQuestionaireService);

}