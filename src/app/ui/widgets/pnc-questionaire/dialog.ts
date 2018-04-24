
namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPncQuestionaire extends ng.IController {

  }


  class Controller implements IPncQuestionaire {

    pncVisitId: string;
    categoryName: string;
    pncQuestionMedicalList: Array<data.IPncQuestionaire> = [];
    pncQuestionList: Array<data.IPncQuestionaire> = [];
    pncTypeList: Array<IPncQuestionaire>;
    pncId: string;
    pncPropertyList: Array<data.IPncProperty>;
    pncProperty = {} as data.IPncProperty;
    pncPropertyValue: string;


    static $inject = ["PncVisitService", "PncQuestionaireService", "PncPropertyService"];

    constructor(
      private pncVisitService: data.IPncVisitService,
      private pncQuestionaireService: data.IPncQuestionaireService,

      private pncPropertyService: data.IPncPropertyService,


    ) { }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {
      if (this.pncVisitId) {

        this.pncPropertyService.getByPncVisitId(this.pncVisitId).then((response) => {
          this.pncPropertyList = response;
          this.pncQuestionaireService.getByType(this.categoryName).then((response) => {
            this.pncQuestionMedicalList = response;

          });
        });
      }

    }

    getLabel = (label: string): string => {
      return label.replace(/_/g, " ");
    }




    isExist = (question: data.IPncQuestionaire): boolean => {
      let checked = false;
      this.pncPropertyList.forEach((type) => {
        if (type.pncQuestionareId === question.id) {
          checked = true;
        }
      });
      return checked;
    }
    save = (item: data.IPncQuestionaire) => {
      if (this.isExist(item) === true) {
        this.pncPropertyService.removeQuestion(this.pncVisitId, item.id).then((response) => {
        });
      }
      else {
        this.pncPropertyService.add(this.pncVisitId, item.id).then((response) => {
        });

      }

    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/pnc-questionaire/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        pncVisitId: "<",
        categoryName: "@",
        pncId: "<"

      };

    }
  }

  app.component("mrsPncQuestionaireDialog", new Component());

}
