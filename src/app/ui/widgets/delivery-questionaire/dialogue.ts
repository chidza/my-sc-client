namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IAncHistoryDialog extends ng.IController {

    }

    class Controller implements IAncHistoryDialog {
        ancId: string;
        ancHistorys: Array<data.IAncHistory> = [];
        ancQuestionaire: Array<data.IAncQuestionaire> = [];
        categoryName: string;
        deliveryId: string;

        static $inject = ["AncService", "AncHistoryService", "AncQuestionaireService"];
        constructor(
            private ancService: data.IAncService,
            private ancHistoryService: data.IAncHistoryService,
            private ancQuestionaireService: data.IAncQuestionaireService,

        ) {

        }

        $onInit = () => {
            this.refresh();

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.refresh();
        }

        refresh = () => {

            if (this.deliveryId) {
                this.ancService.getByDelivery(this.deliveryId).then((response) => {
                    this.ancId = response.id;
                    this.ancHistoryService.getByAncId(this.ancId).then((response) => {
                        this.ancHistorys = response;
                        this.ancQuestionaireService.getByType(this.categoryName).then((response) => {
                            this.ancQuestionaire = response;
                        });

                    });
                }, (error) => {
                });

            }

        }

        isExist = (question: data.IAncQuestionaire): boolean => {
            let checked = false;
            this.ancHistorys.forEach((type) => {
                if (type.ancQuestionareId === question.id) {
                    checked = true;
                }
            });
            return checked;
        }
        save = (item: data.IAncQuestionaire) => {
            if (this.isExist(item) === true) {
                this.ancHistoryService.removeQuestion(this.ancId, item.id).then((response) => {
                });
            }
            else {
                this.ancHistoryService.add(this.ancId, item.id).then((response) => {
                });

            }

        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery-questionaire/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                ancId: "<",
                deliveryId: "<",
                saved: "&",
                closed: "&",
                categoryName: "@"
            };

        }
    }

    app.component("mrsDeliveryQuestionaireDialog", new Component());

}