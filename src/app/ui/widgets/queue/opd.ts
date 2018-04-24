namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdQueue extends ng.IController {
        personSelected: (personId: Object) => void;
    }

    class Controller implements IOpdQueue {
        people: Array<data.IPerson> = [];

        queueId: string;

        public personSelected: (personId: Object) => void;

        static $inject = ["OpdQueueService"];
        constructor(private opdQueueService: data.IOpdQueueService) {

        }

        $onInit = () => {
            this.opdQueueService.people(this.queueId).then((response) => {
                this.people = response;
            }, (error) => {
                console.log(error);
            });
        }

        onPersonSelected = (person: data.IPerson) => {
            this.personSelected({ personId: person.id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/queue/opd.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                queueId: "<",
                personSelected: "&"
            };

        }
    }

    app.component("mrsOpdQueue", new Component());

}
