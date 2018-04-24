namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IFetalHeartRateGraph extends ng.IController {

    }

    class Controller implements IFetalHeartRateGraph {


        data: Array<any>;
        personId: string;
        deliveryId: string;
        vitalId: string;

        // resource acquisition parameters
        activePhaseDateTimes: data.IActivePhase;
        dateStart: string;
        dateEnd: string;
        dateStartActive: string;
        dateEndActive: string;
        timeStart: string;
        timeEnd: string;
        intervals: Array<string>;
        ActivePhaseFetalHeartRate: Array<data.ILaborActivePhaseVitalIntervalList>;


        // graph plotting letiables
        config = {};
        vitalListTime: Array<any>;
        vitalListValue: Array<any>;
        vitalName: string;
        vitalSymbol: string;
        vitalColor: string;
        vitalColorList: Array<any>;

        // graph shells to make the graph dynamic


        VitalMin: number;
        VitalMax: number;


        text: string;
        subtext: string;

        lineConfig = {};
        lineOption = {};




        static $inject = ["UnitService", "VitalService", "EncounterVitalService", "dialogs", "PersonVitalService", "DeliveryService", "LaborActivePhaseVitalService", "DateUtils"];
        constructor(
            private unitService: data.IUnitService,
            private vitalService: data.IVitalService,
            private encounterVitalService: data.IEncounterVitalService,
            private dialog: ng.dialogservice.IDialogService,
            private personVitalService: data.IPersonVitalService,
            private deliveryService: data.IDeliveryService,
            private getLabourStageService: data.ILaborActivePhaseVitalService,
            private utils: utils.IDateUtils

        ) {


            this.vitalListTime = [];
            this.vitalListValue = [];
            this.vitalColorList = [];
            this.intervals = [];



        }

        // #TODO get person id 
        // get delivery id
        // use clive service to get labor stage times
        // use person id and labor stage times via active-labor-stage-vitals service
        // format and place in graph array
        // enjoy!

        // getting deliveryid using current service



        $onInit = () => {



            this.deliveryService.current(this.personId).then((response) => {
                this.deliveryId = response.id;


                console.log("this.deliveryId");
                console.log(this.deliveryId);
                // using clive service now!

                this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                    this.activePhaseDateTimes = response;

                    //  this.intervals = response.times;
                    response.times.forEach((row) => {
                        this.intervals.push(moment(row).format("HH:mm"));
                    });




                    if (this.activePhaseDateTimes) {



                        if (this.activePhaseDateTimes.startTime)
                            this.dateStartActive = this.activePhaseDateTimes.startTime;

                        if (this.activePhaseDateTimes.endTime)
                            this.dateEndActive = this.activePhaseDateTimes.endTime;



                        // using active phase times to get vitals now
                        if (this.dateStartActive) {
                     /*       this.getLabourStageService.getVitalIntervals(this.deliveryId, this.personId, this.vitalId, this.dateStartActive, this.dateEndActive).then((response) => {
                                // got vitals now i have to package them in arrays by name: 
                                this.orderFetalHeartRateByName(response);

                            });*/
                        }
                    }


                });

            });




        }



        insertGraphTitleAndSubTitle = (name: string): { text: string; subtext: string; } => {

            return {
                text: name,
                subtext: "graph of " + name + ""
            };
        }



        orderFetalHeartRateByName = (vitals: Array<data.ILaborActivePhaseVitalIntervalList>) => {

            // use vital service to get vitals 
            // resolve the name
            // service brings one set of vital type therefore no need to group
            // resolve units 
            // resolve boundery lines 

            this.vitalService.get(this.vitalId).then((response) => {


                this.vitalName = response.name;
                this.VitalMax = response.maximum;
                this.VitalMin = response.minimum;


                this.unitService.get(response.unitId).then((unitresponse) => {

                    this.vitalSymbol = unitresponse.name;

                    for (let key in vitals) {
                        if (vitals.hasOwnProperty(key)) {

                            if (vitals[key]) {
                                this.vitalListTime.push(moment(vitals[key].time).format("HH:mm"));



                                // convert string time to date string 
                                // use time formatting to add intervals using data type "time" on graph property
                                this.vitalListValue.push(vitals[key].value);

                                this.loadGraph2(this.vitalName, this.vitalSymbol, this.VitalMin, this.VitalMax);

                            }


                        }
                    }


                });


            });




        }




        loadGraph2 = (vitalName: string, vitalSymbol: string, min: number, max: number) => {




            this.lineConfig = {
                animation: true,
                theme: "roma",

                dataLoaded: true
            };

            this.lineOption = {
                title: {
                    text: vitalName,
                    subtext: "Graph of " + vitalName
                },
                color: ["rgb(25, 183, 207)"],

                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    data: [vitalName]
                },
                calculable: true,
                visualMap: {
                    show: false,
                    pieces: [{
                        gt: min,
                        lte: max,
                        color: "#096"
                    }],
                    outOfRange: {
                        color: "#991a00"
                    }
                },


                xAxis: [
                    {
                        name: "time/hr",
                        nameLocation: "end",
                        type: "category",
                        boundaryGap: false,
                        silent: true,
                        backgroundColor: "#008000",
                        splitNumber: 10,
                        axisLine: { onZero: false },
                        data: this.vitalListTime,
                        splitLine: { show: true },
                        splitArea: { show: false }
                    }
                    ,
                ],
                yAxis: [
                    {


                        type: "value",
                        smooth: true,
                        min: 80,
                        max: 200,
                        interval: 10,
                        axisLine: { onZero: false },
                        axisLabel: {
                            formatter: "{value}" + vitalSymbol
                        }




                    }
                ],

                dataZoom: [{
                    type: "slider",
                    show: true,
                    height: 30,

                    bottom: 5,
                    /*     start: 0,
                         end: 80,*/
                    startValue: 0,
                    endValue: 10,



                }],
                series: [
                    {
                        name: [vitalName],
                        type: "line",
                        symbolSize: 10,
                        symbol: "circle",
                        smooth: true,
                        data: this.vitalListValue,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        itemStyle: {
                            normal: {
                                opacity: 1
                            }
                        },



                        markLine: {
                            data: [
                                { name: "DANGER LINE: UPPER LIMIT", xAxis: 0, yAxis: max },
                                { name: "DANGER LINE: LOWER LIMIT", xAxis: 0, yAxis: min }


                            ],
                            itemStyle: {
                                normal: {
                                    color: ["rgb(220,20,60)"]
                                }
                            },
                        }
                    }
                ]
            };


        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/fetal-heart-rate-graph/graph.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",

                vitalId: "<"
            };

        }
    }

    app.component("mrsFetalHeartRateGraph", new Component());

}