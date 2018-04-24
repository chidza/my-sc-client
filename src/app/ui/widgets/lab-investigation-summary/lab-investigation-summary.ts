namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ILabInvestigationSummary extends ng.IController {
        openFile: (labInvestigationId: Object) => void;
    }


    class Controller implements ILabInvestigationSummary {

        personId: string;
        model: Array<data.ILabInvestigationList>;

         public openFile: (labInvestigationId: Object) => void;

        static $inject = ["LabInvestigationService", "DateUtils", "SiteSettingService"];
        constructor(private labInvestigationService: mrs.data.ILabInvestigationService,
            private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.personId) {
                this.siteSettingService.currentTime().then((response) => {
                    let ct = response.currentTime;
                    const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                    let from = moment(new Date(myDate)).format("YYYY-MM-DDT00:00:00");
                    let a: moment.Moment = moment(from);
                    let to = a.date(a.daysInMonth()).format("YYYY-MM-DDTHH:mm:00");

                    this.labInvestigationService.getLabInvestigationByPerson(this.personId, from, to).then((response) => {
                        this.model = response;
                        console.log(this.model);
                    });

                });

            }
        }

        onTestSelected = (labInvestigation: data.ILabInvestigationList) => {
            this.openFile({ labInvestigationId: labInvestigation.labInvestigationId });
        }
    }

    class Component implements ng.IComponentOptions {
        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/widgets/lab-investigation-summary/lab-investigation-summary.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                openFile: "&"
            };
        }
    }

    app.component("mrsLabInvestigationSummary", new Component());

} 