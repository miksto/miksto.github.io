let singleTicket = {
    "title": "Enkelbiljett 75 minuter",
    "price_full": 39,
    "price_reduced": 26,
    "days": null
}

let dayTicket = {
    "title": "24-timmarsbiljett",
    "price_full": 165,
    "price_reduced": 110,
    "days": 1
}

let tickets = [
    {
        "title": "Årsbiljett",
        "price_full": 10190,
        "price_reduced": 6830,
        "days": 365
    },
    {
        "title": "90-dagarsbiljett",
        "price_full": 2810,
        "price_reduced": 1880,
        "days": 90
    },
    {
        "title": "30-dagarsbiljett",
        "price_full": 970,
        "price_reduced": 650,
        "days": 30
    },
    {
        "title": "7-dagarsbiljett",
        "price_full": 440,
        "price_reduced": 290,
        "days": 7
    },
    {
        "title": "72-timmarsbiljett",
        "price_full": 330,
        "price_reduced": 220,
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


function populateTicketsTable() {
    $.each(tickets, function (index, ticket) {
        let row = $('<tr>');
        row.append($('<td>').text(ticket.title));

        row.append($('<td class="sized-table-column">').text(formatPrice(ticket.price_full)));
        row.append($('<td class="sized-table-column">').text(formatPrice(ticket.price_reduced)));
        row.append($('<td class="sized-table-column">').text((ticket.price_full / singleTicket.price_full).toFixed(1) + " st"));
        $('#ticketsTable').append(row);
    });
}

function updateCalculations() {

    let nrOfDays = $("#nrDaysInput").val()
    let totalTravelsCount = $("#totalTravelsCount").val()

    let allOptions = calculateBestOption(nrOfDays, totalTravelsCount)

    $('#calculatorResultTable tbody tr').remove()

    allOptions.forEach(option => {
        let row = $('<tr>');
        let optionDescription = option.edges.map(edge => `${edge.count} st ${edge.ticket.title}`).join("\n")

        row.append($('<td class="optionDescription">').text(optionDescription));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostFull)));
        row.append($('<td class="sized-table-column">').text(formatPrice(option.totalCostReduced)));

        $('#calculatorResultTable').append(row);
    })
}

function calculateBasicOptions(nrOfDays, travelsPerDay) {
    let totalTravelsCount = nrOfDays * travelsPerDay

    let result = []
    tickets.filter(ticket => ticket != singleTicket).forEach(ticket => {
        let requiredTickets = Math.ceil(nrOfDays / ticket.days)
        let totalCostFull = Math.ceil(requiredTickets) * ticket.price_full
        let totalCostReduced = Math.ceil(requiredTickets) * ticket.price_reduced

        result.push({
            "ticket": ticket,
            "number_of_tickets": requiredTickets,
            "total_cost_full": totalCostFull,
            "total_cost_reduced": totalCostReduced
        })
    })
    result.push({
        "ticket": singleTicket,
        "number_of_tickets": totalTravelsCount,
        "total_cost_full": totalTravelsCount * singleTicket.price_full,
        "total_cost_reduced": totalTravelsCount * singleTicket.price_reduced,
    })

    // sort by value
    result.sort(function (a, b) {
        return a.total_cost_full - b.total_cost_full;
    });
    return result
}

function calculateBestOption(nrOfDays, totalTravelsCount) {
    let travelsPerDay = totalTravelsCount / nrOfDays

    let allOptions = createOptionsForNode([], [...tickets], totalTravelsCount, travelsPerDay, nrOfDays)

    // Filter out all stupid options
    let priceIfOnlySingleTickets = nrOfDays * travelsPerDay * singleTicket.price_full
    let dayTicketWorthIt = travelsPerDay * singleTicket.price_full > dayTicket.price_full

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
            totalCostFull += edge.count * edge.ticket.price_full
            totalCostReduced += edge.count * edge.ticket.price_reduced
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