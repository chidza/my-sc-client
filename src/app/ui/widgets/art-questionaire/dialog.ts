
namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IArtQuestionaire extends ng.IController {

  }


  class Controller implements IArtQuestionaire {
    encounterId: string;
    personId: string;
    categoryName: string;
    artQuestionMedicalList: Array<data.IArtQuestionaire> = [];
    artQuestionList: Array<data.IArtQuestionaire> = [];
    artTypeList: Array<IArtQuestionaire>;
    artServicesList: Array<any>;
    artModel = {} as data.IArtQuestionaireData;
    artModelList: Array<data.IArtQuestionaireData>;
    artId: string;
    dataList: any;




    public saved: () => void;

    public closed: () => void;

    static $inject = ["ArtQuestionaireService", "ArtCurrentSignService", "ArtCurrentSymptomService", "ArtMedicalHistoryService", "filterFilter"];

    constructor(

      private artQuestionaireService: data.IArtQuestionaireService,
      private artCurrentSignService: data.IArtCurrentSignService,
      private artCurrentSymptomService: data.IArtCurrentSymptomService,
      private artMedicalHistoryService: data.IArtMedicalHistoryService,

    ) {


      this.artServicesList = [{ id: "MEDICAL", name: this.artMedicalHistoryService }, { id: "SYMPTOM", name: this.artCurrentSymptomService }, { id: "SIGN", name: this.artCurrentSignService }];

    }
    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.InitFirst();
    }


    InitFirst = () => {
      if (this.categoryName && this.artId) {
        this.artQuestionaireService.getByType(this.categoryName).then((response) => {
          this.artQuestionMedicalList = response;
          this.init();
        });
      }


    }


    initList = () => {
      this.artQuestionMedicalList.forEach((oi) => {
        for (let i = 0; i < this.artModelList.length; i++) {
          if (oi.id === this.artModelList[i].artQuestionareId) {
            oi.state = true;
          }
        }
      });


    }



    getServiceByCategory = (): any => {
      let result = "";
      this.artQuestionList = [];
      if (this.artServicesList != null) {
        this.artServicesList.forEach((service) => {
          if (service.id === this.categoryName) {
            result = service.name;
          }
        });

      }

      return result;

    }

    init = (): void => {
      this.artModelList = [];
      switch (this.categoryName) {

        case "SIGN":
          this.artCurrentSignService.getByArtId(this.artId).then((response) => {
            this.artModelList = response;
            this.initList();
          });
          break;

        case "SYMPTOM":
          this.artCurrentSymptomService.getByArtId(this.artId).then((response) => {
            this.artModelList = response;
            this.initList();
          });
          break;

        case "MEDICAL":
          this.artMedicalHistoryService.getByArtId(this.artId).then((response) => {
            this.artModelList = response;
            this.initList();
          });
          break;
        default:
          console.log("category id non-existant");
          break;
      }
    }

    getSectionId = (id: string): string => {
      let result = "";
      this.artModelList.forEach((model) => {
        if (model.artQuestionareId === id) {
          result = model.id;
        }
      });
      return result;
    }


    save = (q: data.IArtQuestionaire) => {
      this.artModel.artId = this.artId;
      if (q.state === true) {
        this.artModel.artQuestionareId = q.id;
        this.getServiceByCategory().save(this.artModel).then((response: any) => {
          this.saved();
        });

      }
      else {
        this.getServiceByCategory().remove(this.getSectionId(q.id)).then((response: any) => {
        });
      }

    }


    onSave = (promise: ng.IPromise<any>) => {
      promise.then((response) => {
        if (this.saved != null) {
          this.saved();
        }
      }, () => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/art-questionaire/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        categoryName: "@",
        artId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsArtQuestionaireDialog", new Component());

}
