namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IDispenseItemListList extends ng.IController {
    addDispenseItem: () => void;
    editDispenseItem: (personMedicationId: Object) => void;
  }

  class Controller implements IDispenseItemListList {

    personId: string;
    dispenseList: Array<data.IDispenseList> = [];

    public addDispenseItem: () => void;
    public editDispenseItem: (encounterComplaintId: Object) => void;

    static $inject = ["DispenseService", "dialogs"];
    constructor(private dispenseService: data.IDispenseService,
      private dialog: ng.dialogservice.IDialogService) {

    }

    init = () => {
      this.dispenseService.getDispenseItemsByPersonId(this.personId).then((response) => {
        this.dispenseList = response;
        console.log("response", response);
      }, (error) => {
        console.log(error);
      });
    }


    $onInit = () => {
      this.init();
    }

    add = () => {
      this.addDispenseItem();
    }

    edit = (id: String) => {
      this.editDispenseItem({ id: id });
    }
    delete = (id: string) => {

      let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

      dlg.result.then((btn) => {
        this.dispenseService.remove(id).then((response) => {
          this.init();
        });
      }, (error) => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/dispense/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "addDispenseItem": "&",
        "editDispenseItem": "&",
        "personId": "<"
      };

    }
  }

  app.component("mrsDispenseList", new Component());

}