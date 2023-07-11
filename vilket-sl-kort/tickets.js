let singleTicket = {
    "title": "Enkelbiljett 75 minuter",
    "priceFull": 39,
    "priceReduced": 26,
    "days": null
}

let dayTicket = {
    "title": "24-timmarsbiljett",
    "priceFull": 165,
    "priceReduced": 110,
    "days": 1
}

let tickets = [
    {
        "title": "Årsbiljett",
        "priceFull": 10190,
        "priceReduced": 6830,
        "days": 365
    },
    {
        "title": "90&#8209;dagarsbiljett",
        "priceFull": 2810,
        "priceReduced": 1880,
        "days": 90
    },
    {
        "title": "30&#8209;dagarsbiljett",
        "priceFull": 970,
        "priceReduced": 650,
        "days": 30
    },
    {
        "title": "7&#8209;dagarsbiljett",
        "priceFull": 440,
        "priceReduced": 290,
        "days": 7
    },
    {
        "title": "72&#8209;timmarsbiljett",
        "priceFull": 330,
        "priceReduced": 220,
        "days": 3
    },
    dayTicket,
    singleTicket,
]
tickets.sort((a, b) => a.days - b.days)

$(document).ready(function () {
    populateTicketsTable()
    updateCalculations()
})

$('#nrDaysInput').on('input', function () {
    let nrOfDays = $("#nrDaysInput").val()
    let travelsPerDay = $("#travelsPerDayInput").val()
    $('#totalTravelsCount').prop('value', nrOfDays * travelsPerDay)
    updateCalculations()
});

$('#travelsPerDayInput').on('input', function () {
    let nrOfDays = $("#nrDaysInput").val()
    let travelsPerDay = $("#travelsPerDayInput").val()
    $('#totalTravelsCount').prop('value', nrOfDays * travelsPerDay)
    updateCalculations()
});

$('#totalTravelsCount').on('input', function () {
    let nrOfDays = $("#nrDaysInput").val()
    let totalTravels = $("#totalTravelsCount").val()
    let travelsPerDay = (totalTravels / nrOfDays).toFixed(1)
    $('#travelsPerDayInput').prop('value', travelsPerDay)
    updateCalculations()
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

function formatOptionDescrition(option) {
    let cheapestOptionDescription = option.edges
        .map((edge, index) => formatEdgeDescrition(edge, index == 0, option.edges.length > 1))
        .join('')
    return cheapestOptionDescription
}

function updateCalculations() {

    let nrOfDays = $("#nrDaysInput").val()
    let totalTravelsCount = $("#totalTravelsCount").val()

    let allOptions = calculateBestOption(nrOfDays, totalTravelsCount)

    $('#calculatorResultTable tbody tr').remove()
    let cheapestOption = allOptions.shift()
    $('#best-option-ticket-desciption').html(`${formatOptionDescrition(cheapestOption)}`)
    $('#best-option-ticket-total-cost-full').html(formatPrice(cheapestOption.totalCostFull))
    $('#best-option-ticket-total-cost-reduced').html(formatPrice(cheapestOption.totalCostReduced))

    allOptions.forEach(option => {
        let row = $('<tr>');
        row.append($('<td class="optionDescription">').html(formatOptionDescrition(option)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostFull)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostReduced)));

        $('#calculatorResultTable').append(row);
    })
}

function calculateBestOption(nrOfDays, totalTravelsCount) {
    let travelsPerDay = totalTravelsCount / nrOfDays

    let allOptions = createOptionsForNode([], [...tickets], totalTravelsCount, travelsPerDay, nrOfDays)

    // Filter out all stupid options
    let priceIfOnlySingleTickets = nrOfDays * travelsPerDay * singleTicket.priceFull
    let dayTicketWorthIt = travelsPerDay * singleTicket.priceFull > dayTicket.priceFull

    let filteredOptions = allOptions
        .filter(option => {
            if (option.edges.length == 1) {
                return true
            }

            if (option.edges.some(edge => edge.ticket == dayTicket) && !dayTicketWorthIt) {
                return false
            }

            if (option.edges.some(edge => edge.ticket == singleTicket) && dayTicketWorthIt) {
                return false
            }

            if (option.totalCostFull > priceIfOnlySingleTickets) {
                return false
            }

            return true
        }
        )
    filteredOptions.sort((a, b) => a.totalCostFull - b.totalCostFull)
    let cheapestOption = filteredOptions[0]

    return filteredOptions.filter(option => {
        if (option.edges.length == 1) {
            return true
        }
        if (option.edges.length > 2 && option.edges.length > cheapestOption.edges.length) {
            return false
        }
        if (option.totalCostFull > cheapestOption.totalCostFull * 1.5) {
            return false
        }
        return true
    })
}

function createOptionsForNode(traversedEdges, remainingTicketTypes, totalTravelsCount, travelsPerDay, daysLeft) {

    if (daysLeft <= 0) {
        // We have found a solution
        let totalCostFull = 0
        let totalCostReduced = 0
        traversedEdges.forEach(edge => {
            totalCostFull += edge.count * edge.ticket.priceFull
            totalCostReduced += edge.count * edge.ticket.priceReduced
        })
        return [{
            edges: traversedEdges,
            totalCostFull: totalCostFull,
            totalCostReduced: totalCostReduced,
        }]
    }

    let options = []
    let edgesToExplore = generateEdgesForNode(remainingTicketTypes, travelsPerDay, daysLeft)

    edgesToExplore.forEach(edge => {
        let filteredRemainingTickets = remainingTicketTypes.filter(ticket => ticket.days < edge.ticket.days)
        let newDaysLeft = daysLeft - edge.days

        let newOptions = createOptionsForNode([...traversedEdges, edge], filteredRemainingTickets, totalTravelsCount, travelsPerDay, newDaysLeft)
        options.push(...newOptions)
    })

    return options
}

function generateEdgesForNode(remainingTicketTypes, travelsPerDay, daysLeft) {
    let edges = []
    remainingTicketTypes
        .filter(ticket => ticket != singleTicket)
        .filter(ticket => ticket.days > 3 || daysLeft < 10)
        .forEach(ticket => {
            for (ticketCount = 1; ticketCount * ticket.days <= daysLeft; ticketCount++) {
                edges.push({
                    "ticket": ticket,
                    "count": ticketCount,
                    "days": ticket.days * ticketCount
                })
            }

            // Add the last one that exceeds the required nr of days unless it's a 24h ticket
            if (ticket != dayTicket && daysLeft % ticket.days != 0) {
                edges.push({
                    "ticket": ticket,
                    "count": ticketCount,
                    "days": ticket.days * ticketCount
                })
            }
        })

    if (remainingTicketTypes.includes(singleTicket)) {
        edges.push({
            "ticket": singleTicket,
            "count": Math.ceil(daysLeft * travelsPerDay),
            "days": daysLeft
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