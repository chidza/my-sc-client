
namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);


  interface IInfantResuscitation extends ng.IController {
    closed: () => void;
    saved: (id: Object) => void;
  }


  class Controller implements IInfantResuscitation {
    childId: string;
    infantId: string;
    resuscitationItemList: Array<data.IResuscitationItem> = [];
    infantResuscitationList: Array<data.IInfantResuscitation> = [];
    infantResuscitation: data.IInfantResuscitation;
    public saved: (id: Object) => void;
    public closed: () => void;

    static $inject = ["ResuscitationItemService", "InfantResuscitationService", "InfantService"];
    constructor(private resuscitationItemService: data.IResuscitationItemService,
      private infantResuscitationService: data.IInfantResuscitationService,
      private infantService: data.IInfantService
    ) {

    }


    $onInit = () => {
      this.resuscitationItemService.query().then((response) => {
        this.resuscitationItemList = response;
      });
      this.infantService.getByChildId(this.childId).then((response) => {
        this.infantId = response.id;
        this.infantResuscitationService.getByInfant(response.id).then((response) => {
          this.infantResuscitationList = response;
        });
      });
    }

    save = (resuscitation: any, event: any) => {

      if (event.target.checked) {

        let item = {
          infantId: this.infantId,
          resuscitationItemId: resuscitation.id,
          value: ""
        } as data.IInfantResuscitation;

        this.infantResuscitationService.save(item).then((response) => {

        }, (error) => {
          console.log(error);
        });
      } else {
        this.infantResuscitationService.getByInfantAndResuscitation(this.infantId, resuscitation.id).then((response) => {
          console.log(event.target.checked);
          this.infantResuscitationService.remove(response.id).then((response) => {
            console.log(response);
          });
        }, (error) => {
          console.log(error);
        });
      }

    }

    pairCheckListItems = (id: string): boolean => {
      let state = false;
      this.infantResuscitationList.forEach((row) => {
        if (row.resuscitationItemId === id) {
          state = true;
        }
      });
      return state;
    }

    reloadResuscitationList = () => {
      this.resuscitationItemService.query().then((response) => {
        this.resuscitationItemList = response;
      });
    }

    doIfChecked = (e: any) => {
      console.log(e);
    }

    getLabel = (label: string): string => {
      return label.replace(/_/g, " ");
    }

    close = () => {
      this.closed();
    }

  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/infant-Resuscitation/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        childId: "<",
        saved: "&",
        closed: "&"
      };

    }
  }

  app.component("mrsInfantResuscitationDialog", new Component());

}
