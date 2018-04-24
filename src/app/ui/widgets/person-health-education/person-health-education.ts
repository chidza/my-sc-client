namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonHealthEducationDialog extends ng.IController {
        closed: () => void;
        saved: (personHealthEducationId: Object) => void;
    }

    class Controller implements IPersonHealthEducationDialog {
        personHealthEducationId: string;
        personHealthEducation = {} as data.IPersonHealthEducation;
        datePickerOpenStatus = {};
        healthEducationTopicId: string;
        personId: string;
        date: string;
        healthEducationTopic: data.IHealthEducationTopic;
        public closed: () => void;
        public saved: (personHealthEducationId: Object) => void;
        educationTypes: Array<String> = ["INDIVIDUAL", "GROUP"];
        static $inject = ["PersonHealthEducationService", "HealthEducationTopicService"];
        constructor(private personHealthEducationService: data.IPersonHealthEducationService,
            private healthEducationTopicsService: data.IHealthEducationTopicService) {

        }

        $onInit = () => {
            console.log("here h;lkdhlaskdfhskl jthis");
            console.log(this);
            if (this.personHealthEducationId) {
                this.personHealthEducationService.get(this.personHealthEducationId).then((response) => {
                    this.personHealthEducation = response;
                    this.healthEducationTopicsService.get(response.healthEducationTopicId).then((response) => {
                        this.healthEducationTopic = response;
                    });
                }, (error) => {
                     if (this.date) {
                    this.personHealthEducation.date  = new Date(this.date);
                } else {
                     this.personHealthEducation.date = new Date();
                }
                    this.personHealthEducation.personId = this.personId;
                    this.personHealthEducation.type = "INDIVIDUAL";
                    this.personHealthEducation.healthEducationTopicId = this.healthEducationTopicId;
                    this.healthEducationTopicsService.get(this.healthEducationTopicId).then((response) => {
                        this.healthEducationTopic = response;
                    });
                });

            }
        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            if (this.personHealthEducation.id) {
                this.personHealthEducationService.update(this.personHealthEducation).then((response) => {
                    this.saved({ personHealthEducationId: response.id });
                });
            } else {
                this.personHealthEducationService.save(this.personHealthEducation).then((response) => {
                    this.saved({ personHealthEducationId: response.id });
                });
            }

        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-health-education/person-health-education.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personHealthEducationId: "<",
                healthEducationTopicId: "<",
                personId: "<",
                saved: "&",
                closed: "&",
                date: "<"
            };

        }
    }

    app.component("mrsPersonHealthEducationDialog", new Component());

}
