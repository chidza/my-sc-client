namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPartogramInformationList extends ng.IController {
    selected: (id: Object) => void;
    view: (id: Object) => void;
  }

  class Controller implements IPartogramInformationList {

    deliveryId: string;
    date: string;
    endTime: any;
    status: boolean;
    partogramInformationList = {} as Array<data.IPartogramInformation>;
    loggedOnUserId: string;
    userList = {} as Array<data.IUser>;
    currentDate: string;
    public selected: (id: Object) => void;
    public viewed: (id: Object) => void;
    static $inject = ["PartogramInformationService", "UserService", "Principal", "SiteSettingService"];
    constructor(private partogramInformationService: data.IPartogramInformationService,
      private userService: data.IUserService,
      private Principal: security.IPrincipal,
      private siteSettingService: data.ISiteSettingService) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      this.siteSettingService.currentTime().then((response) => {
        this.endTime = moment(response.currentTime);
      });

      this.userService.query().then((response) => {
        this.userList = response;
      });







      if (this.deliveryId) {
        this.partogramInformationService.getPartogramInformationByDeliveryId(this.deliveryId).then((response) => {



          // get all users
          this.partogramInformationList = response;
        });
      }
      this.Principal.identity().then((response) => {
        this.userService.get(response.login).then((response) => {
          this.loggedOnUserId = response.login;
        });

      });
    }

    getUserName = (userId: string): string => {

      let fullName = "";

      console.log("userId");
      console.log(userId);
      this.userList.forEach((survey) => {
        if (survey.login === userId) {
          // return the name

          fullName = survey.firstName + " " + survey.lastName;

        }
      });
      console.log("fullName");
      console.log(fullName);
      return fullName;
    }


    select = (item: data.IPartogramInformation) => {
      this.selected({ id: item.id });
    }

    view = (item: data.IPartogramInformation) => {
      this.viewed({ id: item.id });
    }

    subTime = (model: data.IPartogramInformation): boolean => {
      let date: string;
      date = model.date;
      let startTime = moment(date, "YYYY-MM-DDTHH:mm:ss");
      let duration = this.endTime.diff(startTime, "minutes");
      if (duration < 30) {
        this.status = false;
        if (this.loggedOnUserId === model.userId) {
          this.status = false;
        } else {
          this.status = true;
        }
      } else {
        this.status = true;
      }
      return this.status;
    }

    checkUser = (recordCreaterUserId: string) => {


    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/partogram/partogram-information/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        "selected": "&",
        "viewed": "&",
        deliveryId: "<"
      };

    }
  }

  app.component("mrsPartogramInformationList", new Component());

}