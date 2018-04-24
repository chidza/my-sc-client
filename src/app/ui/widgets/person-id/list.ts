
namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPersonIdList extends ng.IController {
    addPersonIdentifier: () => void;
    editPersonIdentifier: (personPersonIdId: Object) => void;
  }

  class Controller implements IPersonIdList {

    public addPersonIdentifier: () => void;
    public editPersonIdentifier: (personPersonIdId: Object) => void;
    personId: string;
    ids: Array<data.IPersonId>;
    idList: Array<data.IPersonIdentifier>;

    static $inject = ["PersonIdService", "PersonIdentifierService", "dialogs"];
    constructor(
      private personIdService: data.IPersonIdService,
      private personIdentifierService: data.IPersonIdentifierService,
      private dialog: ng.dialogservice.IDialogService
    ) {

    }

    init = () => {
      this.personIdService.getByPersonId(this.personId).then((response) => {
        this.ids = response;
      
      });

      this.personIdentifierService.query().then((response) => {
        this.idList = response;
      
      });
    }


    $onInit = () => {
      this.init();
    }

    getName = (id: string) => {
      let name = "";
      if (this.idList) {
        this.idList.forEach((type) => {

          if (type.id === id) {
            name = type.name;
          }
        });
      }

      return name;
    }

    add = () => {
      this.addPersonIdentifier();
    }

    edit = (id: String) => {
      this.editPersonIdentifier({ personIdentifierId: id });
    }

    remove = (id: string) => {

      let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

      dlg.result.then((btn) => {
        this.personIdService.remove(id).then((response) => {
          this.init();
        });
      }, (error) => {

      });
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/person-id/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        addPersonId: "&",
        editPersonId: "&",
        personId: "<",
        addPersonIdentifier: "&",
        editPersonIdentifier: "&"
      };

    }
  }

  app.component("mrsPersonIdentificationList", new Component());

}
