namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IReport {
        name: string;
        id: string;
        group: string;
        frequency: string;
    }

    export interface IReportService {
        getReportGroups(): ng.IPromise<Array<string>>;
        getGroupReports(group: string): ng.IPromise<Array<IReport>>;
        getReport(reportId: string, from: Date, to: Date): ng.IPromise<any>;
        generateWeeklyReport(reportId: string, week: number, year: number): ng.IPromise<any>;
    }

    class ReportService implements IReportService {

        static $inject = ["$http", "$q"];
        constructor(private http: ng.IHttpService,
            private q: ng.IQService) {

        }

        getReportGroups = (): ng.IPromise<Array<string>> => {
            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/reports/report-groups");

            this.http.get(url).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        getGroupReports = (group: string): ng.IPromise<Array<IReport>> => {
            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/reports/report-groups/" + group);

            this.http.get(url).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        getReport = (reportId: string, from: Date, to: Date): ng.IPromise<any> => {
            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/reports/" + reportId);

            this.http.get(url, {
                params: {
                    from: from,
                    to: to,
                    format: "pdf"
                }
            }).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        generateWeeklyReport = (reportId: string, week: number, year: number): ng.IPromise<any> => {
            let defer = this.q.defer();

            let url = mrs.config.Settings.serverResource("api/reports/weekly/" + reportId);

            this.http.get(url, {
                params: {
                    week: week,
                    year: year,
                    format: "pdf"
                }
            }).then((response) => {
                defer.resolve(response.data);
            }, (error) => {
                defer.reject(error);
            });

            return defer.promise;

        }

        blobToFile = (theBlob: Blob, fileName: string): File => {
            let b: any = theBlob;
            // A Blob() is almost a File() - it's just missing the two properties below which we will add
            b.lastModifiedDate = new Date();
            b.name = fileName;

            // Cast to a File() type
            return <File>theBlob;
        }
    }

    app.service("ReportService", ReportService);

}