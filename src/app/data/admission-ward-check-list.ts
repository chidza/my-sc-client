namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAdmissionWardCheckList extends IAggregateRoot<string> {
        admissionWardId: string;
        wardCheckListId: string;
    }

    export interface IAdmissionWardCheckListService extends data.IAggregateRootService<IAdmissionWardCheckList, string> {
        createMultipleWardCheckListItems: (admissionWardCheckList: IAdmissionWardCheckList, wardCheckListItemDTO: any) => ng.IPromise<IAdmissionWardCheckList>;
    }

    interface IAdmissionWardCheckListResource extends IResourceService<IAdmissionWardCheckList> {
        createMultipleWardCheckListItems: ng.resource.IResourceArrayMethod<any>;
    }

    class AdmissionWardCheckListService extends EntityService<IAdmissionWardCheckList, string, IAdmissionWardCheckListResource> implements IAdmissionWardCheckListService {

        static $inject = ["AdmissionWardCheckListResource"];
        constructor(private resource: IAdmissionWardCheckListResource) {
            super(resource);
        }

        createMultipleWardCheckListItems = (admissionWardCheckList: IAdmissionWardCheckList, wardCheckListItemDTO: IAdmissionWardCheckListItem): ng.IPromise<any> => {
            console.log(admissionWardCheckList, "admissionWardCheckList");
            console.log(wardCheckListItemDTO, "wardCheckListItemDTO");
            return this.getResource().createMultipleWardCheckListItems(admissionWardCheckList, wardCheckListItemDTO).$promise;
        }

    }

    app.factory("AdmissionWardCheckListResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): IAdmissionWardCheckListResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/admission-ward-check-lists/:id");

            return <IAdmissionWardCheckListResource>$resource(resourceUrl, {}, {
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
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "createMultipleWardCheckListItems": {
                    method: "POST",
                    url: mrs.config.Settings.serverResource("api/admission-ward-check-lists/admission-ward-check-list-items"),
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                }

            });

        }]);

    app.service("AdmissionWardCheckListService", AdmissionWardCheckListService);

}