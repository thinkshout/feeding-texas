highchartsConfig: function() {
    var model = this.model.toJSON();

    Highcharts.setOptions({
        colors: ['#f7a35c', '#7cb5ec', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
        credits: {
            enabled: false
        },
        title: {
            text: null
        },
        tooltip: {
            enabled: false,
        },
        chart: {
            animation: false,
            spacing: [0, 0, 0, 0]
        },
        plotOptions: {
            pie: {
                size: 150,
                center: ['50%', '50%'],
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%'
                }
            }
        }
    });

    $('#percenteligible').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Eligible', parseFloat(model.totalIncomeEligibleIndividuals) ],
                ['Not Eligible', parseFloat(model.totalIncomeEligibleIndividuals) ]
            ]
        }]
    });

    $('#percentreceiving').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Receiving', parseFloat(model.totalSnapRecipients) ],
                ['Not Receiving', parseFloat(model.totalIncomeEligibleButNotReceiving) ]
            ]
        }]
    });

    $('#percentages').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Children', parseFloat(model.incomeEligible0To17) + parseFloat(model.incomeEligibleButNotReceiving0To17) ],
                ['Adults', parseFloat(model.incomeEligible18To64) + parseFloat(model.incomeEligibleButNotReceiving18To64) ],
                ['Seniors', parseFloat(model.incomeEligible65Plus) + parseFloat(model.incomeEligibleButNotReceiving65Plus) ]
            ]
        }]
    });

    $('#percentbenefits').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Covered', parseFloat(model.averageBenefitperMeal) ],
                ['Not Covered', parseFloat(model.weightedCostPerMeal)-parseFloat(model.averageBenefitperMeal) ]
            ]
        }]
    });

    $('#percentrcvrace').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['White', parseFloat(model.recipientRaceWhite) ],
                ['Black', parseFloat(model.recipientRaceBlack) ],
                ['Native American', parseFloat(model.recipientRaceNativeAmerican) ],
                ['Asian', parseFloat(model.recipientRaceAsian) ],
                ['Pacific Islander', parseFloat(model.recipientRacePacificIslander) ],
                ['Multi-race', parseFloat(model.recipientRaceMultiRace) ],
                ['Unknown/Missing', parseFloat(model.recipientRaceUnknownMissing) ]
            ]
        }]
    });

    $('#percentrcvworking').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Working', parseFloat(model.householdIncomeWithEarnedIncome) ],
                ['Non-Working', 1 - parseFloat(model.householdIncomeWithEarnedIncome) ]
            ]
        }]
    });

    $('#percentrcvage').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Children', parseFloat(model.recipients0To17) ],
                ['Adults', parseFloat(model.recipients18To64) ],
                ['Seniors', parseFloat(model.recipients65Plus) ]
            ]
        }]
    });

    $('#percentrcvethnicity').highcharts({
        series: [{
            type: 'pie',
            data: [
                ['Hispanic', parseFloat(model.recipientEthnicityHispanic) ],
                ['Non-Hispanic', parseFloat(model.recipientEthnicityNonHispanic) ],
                ['Unknown/Missing', parseFloat(model.recipientEthnicityUnknownMissing) ]
            ]
        }]
    });
};