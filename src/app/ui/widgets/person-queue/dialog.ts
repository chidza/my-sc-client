namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IOpdQueueDialog extends ng.IController {
        closed: () => void;
        saved: () => void;
    }

    class Controller implements IOpdQueueDialog {
        public closed: () => void;
        public saved: () => void;
        personQueue = {} as data.IOpdQueue;
        queues: Array<data.IQueueList> = [];
        personId: string;
        personQueuesList: Array<data.IQueue> = [];

        static $inject = ["OpdQueueService", "QueueService"];
        constructor(private opdQueueService: data.IOpdQueueService,
            private queueService: data.IQueueService) {

        }

        $onInit = () => {

            this.queueService.getAll({ page: 0, size: 32000 }).then((response) => {
                this.queues = response.content;

            });

            if (this.personId) {
                this.opdQueueService.queues(this.personId).then((response) => {
                    this.personQueuesList = response;
                });
            }
        }

        save = (id: string) => {
            let opdQueueId = "";
            if (this.isExist(id) === true) {
                opdQueueId = this.getOpdQueueId(id);
                this.opdQueueService.removePersonFromQueue(this.personId, opdQueueId).then((r) => {
                    // this.init();
                });


            } else {
                this.personQueue.queueId = id;
                this.personQueue.date = new Date();
                this.personQueue.personId = this.personId;
                this.opdQueueService.save(this.personQueue).then((response) => {
                    // this.saved();
                    // this.init();
                });

            }

        }

        getOpdQueueId = (id: string): string => {
            let opdQueueId = "";
            if (this.personQueuesList != null) {
                this.personQueuesList.forEach((queue) => {
                    if (queue.id === id) {
                        opdQueueId = queue.id;
                    }
                });

            }
            return opdQueueId;
        }

        isExist = (id: string): boolean => {
            let checked = false;
            if (this.personQueuesList != null) {
                this.personQueuesList.forEach((queue) => {
                    if (queue.id === id) {
                        checked = true;
                    }
                });

            }
            return checked;
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-queue/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                closed: "&",
                saved: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsOpdQueueDialog", new Component());

}
