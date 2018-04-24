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

    static $inject = ["AncHistoryService", "AncQuestionaireService"];
    constructor(private ancHistoryService: data.IAncHistoryService,
      private ancQuestionaireService: data.IAncQuestionaireService) {

    }



    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.refresh();
    }

    refresh = () => {
      if (this.ancId) {
        this.ancHistoryService.getByAncId(this.ancId).then((response) => {
          this.ancHistorys = response;
          if (this.categoryName && this.ancId) {
            this.ancQuestionaireService.getByType(this.categoryName).then((response) => {
              this.ancQuestionaire = response;

            });
          }
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
      public templateUrl = "app/ui/widgets/anc-questionaire/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        ancId: "<",
        personId: "<",
        saved: "&",
        closed: "&",
        categoryName: "@"
      };

    }
  }

  app.component("mrsAncHistoryDialog", new Component());

}