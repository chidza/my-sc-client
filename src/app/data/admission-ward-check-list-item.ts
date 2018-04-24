namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAdmissionWardCheckListItem extends IAggregateRoot<string> {
        admissionWardCheckListId: string;
        value: string;
        wardCheckListItemId: string;
    }


    export interface IAdmissionWardCheckListItemService extends data.IAggregateRootService<IAdmissionWardCheckListItem, string> {
        saveMultiple: (admissionWardCheckListId: string, admissionWardCheckListItemDTOs: Array<IAdmissionWardCheckListItem>) => ng.IPromise<Array<IAdmissionWardCheckListItem>>;
    }

    interface IAdmissionWardCheckListItemResource extends IResourceService<IAdmissionWardCheckListItem> {
        saveMultiple: ng.resource.IResourceArrayMethod<IAdmissionWardCheckListItem>;
    }

    class AdmissionWardCheckListItemService extends EntityService<IAdmissionWardCheckListItem, string, IAdmissionWardCheckListItemResource> implements IAdmissionWardCheckListItemService {
        
        saveMultiple = (admissionWardCheckListId: string, admissionWardCheckListItemDTOs: Array<IAdmissionWardCheckListItem>): ng.IPromise<Array<IAdmissionWardCheckListItem>> => {
            return this.getResource().saveMultiple({ admissionWardCheckListId: admissionWardCheckListId }, admissionWardCheckListItemDTOs).$promise;
        }
        static $inject = ["AdmissionWardCheckListItemResource"];
        constructor(private resource: IAdmissionWardCheckListItemResource) {
            super(resource);
        }

    }

    app.factory("AdmissionWardCheckListItemResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): IAdmissionWardCheckListItemResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/admission-ward-check-list-items/:id");

            return <IAdmissionWardCheckListItemResource>$resource(resourceUrl, {}, {
                "saveMultiple": {
                    method: "POST",
                    url: mrs.config.Settings.serverResource("api/admission-ward-check-lists/:admissionWardCheckListId/save-multiple"),
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    }
                },
                "query": { method: "GET", isArray: true },
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
                }

            });

        }]);

    app.service("AdmissionWardCheckListItemService", AdmissionWardCheckListItemService);

}