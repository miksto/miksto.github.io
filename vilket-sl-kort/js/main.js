
let solutionBuilder = createSolutionBuilder(singleJourneyTicket, travelCards)

$(document).ready(function () {
    populateTicketsTable()
    updateCalculations()
    setupListeners()
})

function setupListeners() {
    $('#nrDaysInput').on('input', function () {
        let nrOfDays = getNumberOfDays()
        let travelsPerDay = getTravelsPerDay()
        if (nrOfDays > 0 && travelsPerDay > 0) {
            $('#totalTravelsCount').prop('value', nrOfDays * travelsPerDay)
            updateCalculations()
        }
    });

    $('#travelsPerDayInput').on('input', function () {
        let nrOfDays = getNumberOfDays()
        let travelsPerDay = getTravelsPerDay()
        if (nrOfDays > 0 && travelsPerDay > 0) {
            $('#totalTravelsCount').prop('value', nrOfDays * travelsPerDay)
            updateCalculations()
        }
    });

    $('#totalTravelsCount').on('input', function () {
        let nrOfDays = getNumberOfDays()
        let totalTravels = getTotalTravelsCount()

        if (nrOfDays > 0 && totalTravels > 0) {
            let travelsPerDay = (totalTravels / nrOfDays).toFixed(1)
            $('#travelsPerDayInput').prop('value', travelsPerDay)
            updateCalculations()
        }
    });


    $('#button-show-remaining-options').on('click', function () {
        $('#remaining-options').animate({ height: "toggle" }, 200, () => {
            let isVisible = $('#remaining-options').is(":visible")
            if (isVisible) {
                $('#button-show-remaining-options').text("Dölj fler alternativ")
            } else {
                $('#button-show-remaining-options').text("Visa fler alternativ")
            }
        });
    })
}

function getNumberOfDays() {
    return parseInt($("#nrDaysInput").val())
}

function getTravelsPerDay() {
    return parseInt($("#travelsPerDayInput").val())
}

function getTotalTravelsCount() {
    return parseInt($("#totalTravelsCount").val())
}

function populateTicketsTable() {
    $('#ticketsTable tbody tr').remove()
    let allTickets = [...travelCards, singleJourneyTicket]
    allTickets.forEach(ticket => {
        let row = $('<tr>');
        row.append($('<td>').html(ticket.title));
        row.append($('<td class="sized-table-column">').text(formatPrice(ticket.priceFull)));
        row.append($('<td class="sized-table-column">').text(formatPrice(ticket.priceReduced)));
        $('#ticketsTable').append(row);
    });
}


function updateCalculations() {
    let nrOfDays = getNumberOfDays()
    let totalTravelsCount = getTotalTravelsCount()

    if (nrOfDays > 0 && totalTravelsCount > 0) {
        let allOptions = solutionBuilder.generateAllSolutions(nrOfDays, totalTravelsCount)
        displaySolutions(allOptions)
    }
}

function displaySolutions(solutions) {
    solutions.sort((a, b) => a.totalCostFull - b.totalCostFull)
    let cheapestSolution = solutions.shift()

    $('#calculatorResultTable tbody tr').remove()
    $('#best-option-ticket-desciption').html(`${formatOptionDescription(cheapestSolution)}`)
    $('#best-option-ticket-total-cost-full').html(formatPrice(cheapestSolution.totalCostFull))
    $('#best-option-ticket-total-cost-reduced').html(formatPrice(cheapestSolution.totalCostReduced))

    solutions.forEach(option => {
        let row = $('<tr>');
        row.append($('<td class="optionDescription">').html(formatOptionDescription(option)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostFull)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostReduced)));

        $('#calculatorResultTable').append(row);
    })
}

