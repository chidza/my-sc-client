namespace mrs.utils {
    "use strict";

    declare let SockJS: any;
    declare let Stomp: any;

    let app = angular.module(mrs.appName);

    export interface IWebSocketService {
        message: (data: Object) => void;
        connect(): void;
        disconnect(): void;
        send(topic: string, data: any): void;
        subscribe(topic: string): void;
        unsubscribe(): void;
    }

    class WebSocketService implements IWebSocketService {

        private stompClient: any = null;
        private subscriber: any = null;
        private connected: ng.IDeferred<any> = this.$q.defer();

        public message: (admissionId: Object) => void;

        constructor(private $q: ng.IQService, private AuthServerProvider: security.IAuthServerProvider) { }

        connect = () => {

            let url = mrs.config.Settings.serverResource("websocket/tracker").replace("http:", "");

            let authToken = this.AuthServerProvider.getToken();

            if (authToken) {
                url += "?access_token=" + authToken;
            }

            let socket = new SockJS(url);

            this.stompClient = Stomp.over(socket);

            let headers = {};

            this.stompClient.connect(headers, () => {
                this.connected.resolve("success");
                // this.sendActivity();
            });

        }

        disconnect = () => {
            if (this.stompClient !== null) {
                this.stompClient.disconnect();
                this.stompClient = null;
            }
        }

        send = (topic: string, data: any) => {
            if (this.stompClient !== null && this.stompClient.connected) {
                this.stompClient.send(topic, {}, angular.toJson(data));
            }
        }

        subscribe = (topic: string) => {

            this.connected.promise.then(() => {
                this.subscriber = this.stompClient.subscribe(topic, (data: any) => {
                    if (this.message) {
                        this.message(angular.fromJson(data.body));
                    }
                });
            }, (null), null);
        }

        unsubscribe = () => {
            if (this.subscriber !== null) {
                this.subscriber.unsubscribe();
            }
        }

    }

    app.factory("WebSocketService", ["$q", "AuthServerProvider",
        ($q: ng.IQService, AuthServerProvider: security.IAuthServerProvider): WebSocketService => {

            return new WebSocketService($q, AuthServerProvider);

        }]);


}