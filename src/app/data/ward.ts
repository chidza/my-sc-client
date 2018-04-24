namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IWard extends IAggregateRoot<string> {
        id: string;
        name: string;
        departmentId?: string;
        type: string;
        beds: number;
    }

    export interface IWardList {
        id: string;
        name?: string;
        departmentName?: string;
        type: string;
    }

    export interface IWardService extends data.IAggregateRootService<IWard, string> {
        query: (text?: string) => ng.IPromise<Array<IWard>>;
        list: (text?: string) => ng.IPromise<Array<IWardList>>;
    }

    interface IWardResource extends IResourceService<IWard> {

    }

    class WardService extends EntityService<IWard, string, IWardResource> implements IWardService {

        static $inject = ["WardResource", "$q", "DepartmentService"];
        constructor(private resource: IWardResource,
            private q: ng.IQService,
            private departmentService: IDepartmentService) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IWard>> => {
            return this.getResource().query({ text: text }).$promise;
        }

        list = (text?: string): ng.IPromise<Array<IWardList>> => {

            let defer = this.q.defer();

            this.q.all<IWard[], IPageReponse<IDepartment>>([
                this.getResource().query({ text: text }).$promise,
                this.departmentService.query("", { size: 32000 })
            ]).then((response) => {

                let result: Array<IWardList> = [];

                response[0].forEach((ward) => {

                    let entry: IWardList = {
                        id: ward.id,
                        name: ward.name,
                        type: ward.type
                    };

                    response[1].content.forEach((department) => {
                        if (department.id === ward.departmentId) {
                            entry.departmentName = department.name;
                        }
                    });

                    result.push(entry);

                });

                defer.resolve(result);

            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

    }

    app.factory("WardResource", ["$resource",
        ($resource: ng.resource.IResourceService): IWardResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/wards/:id");

            return <IWardResource>$resource(resourceUrl, {}, {
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

    app.service("WardService", WardService);

}