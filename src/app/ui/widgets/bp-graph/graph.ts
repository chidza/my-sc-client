namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IBpGraph extends ng.IController {

    }

    interface IMinMaxGraph extends ng.IController {
        min: number;
        max: number;
        intervalY: number;
        intervalX: number;
        lineArray: Array<any>;

    }

    class Controller implements IBpGraph {



        deliveryId: string;
        vitalId: string;
        pulseId: string;
        start: string;
        width: number;
        height: number;
        end: string;
        ActivePhaseVitals: Array<data.ILaborActivePhaseVitalList> = [];
        interval: number;
        activePhase: data.IActivePhase;
        times: Array<any> = [];
        ActivePhaseVitalsBP: Array<data.ILaborActivePhaseVitalBPList> = [];
        dataBpList: Array<any> = [];


        // graph plotting letiables
        config = {};
        vitalListTime: Array<any>;
        vitalListValue: Array<any>;
        vitalName: string;
        vitalSymbol: string;
        vitalColor: string;
        vital = {} as data.IVital;
        unit: data.IUnit;
        lines = {} as data.ICervixViewLines;


        // graph shells to make the graph dynamic
        VitalMin: number;
        VitalMax: number;
        text: string;
        subtext: string;


        lineConfig = {};
        lineOption = {};




        static $inject = ["CervixService", "DeliveryService", "UnitService", "VitalService", "PersonVitalService", "LaborActivePhaseVitalService", "DateUtils"];
        constructor(

            private cervixService: data.ICervixService,
            private deliveryService: data.IDeliveryService,
            private unitService: data.IUnitService,
            private vitalService: data.IVitalService,
            private personVitalService: data.IPersonVitalService,
            private getVitalsForActiveLabourStageService: data.ILaborActivePhaseVitalService,
            private utils: utils.IDateUtils

        ) {


            this.vitalListTime = [];
            this.vitalListValue = [];



        }



        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            if (this.vitalId) {
                this.vitalService.get(this.vitalId).then((response) => {
                    this.vital = response;
                    this.vitalName = response.name;
                    this.VitalMax = response.maximum;
                    this.VitalMin = response.minimum;

                    this.unitService.get(this.vital.unitId).then((unitresponse) => {
                        this.vitalSymbol = unitresponse.name;
                    });
                });
            }




            if (this.deliveryId && this.start && this.vitalId) {

                this.cervixService.getCervixesGraphLines(this.deliveryId).then((response) => {

                    if (this.end) {
                        this.lines = response;
                    }



                });


                this.getVitalsForActiveLabourStageService.findForBpGraphByDeliveryId(this.deliveryId, this.vitalId, this.start, this.end).then((response) => {

                    // getting bp data
                    this.ActivePhaseVitalsBP = response;


                    this.getDataArray(response);


                    this.getVitalsForActiveLabourStageService.findForGraphsByDeliveryId(this.deliveryId, this.pulseId, this.start, this.end).then((response) => {

                        this.ActivePhaseVitals = response;
                        // getting pulse data

                        this.loadGraph2();

                    });

                });




            }


        }

        getClosePartogramLine = (endTime: string): {} => {


            if (endTime) {

                return {
                    normal: {
                        color: "black",
                        width: 5

                    }
                };



            }
            else {
                return {
                    normal: {
                        color: "transparent",
                        width: 5

                    }
                };

            }

        }




        getDataArray = (bpList: Array<data.ILaborActivePhaseVitalBPList>) => {


            for (let key in bpList) {
                if (bpList.hasOwnProperty(key)) {

                    if (bpList[key]) {

                        this.dataBpList.push(bpList[key].first, bpList[key].systolic, bpList[key].diastolic,
                            bpList[key].time0, bpList[key].time1,
                            bpList[key].last);


                    }


                }
            }





        }






        getMinMaxYValues = (vitalId: string): IMinMaxGraph => {

            let minMax: IMinMaxGraph = { min: 0, max: 0, intervalY: 0, intervalX: 0, lineArray: [] };

            if (this.pulseId) {
                minMax.max = 180;
                minMax.min = 40;
                minMax.intervalY = 10;
                minMax.intervalX = 30 * 60 * 1000;
                if (this.end) {
                    minMax.lineArray = this.lines.CloseFetalHeartRateAndPulse;
                }
            }
            else {
                minMax.max = 200;
                minMax.min = 40;
                minMax.intervalY = 10;
                minMax.intervalX = 30 * 60 * 1000;
                if (this.end) {
                    minMax.lineArray = this.lines.CloseFetalHeartRateAndPulse;
                }
            }

            /*  switch (this.pulseId) {
 
                 case this.pulseId:
                     minMax.max = 180;
                     minMax.min = 40;
                     minMax.intervalY = 10;
                     minMax.intervalX = 30 * 60 * 1000;
                     if (this.end) {
                         minMax.lineArray = this.lines.CloseFetalHeartRateAndPulse;
                     }
 
                     break;
 
 
                 case vitalId:
                     minMax.max = 200;
                     minMax.min = 40;
                     minMax.intervalY = 10;
                     minMax.intervalX = 30 * 60 * 1000;
                     if (this.end) {
                         minMax.lineArray = this.lines.CloseFetalHeartRateAndPulse;
                     }
 
                     break;
             } */

            return minMax;

        }

        getClosePartogramNotifier = (endTime: string): {} => {


            if (endTime) {

                return {
                    silent: true,
                    itemStyle: {
                        normal: {
                            color: "transparent",
                            opacity: 0.1

                        }
                    },
                    label: {
                        normal: {
                            formatter: "Partogram Closed",
                            textStyle: {
                                align: "center",
                                fontSize: 70,
                                color: "black"
                            }
                        }
                    },
                    data: [[{
                        name: "Partogram Closed",
                        xAxis: "min",
                        yAxis: this.VitalMin
                    }, {
                        xAxis: "max",
                        yAxis: this.VitalMax
                    }]]
                };
            }



        }

        loadGraph2 = () => {



            this.lineConfig = {
                animation: true,
                theme: "roma",
                dataLoaded: true,

            };

            this.lineOption = {



                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    data: ["BP", "Pulse"],
                    selectedMode: false,
                    top: 20


                },
                grid: {
                    right: 30
                },
                silent: true,

                visualMap: {
                    show: false,
                    pieces: [{
                        gt: 80,
                        lte: 140,
                        color: "blue"
                    }],
                    outOfRange: {
                        color: "#991a00"
                    }
                },


                xAxis: [
                    {
                        name: "time/hr",
                        nameLocation: "end",
                        type: "time",
                        smooth: true,
                        axisLine: { onZero: false },
                        interval: this.getMinMaxYValues(this.vitalId).intervalX,
                        splitLine: { show: true },
                        splitArea: { show: false },
                        axisLabel: {

                            rotate: 45,
                            show: true,
                            silent: true,
                            formatter: function (value: any) {



                                return moment(value).format("HH:mm");




                            }

                        },
                    }

                ],
                yAxis: [
                    {

                        name: "BP |<--->| Pulse O ",
                        nameTextStyle: {
                            fontStyle: "bold",
                            fontSize: 15,
                        },
                        nameLocation: "middle",
                        type: "value",
                        smooth: true,
                        nameGap: 37,
                        silent: true,
                        max: this.getMinMaxYValues(this.vitalId).max,
                        min: this.getMinMaxYValues(this.vitalId).min,
                        boundaryGap: [0, "100%"],
                        interval: this.getMinMaxYValues(this.vitalId).intervalY,
                        axisLine: { onZero: false }

                    }
                ],
                series: [

                    {
                        name: "Closed line",
                        type: "line",
                        symbolSize: 1,
                        symbol: "pin",

                        smooth: true,

                        data: this.getMinMaxYValues(this.vitalId).lineArray.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        lineStyle: this.getClosePartogramLine(this.end),
                        itemStyle: this.getClosePartogramLine(this.end),

                    },

                    {
                        name: "BP",
                        type: "line",
                        silent: true,

                        symbolSize: 12,
                        symbol: "diamond",
                        smooth: true,
                        data: this.dataBpList,

                        lineStyle: {
                            normal: {

                                width: 3,
                                type: "dashed"
                            }
                        },
                        itemStyle: {
                            normal: {

                                barBorderRadius: 0,
                                label: {
                                    show: false,
                                    silent: true,

                                    position: "bottom",

                                }
                            }
                        },



                        markArea: this.getClosePartogramNotifier(this.end),

                    },
                    {
                        name: "Pulse",
                        type: "line",
                        symbolSize: 12,
                        symbol: "circle",
                        selectedMode: false,
                        smooth: true,
                        data: this.ActivePhaseVitals.map(function (item) {
                            return {
                                name: item.value,
                                value: [item.date, item.value]
                            };
                        }),
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




                        markArea: this.getClosePartogramNotifier(this.end),


                    }
                ]
            };


        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/vitals-graph/graph.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                interval: "<",
                vitalId: "<",
                pulseId: "<",
                start: "<",
                end: "<",
                width: "<",
                height: "<"
            };

        }
    }

    app.component("mrsBpGraph", new Component());

}