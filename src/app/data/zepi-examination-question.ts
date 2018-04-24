namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IZepiExaminationQuestion extends IAggregateRoot<string> {
        zepiExaminationQuestionId: string;
        zepiVisitId: string;
        value: string;
    }

    export interface IZepiExaminationQuestionService extends data.IAggregateRootService<IZepiExaminationQuestion, string> {
        getByzepiExaminationQuestionId: (zepiExaminationQuestionId: string) => ng.IPromise<Array<IZepiExaminationQuestion>>;
    }

    interface IZepiExaminationQuestionResource extends IResourceService<IZepiExaminationQuestion> {
        getByzepiExaminationQuestionId: ng.resource.IResourceMethod<Array<IZepiExaminationQuestion>>;
    }

    class ZepiExaminationQuestionService extends EntityService<IZepiExaminationQuestion, string, IZepiExaminationQuestionResource> implements IZepiExaminationQuestionService {

        static $inject = ["ZepiExaminationQuestionResource"];
        constructor(private resource: IZepiExaminationQuestionResource) {
            super(resource);
        }

        getByzepiExaminationQuestionId = (zepiExaminationQuestionId: string): ng.IPromise<Array<IZepiExaminationQuestion>> => {
            return this.getResource().getByzepiExaminationQuestionId({ zepiExaminationQuestionId: zepiExaminationQuestionId }).$promise;
        }

    }

    app.factory("ZepiExaminationQuestionResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IZepiExaminationQuestionResource => {
            let resourceUrl = mrs.config.Settings.serverResource("api/imnci-examination-questions/:id");

            return <IZepiExaminationQuestionResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: false },

                "getByzepiExaminationQuestionId": {

                    url: mrs.config.Settings.serverResource("api/imnci-examination-questions/:imnciQuestionnaireId"),
                    method: "GET", isArray: true,
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);

                        }
                        return data;
                    }
                }
                ,

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

    app.service("ZepiExaminationQuestionService", ZepiExaminationQuestionService);

}