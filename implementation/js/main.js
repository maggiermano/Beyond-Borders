/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let myTreeMapVis;
let myPeopleVis;
let myCompareStateVis;
let myClimateVis;

// load data using promises
let promises = [
    d3.csv("data/age.csv"),
    d3.csv("data/race.csv"),
    d3.json("data/industries.json"),
    d3.csv("data/crime.csv"),
    d3.csv("data/tax.csv"),
    d3.csv("data/climate.csv")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data);
    })
    .catch(function (err) {
        console.log(err);
    });

// initMainPage
function initMainPage(dataArray) {
    // log data
    // console.log('check out the data', dataArray);
    console.log("climate data", dataArray[5])

    // init peopleVis
    myPeopleVis = new PeopleVis('people-container', dataArray[0], dataArray[1]);
    myTreeMapVis = new TreeMapVis('treeMap-container', dataArray[2]);
    myClimateVis = new ClimateMapVis('climateMap-container', dataArray[5]);
    myCompareStateVis = new CompareStateVis('state-vis-container', null, dataArray[3], null, null, dataArray[2]);
    myCompareStateVis.setData(null, dataArray[3], null, null, dataArray[2]);
}