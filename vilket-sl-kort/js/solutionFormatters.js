
function formatOptionTicketDescription(ticket, isFirstLine, isMultiTicketSolution) {
    if (!isMultiTicketSolution) {
        return `<span>${ticket.count} st ${ticket.ticket.title}</span>`
    } else if (isFirstLine) {
        return `<div><span class="edge-description-first-line">${ticket.count} st ${ticket.ticket.title}</span></div>`
    } else {
        return `<div><span class="edge-plus-container">+</span><span>${ticket.count} st ${ticket.ticket.title}</span></div>`
    }
}

function formatOptionDescription(option) {
    let isMultiTicketSolution = option.tickets.length > 1

    let optionDescription = option.tickets
        .map((ticket, index) => formatOptionTicketDescription(ticket, index == 0, isMultiTicketSolution))
        .join('')

    return optionDescription
}

let currencyFormatter = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
});

function formatPrice(price) {
    return currencyFormatter.format(price)
}
