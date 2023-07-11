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
    dayTicket,
    singleTicket,
]
tickets.sort((a, b) => a.days - b.days)

$(document).ready(function () {
    populateTicketsTable()
    updateCalculations()
})

function getNumberOfDays() {
    return parseInt($("#nrDaysInput").val())
}

function getTravelsPerDay() {
    return parseInt($("#travelsPerDayInput").val())
}

function getTotalTravelsCount() {
    return parseInt($("#totalTravelsCount").val())
}

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

function formatEdgeDescrition(edge, isFirstLine, hasMultipleLines) {
    if (!hasMultipleLines) {
        return `<span>${edge.count} st ${edge.ticket.title}</span>`
    } else if (isFirstLine) {
        return `<div><span class="edge-description-first-line">${edge.count} st ${edge.ticket.title}</span></div>`
    } else {
        return `<div><span class="edge-plus-container">+</span><span>${edge.count} st ${edge.ticket.title}</span></div>`
    }
}

function formatOptionDescription(option) {
    let cheapestOptionDescription = option.edges
        .map((edge, index) => formatEdgeDescrition(edge, index == 0, option.edges.length > 1))
        .join('')
    return cheapestOptionDescription
}

function updateCalculations() {
    let nrOfDays = getNumberOfDays()
    let totalTravelsCount = getTotalTravelsCount()

    if (nrOfDays > 0 && totalTravelsCount > 0) {
        let allOptions = calculateBestOption(nrOfDays, totalTravelsCount)
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

function calculateBestOption(nrOfDays, totalTravelsCount) {
    let travelsPerDay = totalTravelsCount / nrOfDays
    let dayTicketWorthIt = travelsPerDay * singleTicket.priceFull > dayTicket.priceFull
    let filteredTickets = tickets.filter(ticket => ticket != dayTicket || dayTicketWorthIt)

    let rootEdge = {
        ticket: null,
        count: 0,
        days: 0,
        remainingTickets: filteredTickets,
    }

    return createOptionsForNode([rootEdge], totalTravelsCount, travelsPerDay, nrOfDays)
}

function createOptionsForNode(traversedEdges, totalTravelsCount, travelsPerDay, daysLeft) {

    if (daysLeft <= 0) {
        // We have found a solution
        let totalCostFull = 0
        let totalCostReduced = 0
        let edgesWithoutRootNode = traversedEdges.slice(1, traversedEdges.length)
        edgesWithoutRootNode.forEach(edge => {
            totalCostFull += edge.count * edge.ticket.priceFull
            totalCostReduced += edge.count * edge.ticket.priceReduced
        })
        return [{
            edges: edgesWithoutRootNode,
            totalCostFull: totalCostFull,
            totalCostReduced: totalCostReduced,
        }]
    }

    let options = []
    let edgesToExplore = generateEdgesForNode(traversedEdges, travelsPerDay, daysLeft)
    // Om man har tagit en väg men en mindre storlek som inte överflödar, då får man bara använda singleTickets
    edgesToExplore.forEach(edge => {
        let newDaysLeft = daysLeft - edge.days

        let newOptions = createOptionsForNode([...traversedEdges, edge], totalTravelsCount, travelsPerDay, newDaysLeft)
        options.push(...newOptions)
    })

    return options
}

function generateEdgesForNode(traversedEdges, travelsPerDay, daysLeft) {
    let edges = []
    let largestTicketThatFitsDaysLeft = null

    let currentEdge = traversedEdges[traversedEdges.length - 1]
    let remainingTickets = currentEdge.remainingTickets

    remainingTickets
        .filter(ticket => ticket != singleTicket)
        .forEach(ticket => {
            if (largestTicketThatFitsDaysLeft == null
                || (ticket.days > largestTicketThatFitsDaysLeft.days && ticket.days <= daysLeft)) {
                largestTicketThatFitsDaysLeft = ticket
            }
        })


    remainingTickets
        .filter(ticket => ticket != singleTicket)
        .forEach(ticket => {
            let maxTicketCountWithNoOverflow = Math.floor(daysLeft / ticket.days)

            if (maxTicketCountWithNoOverflow > 0) {
                let days = ticket.days * maxTicketCountWithNoOverflow
                let newRemainingTickets = null

                if (ticket.days < largestTicketThatFitsDaysLeft.days) {
                    newRemainingTickets = remainingTickets.filter(ticket => ticket == singleTicket)
                } else {
                    newRemainingTickets = remainingTickets.filter(ticket => ticket.days < days)
                }

                edges.push({
                    ticket: ticket,
                    count: maxTicketCountWithNoOverflow,
                    days: days,
                    remainingTickets: newRemainingTickets
                })
            }

            // Add the last one that exceeds the required nr of days unless it's a 24h ticket
            if (ticket != dayTicket && daysLeft % ticket.days != 0) {
                let days = ticket.days * (maxTicketCountWithNoOverflow + 1)
                edges.push({
                    ticket: ticket,
                    count: maxTicketCountWithNoOverflow + 1,
                    days: days,
                    remainingTickets: remainingTickets.filter(ticket => ticket.days < days)
                })
            }
        })

    if (remainingTickets.includes(singleTicket)) {
        edges.push({
            ticket: singleTicket,
            count: Math.ceil(daysLeft * travelsPerDay),
            days: daysLeft,
            remainingTickets: []
        })
    }

    return edges
}

let currencyFormatter = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
});

function formatPrice(price) {
    return currencyFormatter.format(price)
}