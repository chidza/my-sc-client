namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IZepiQuestionaire extends IAggregateRoot<string> {
        name: string;
        type: string;
        state: boolean;

    }
    export interface IZepiQuestionaireData extends IAggregateRoot<string> {
        zepiQuestionareId: string;
        zepiId: string;

    }

    export interface IZepiQuestionaireService extends data.IAggregateRootService<IZepiQuestionaire, string> {
        query: (text?: string) => ng.IPromise<Array<IZepiQuestionaire>>;
        getByType(type: string): ng.IPromise<Array<IZepiQuestionaire>>;
    }

    interface IZepiQuestionaireResource extends IResourceService<IZepiQuestionaire> {
        getByType: ng.resource.IResourceMethod<Array<IZepiQuestionaire>>;
    }

    class ZepiQuestionaireService extends EntityService<IZepiQuestionaire, string, IZepiQuestionaireResource> implements IZepiQuestionaireService {

        static $inject = ["ZepiQuestionaireResource"];
        constructor(private resource: IZepiQuestionaireResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IZepiQuestionaire>> => {
            return this.getResource().query({ text: name }).$promise;
        }

        getByType = (type: string): ng.IPromise<Array<IZepiQuestionaire>> => {


            return this.getResource().getByType({ type: type }).$promise;
        }

    }

    app.factory("ZepiQuestionaireResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            dateUtils: utils.IDateUtils): IZepiQuestionaireResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-questionnaires/:id");

            return <IZepiQuestionaireResource>$resource(resourceUrl, {}, {
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


                    url: mrs.config.Settings.serverResource("api/imnci-questionnaires/getByType/:type"),
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

    app.service("ZepiQuestionaireService", ZepiQuestionaireService);

}