namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface ITbDialog extends ng.IController {
    savedTb: (tbId: Object) => void;
  }

  class Controller implements ITbDialog {
    public savedTb: (tbId: Object) => void;
    encounterId: string;
    personId: string;
    tb = {} as data.ITb;
    tbId: string;
    tbcategories: Array<data.ITbCategory> = [];
    datePickerOpenStatus = {};

    static $inject = ["TbService", "TbCategoryService", "TbVisitService"];
    constructor(private tbService: data.ITbService,
      private tbCategoryService: data.ITbCategoryService,
      private dialog: ng.dialogservice.IDialogService,
      private tbVisitService: data.ITbVisitService) {

    }

    $onInit = () => {

      this.tbService.current(this.personId).then((response) => {
        this.tb = response;
        this.tbId = this.tb.id;
        this.savedTb({ tbId: this.tb.id });
      }, (error) => {

        if ((angular.isDefined(error.status)) && (error.status === 404)) {

          this.tb.date = new Date();
          this.tb.personId = this.personId;
          this.tb.outcome = "CURRENT";
          this.tbService.save(this.tb).then((response) => {
            this.tb = response;
            this.tbId = this.tb.id;
            this.savedTb({ tbId: this.tb.id });
          }, () => {
            this.dialog.error("TB Registration", "Unable to initialise patient into TB program");
          });

        }

      });

      this.tbCategoryService.query("").then((response) => {
        this.tbcategories = response;
      });


    }

    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

    save = () => {
      this.tbService.update(this.tb).then((response) => { });
    }

    onSave = (promise: ng.IPromise<data.ITb>) => {
      promise.then((response) => { });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/tb/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        encounterId: "<",
        personId: "<",
        savedTb: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsTbDialog", new Component());

}