let singleTicket = {
    title: "Enkelbiljett 75 minuter",
    priceFull: 39,
    priceReduced: 26,
    days: 0
}

let dayTicket = {
    title: "24-timmarsbiljett",
    priceFull: 165,
    priceReduced: 110,
    days: 1
}

let tickets = [
    {
        title: "Årsbiljett",
        priceFull: 10190,
        priceReduced: 6830,
        days: 365
    },
    {
        title: "90&#8209;dagarsbiljett",
        priceFull: 2810,
        priceReduced: 1880,
        days: 90
    },
    {
        title: "30&#8209;dagarsbiljett",
        priceFull: 970,
        priceReduced: 650,
        days: 30
    },
    {
        title: "7&#8209;dagarsbiljett",
        priceFull: 440,
        priceReduced: 290,
        days: 7
    },
    {
        title: "72&#8209;timmarsbiljett",
        priceFull: 330,
        priceReduced: 220,
        days: 3
    },
    dayTicket
]

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
    tickets.forEach(ticket => {
        let row = $('<tr>');
        row.append($('<td>').html(ticket.title));

        row.append($('<td class="sized-table-column">').text(formatPrice(ticket.priceFull)));
        row.append($('<td class="sized-table-column">').text(formatPrice(ticket.priceReduced)));
        $('#ticketsTable').append(row);
    });
}

function formatEdgeDescription(edge, isFirstLine, isMultiTicketSolution) {
    if (!isMultiTicketSolution) {
        return `<span>${edge.count} st ${edge.ticket.title}</span>`
    } else if (isFirstLine) {
        return `<div><span class="edge-description-first-line">${edge.count} st ${edge.ticket.title}</span></div>`
    } else {
        return `<div><span class="edge-plus-container">+</span><span>${edge.count} st ${edge.ticket.title}</span></div>`
    }
}

function formatOptionDescription(option) {
    let isMultiTicketSolution = option.tickets.length > 1

    let cheapestOptionDescription = option.tickets
        .map((ticket, index) => formatEdgeDescription(ticket, index == 0, isMultiTicketSolution))
        .join('')

    return cheapestOptionDescription
}

function updateCalculations() {
    let nrOfDays = getNumberOfDays()
    let totalTravelsCount = getTotalTravelsCount()

    if (nrOfDays > 0 && totalTravelsCount > 0) {
        //let allOptions = calculateBestOption(nrOfDays, totalTravelsCount)
        let allOptions = iter_calculateBestOption(nrOfDays, totalTravelsCount)
        displayOptions(allOptions)
    }
}

function displayOptions(options) {
    options.sort((a, b) => a.totalCostFull - b.totalCostFull)
    let cheapestOption = options.shift()

    $('#calculatorResultTable tbody tr').remove()
    $('#best-option-ticket-desciption').html(`${formatOptionDescription(cheapestOption)}`)
    $('#best-option-ticket-total-cost-full').html(formatPrice(cheapestOption.totalCostFull))
    $('#best-option-ticket-total-cost-reduced').html(formatPrice(cheapestOption.totalCostReduced))

    options.forEach(option => {
        let row = $('<tr>');
        row.append($('<td class="optionDescription">').html(formatOptionDescription(option)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostFull)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostReduced)));

        $('#calculatorResultTable').append(row);
    })
}


function iter_calculateBestOption(nrOfDays, totalTravelsCount) {
    let travelsPerDay = totalTravelsCount / nrOfDays
    let periodTickets = tickets
        //.filter(ticket => ticket.priceFull / ticket.days <= travelsPerDay * singleTicket.priceFull)
        .sort((a, b) => b.days - a.days)

    let solutions = periodTickets.flatMap(periodTicket => {
        console.log("------------------------------------------------")
        let ticketsSubsetForSolution = periodTickets.filter(it => it.days <= periodTicket.days)
        let isComplexSolutionsAllowed = periodTicket.days < nrOfDays && (periodTicket.days >= 30 || nrOfDays <= 30)

        return iter_generateSolutionsForRootNode(ticketsSubsetForSolution, isComplexSolutionsAllowed, nrOfDays, travelsPerDay)
    })

    // Always add a solution with only single tickets
    solutions.push(
        createSolutionForTicketsList(
            [{
                ticket: singleTicket,
                count: totalTravelsCount
            }]
        )
    )

    return solutions
}


function createSolutionForTicketsList(tickets) {
    let totalCostFull = 0
    let totalCostReduced = 0

    tickets.forEach(ticket => {

        totalCostFull += ticket.count * ticket.ticket.priceFull
        totalCostReduced += ticket.count * ticket.ticket.priceReduced
    })

    return {
        tickets: tickets,
        totalCostFull: totalCostFull,
        totalCostReduced: totalCostReduced,
    }
}

function iter_generateSolutionsForRootNode(periodTickets, isComplexSolutionsAllowed, nrOfDays, travelsPerDay) {
    let solutions = []
    let daysLeft = nrOfDays
    let currentSolutionTickets = []

    for (let ticket of periodTickets) {
        if (daysLeft <= 0) {
            break;
        }

        if (ticket.days <= daysLeft) {
            // At least one ticket fits within the days left
            console.log(ticket.title + " fits")
            if (daysLeft % ticket.days != 0) {
                console.log(ticket.title + " is not a perfect match")
                // Not a perfect match.

                let ticketCount = Math.floor(daysLeft / ticket.days)
                console.log(ticket.title + " should be added with count: " + ticketCount)

                // Also add an overflowing solution using this ticket
                console.log(ticket.title + "added as solution for over flow with count: " + ticketCount)
                solutions.push(
                    createSolutionForTicketsList(
                        [
                            ...currentSolutionTickets,
                            {
                                ticket: ticket,
                                count: ticketCount + 1,
                            }
                        ]
                    )
                )
                console.log("isComplexSolutionsAllowed: " + isComplexSolutionsAllowed)
                console.log("currentSolutionTickets.length: " + currentSolutionTickets.length)
                let shouldAbort = currentSolutionTickets.length == 0 && !isComplexSolutionsAllowed
                currentSolutionTickets.push(
                    {
                        ticket: ticket,
                        count: ticketCount
                    }
                )
                daysLeft -= ticketCount * ticket.days

                // Create a single ticket padded solution unless root level
                console.log("pushing single ticket solutions with count: " + (daysLeft * travelsPerDay))
                solutions.push(
                    createSolutionForTicketsList(
                        [
                            ...currentSolutionTickets,
                            {
                                ticket: singleTicket,
                                count: daysLeft * travelsPerDay,
                            }
                        ]
                    )
                )

                if (shouldAbort) {
                    console.log("root level and not isComplexSolutionsAllowed. Aborting.")
                    break
                }
            } else {
                // there was a perfect match.
                console.log(ticket.title + " is a PERFECT match. pushing solution")
                solutions.push(
                    createSolutionForTicketsList(
                        [
                            ...currentSolutionTickets,
                            {
                                ticket: ticket,
                                count: daysLeft / ticket.days
                            }
                        ]
                    )
                )
                // Abort since we found a perfect match
                break;
            }
        } else {
            // The ticket dos not fit within the days left. Create an overflowing solution
            console.log(ticket.title + " does not fit for days: " + daysLeft)
            console.log("Adding solution with count 1 for ticket: " + ticket.title)
            solutions.push(
                createSolutionForTicketsList(
                    [
                        ...currentSolutionTickets,
                        {
                            ticket: ticket,
                            count: 1,
                        }
                    ]
                )
            )
            // If root level and overflow, abort
            if (currentSolutionTickets.length == 0) {
                break
            }
        }
    }
    return solutions
}

let currencyFormatter = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
});

function formatPrice(price) {
    return currencyFormatter.format(price)
}