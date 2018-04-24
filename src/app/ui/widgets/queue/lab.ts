namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ILaboratoryInvestigationSearch extends ng.IController {
        personSelected: (personId: Object) => void;
    }

    class Controller implements ILaboratoryInvestigationSearch {
        people: Array<data.IPerson> = [];

        queueId: string;

        public personSelected: (personId: Object) => void;

        static $inject = ["LabInvestigationService", "DateUtils", "SiteSettingService"];
        constructor(private labInvestigationService: data.ILabInvestigationService
            , private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService) {

        }

        $onInit = () => {
            this.siteSettingService.currentTime().then((response) => {
                let ct = response.currentTime;
                const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                let from = moment(new Date(myDate)).format("YYYY-MM-DDT00:00:00");
                let a: moment.Moment = moment(from);
                let to = a.date(a.daysInMonth()).format("YYYY-MM-DDTHH:mm:00");
                this.labInvestigationService.getLabInvestigationBydate(from, to).then((response) => {
                    this.people = response;
                }, (error) => {
                    console.log(error);
                });
            });

        }

        onPersonSelected = (person: data.IPerson) => {
            this.personSelected({ personId: person.id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/queue/lab.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                queueId: "<",
                personSelected: "&"
            };

        }
    }

    app.component("mrsLaboratoryInvestigationSearch", new Component());

}
