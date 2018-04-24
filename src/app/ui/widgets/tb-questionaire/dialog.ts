namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ITbSurveyDialog extends ng.IController {

  }

  class Controller implements ITbSurveyDialog {
    tbId: string;
    tbSurveys: Array<data.ITbSurvey> = [];
    tbQuestionaire: Array<data.ITbQuestionaire> = [];
    categoryName: string;

    static $inject = ["TbSurveyService", "TbQuestionaireService"];
    constructor(private tbSurveyService: data.ITbSurveyService,
      private tbQuestionaireService: data.ITbQuestionaireService) {

    }

    $onInit = () => {
      this.refresh();

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.refresh();
    }

    refresh = () => {
      if (this.tbId) {
        this.tbSurveyService.getByTbId(this.tbId).then((response) => {
          this.tbSurveys = response;
          if (this.categoryName && this.tbId) {
            this.tbQuestionaireService.getByType(this.categoryName).then((response) => {
              this.tbQuestionaire = response;
            });
          }
        });
      }
    }

    isExist = (question: data.ITbQuestionaire): boolean => {
      let checked = false;
      this.tbSurveys.forEach((type) => {
        if (type.tbQuestionareId === question.id) {
          checked = true;
        }
      });
      return checked;
    }
    save = (item: data.ITbQuestionaire) => {
      if (this.isExist(item) === true) {
        this.tbSurveyService.removeQuestion(this.tbId, item.id).then((response) => {
        });
      }
      else {
        this.tbSurveyService.add(this.tbId, item.id).then((response) => {
        });

      }

    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/tb-questionaire/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        tbId: "<",
        saved: "&",
        closed: "&",
        categoryName: "@"
      };

    }
  }

  app.component("mrsTbSurveyDialog", new Component());

}