namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPartogramNote extends IAggregateRoot<string> {
        date: Date;
        deliveryId: string;
        note: number;
        id: string;
    }



    export interface IPartogramNoteService extends data.IAggregateRootService<IPartogramNote, string> {
        getPartogramNotes: (deliveryId: string) => ng.IPromise<Array<IPartogramNote>>;
        getPartogramNotesByDeliveryIdAndDate: (deliveryId: string, date: string) => ng.IPromise<Array<IPartogramNote>>;

    }

    interface IPartogramNoteResource extends IResourceService<IPartogramNote> {
        getPartogramNotes: ng.resource.IResourceMethod<Array<IPartogramNote>>;
        getPartogramNotesByDeliveryIdAndDate: ng.resource.IResourceMethod<Array<IPartogramNote>>;

    }

    class PartogramNoteService extends EntityService<IPartogramNote, string, IPartogramNoteResource> implements IPartogramNoteService {

        static $inject = ["PartogramNoteResource"];
        constructor(private resource: IPartogramNoteResource) {
            super(resource);
        }

        getPartogramNotes = (deliveryId: string): ng.IPromise<Array<IPartogramNote>> => {
            return this.getResource().getPartogramNotes({ deliveryId: deliveryId }).$promise;
        }

        getPartogramNotesByDeliveryIdAndDate = (deliveryId: string, date: string): ng.IPromise<Array<IPartogramNote>> => {
            return this.getResource().getPartogramNotesByDeliveryIdAndDate({ deliveryId: deliveryId, date: date }).$promise;
        }

    }

    app.factory("PartogramNoteResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, DateUtils: utils.IDateUtils): IPartogramNoteResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/partogram-notes/:id");

            return <IPartogramNoteResource>$resource(resourceUrl, {}, {
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
                },
                "getPartogramNotes": {
                    method: "GET", isArray: true,
                    url: mrs.config.Settings.serverResource("api/partogram-notes/deliveries/:deliveryId"),
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(data.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = DateUtils.convertLocalDateTimeToServer(data.date);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = DateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "checkPartogramNotesByDeliveryAndDateTime": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/partogram-notes/check-partogram-notes/:date"),
                    method: "GET", isArray: false,
                },
                "getPartogramNotesByDeliveryIdAndDate": {
                    url: mrs.config.Settings.serverResource("api/deliveries/:deliveryId/partogram/partogram-notes/date/:date"),
                    method: "GET",
                    isArray: true,
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
    app.service("PartogramNoteService", PartogramNoteService);

}