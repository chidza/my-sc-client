namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IFrequency extends IAggregateRoot<string> {
        code: string;
        description: string;
        name: string;
        numberPerDay: number;
        standardId: string;
    }

    export interface IFrequencyService extends data.IAggregateRootService<IFrequency, string> {
        query: (text?: string) => ng.IPromise<Array<IFrequency>>;
    }

    interface IFrequencyResource extends IResourceService<IFrequency> {

    }

    class FrequencyService extends EntityService<IFrequency, string, IFrequencyResource> implements IFrequencyService {

        static $inject = ["FrequencyResource"];
        constructor(private resource: IFrequencyResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IFrequency>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("FrequencyResource", ["$resource",
        ($resource: ng.resource.IResourceService): IFrequencyResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/frequencies/:id");

            return <IFrequencyResource>$resource(resourceUrl, {}, {
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

    app.service("FrequencyService", FrequencyService);

}