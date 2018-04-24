namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IMaternalDeathHistoryDialog extends ng.IController {

  }

  class Controller implements IMaternalDeathHistoryDialog {
    maternalDeathId: string;
    maternalDeathHistorys: Array<data.IMaternalDeathHistory> = [];
    maternalDeathQuestionaire: Array<data.IMaternalDeathFactor> = [];
    categoryName: string;

    static $inject = ["MaternalDeathHistoryService", "MaternalDeathFactorService"];
    constructor(private maternalDeathHistoryService: data.IMaternalDeathHistoryService,
      private maternalDeathQuestionaireService: data.IMaternalDeathFactorService) {

    }

    $onInit = () => {
      this.refresh();

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.refresh();
    }

    refresh = () => {
      if (this.maternalDeathId) {
        this.maternalDeathHistoryService.getByMaternalDeathId(this.maternalDeathId).then((response) => {
          this.maternalDeathHistorys = response;


          if (this.maternalDeathId) {
            this.maternalDeathQuestionaireService.query().then((response) => {
              this.maternalDeathQuestionaire = response;

            });
          }
        });
      }
    }

    isExist = (question: data.IMaternalDeathFactor): boolean => {
      let checked = false;
      this.maternalDeathHistorys.forEach((type) => {
        if (type.maternalDeathFactorId === question.id) {
          checked = true;
        }
      });
      return checked;
    }
    save = (item: data.IMaternalDeathFactor) => {
      if (this.isExist(item) === true) {
        this.maternalDeathHistoryService.removeQuestion(this.maternalDeathId, item.id).then((response) => {
        });
      }
      else {
        this.maternalDeathHistoryService.add(this.maternalDeathId, item.id).then((response) => {
        });

      }

    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/maternal-death-factors-questionaire/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        maternalDeathId: "<",
        saved: "&",
        closed: "&",
        categoryName: "@"
      };

    }
  }

  app.component("mrsMaternalDeathHistoryDialog", new Component());

}