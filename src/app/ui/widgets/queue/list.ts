namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IQueueList extends ng.IController {
        queueSelected: (queueId: Object) => void;
    }

    class Controller implements IQueueList {
        queues: Array<data.IQueueList> = [];

        queueId: string;

        public queueSelected: (queueId: Object) => void;

        static $inject = ["QueueService"];
        constructor(private queueService: data.IQueueService) {

        }

        $onInit = () => {
            this.queueService.getAll({ page: 0, size: 32000 }).then((response) => {
                 this.queues = response.content;
            });
        }

        onQueueSelected = (queue: data.IQueue) => {
            this.queueSelected({ queueId: queue.id });
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/queue/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                queueId: "<",
                queueSelected: "&"
            };

        }
    }

    app.component("mrsQueueList", new Component());

}
