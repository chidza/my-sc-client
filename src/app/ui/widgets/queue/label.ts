namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IQueueLabel extends ng.IController {

    }

    class Controller implements IQueueLabel {

        queueId: string;

        queue = {} as data.IQueue;

        count: number = 0;

        departmentName: string = "";

        static $inject = ["QueueService", "OpdQueueService", "DepartmentService"];
        constructor(private queueService: data.IQueueService,
            private opdQueue: data.IOpdQueueService,
            private departmentService: data.IDepartmentService
        ) {

        }

        $onInit = () => {
            this.queueService.get(this.queueId).then((response) => {
                this.queue = response;

                this.departmentService.get(response.departmentId).then((response) => {
                    this.departmentName = response.name;
                });

            }, (error) => {
                console.log(error);
            });

            this.opdQueue.people(this.queueId).then((response) => {
                this.count = response.length;
            }, (error) => {
                console.log(error);
            });
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/queue/label.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                queueId: "<"
            };

        }
    }

    app.component("mrsQueueLabel", new Component());

}
