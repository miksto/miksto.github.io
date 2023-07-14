
function formatOptionDescription(option) {
    let isMultiTicketSolution = option.tickets.length > 1

    let optionDescriptionTable = $('<table>', { class: 'option-description-table' }).html('<tbody>')

    option.tickets.forEach((optionItem, index) => {
        let isFirstLine = index == 0
        let optionDescriptionRow = $('<tr>')

        let plusItem = $('<td>').text('+')
        let countItem = $('<td>')
        let titleItem = $('<td>')

        if (isFirstLine) {
            plusItem.css({ 'opacity' : 0.0 });
        }
        countItem.text(`${optionItem.count} st`)
        titleItem.html(optionItem.ticket.title)

        optionDescriptionRow.append(plusItem)
        optionDescriptionRow.append(countItem)
        optionDescriptionRow.append(titleItem)
        optionDescriptionTable.append(optionDescriptionRow)
    })
    return optionDescriptionTable
}

let currencyFormatter = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

function formatPrice(price) {
    return currencyFormatter.format(price)
}
