namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPncSession {
        encounterId: string;
    }

    export interface IPncVisitModuleService {
        getCurrentPnc(personId: string): ng.IPromise<IPnc>;
        getPncSession(workareaId: string, personId: string): ng.IPromise<IPncVisit>;
    }

    class PncModuleService implements IPncVisitModuleService {

        pncId: string;
        pnc = {} as data.IPnc;
        opdId: string;

        static $inject = ["OpdService", "PncService", "PncVisitService", "$q"];
        constructor(private opdService: IOpdService,
            private pncService: IPncService,
            private pncVisitService: IPncVisitService,
            private q: ng.IQService) {

        }
        getCurrentPnc = (personId: string): ng.IPromise<IPnc> => {
            let defer = this.q.defer();

            this.pncService.current(personId).then((response) => {
                defer.resolve(response);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;
        }
        getPncSession = (workareaId: string, personId: string): ng.IPromise<IPncVisit> => {
            let defer = this.q.defer();
            this.opdService.current(personId).then((response) => {
                this.opdId = response.id;
                this.getCurrentPnc(personId).then((response) => {
                    this.pncVisitService.opdSession(this.opdId, workareaId, response.id).then((response) => {
                        defer.resolve(response);

                    }, (error) => {
                        defer.reject(error);
                    });
                });
            });
            return defer.promise;
        }
    }

    app.service("PncVisitModuleService", PncModuleService);

}