namespace mrs.config {
    "use strict";



    export interface IVersion {
        MAJOR: string;
        MINOR: string;
        REVISION: string;
    }

    export class Settings {

        static serverResource(api: string): string {

            let loc: Location = window.location;

            let url = loc.protocol + "//" + loc.hostname + ":8070/";

            return url + api;

        }

        static get Version(): IVersion {
            return {
                MAJOR: "2",
                MINOR: "0",
                REVISION: "0"
            };
        }




    }

}
