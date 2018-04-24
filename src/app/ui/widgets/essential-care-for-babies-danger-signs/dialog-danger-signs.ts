
namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPncQuestionaire extends ng.IController {

  }


  class Controller implements IPncQuestionaire {

    essentialBabyCareId: string;
    categoryName: string;
    pncQuestionMedicalList: Array<data.IPncQuestionaire> = [];
    pncQuestionList: Array<data.IPncQuestionaire> = [];
    pncTypeList: Array<IPncQuestionaire>;
    pncId: string;
    dangerSignsPropertyList: Array<data.IEssentialBabiesCareQuestionareList>;
    pncProperty = {} as data.IPncProperty;
    pncPropertyValue: string;


    static $inject = ["PncVisitService", "PncQuestionaireService", "EssentialBabiesCareService"];
    constructor(private pncVisitService: data.IPncVisitService,
      private pncQuestionaireService: data.IPncQuestionaireService,
      private essentialBabiesCareService: data.IEssentialBabiesCareService
    ) { }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }
    init = () => {
      this.pncQuestionaireService.getByType(this.categoryName).then((response) => {
        this.pncQuestionList = response;

      });
      if (this.essentialBabyCareId) {
        this.essentialBabiesCareService.getessentialBabiesCareDangerSigns(this.essentialBabyCareId).then((response) => {
          this.dangerSignsPropertyList = response;
        });
      }

    }

    getLabel = (label: string): string => {
      return label.replace(/_/g, " ");
    }




    isExist = (question: data.IPncQuestionaire): boolean => {
      let state = false;
      if (this.dangerSignsPropertyList) {
        this.dangerSignsPropertyList.forEach((row) => {
          if (row.id === question.id) {
            state = true;
          }
        });
      }

      return state;
    }

    save = (item: data.IPncQuestionaire, event: any) => {
      if (event.target.checked) {
        this.essentialBabiesCareService.addEssentialBabiesCareDangerSigns(this.essentialBabyCareId, item.id).then((response) => {

        }, (error) => {
          console.log(error);
        });
      } else {
        this.essentialBabiesCareService.removeEssentialBabiesCareDangerSigns(this.essentialBabyCareId, item.id).then((response) => {

        }, (error) => {
          console.log(error);
        });
      }

    }


  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/essential-care-for-babies-danger-signs/dialog-danger-signs.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        essentialBabyCareId: "<",
        categoryName: "@",
        pncId: "<"

      };

    }
  }

  app.component("mrsEssentialBabyCareQuestionaireDialog", new Component());

}
