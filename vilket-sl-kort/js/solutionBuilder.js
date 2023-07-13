function createSolutionBuilder(singleJourneyTicket, travelCards) {

    const createSolutionForSolutionItems = (tickets) => {
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

    const generateSolutionsUsingTravelCards = (travelCards, isComplexSolutionsAllowed, nrOfDays, travelsPerDay) => {
        let solutions = []
        let daysLeft = nrOfDays
        let solutionItemsAccumulator = []

        function appendSolution(ticket, count) {
            solutions.push(
                createSolutionForSolutionItems(
                    [
                        ...solutionItemsAccumulator,
                        {
                            ticket: ticket,
                            count: count,
                        }
                    ]
                )
            )
        }

        for (let travelCard of travelCards) {
            if (daysLeft <= 0) {
                break;
            }

            if (travelCard.days <= daysLeft) {
                // At least one ticket fits within the days left
                if (daysLeft % travelCard.days != 0) {
                    // Not a perfect match.
                    let travelCardCount = Math.floor(daysLeft / travelCard.days)

                    // Also add an overflowing solution using this ticket
                    appendSolution(travelCard, travelCardCount + 1)

                    let shouldAbort = solutionItemsAccumulator.length == 0 && !isComplexSolutionsAllowed
                    solutionItemsAccumulator.push(
                        {
                            ticket: travelCard,
                            count: travelCardCount
                        }
                    )
                    daysLeft -= travelCardCount * travelCard.days

                    // Create a single ticket padded solution unless root level
                    appendSolution(singleJourneyTicket, daysLeft * travelsPerDay)

                    if (shouldAbort) {
                        break
                    }
                } else {
                    // there was a perfect match.
                    appendSolution(travelCard, daysLeft / travelCard.days)
                    // Abort since we found a perfect match
                    break;
                }
            } else {
                // The ticket dos not fit within the days left. Create an overflowing solution
                appendSolution(travelCard, 1)
                // If root level and overflow, abort
                if (solutionItemsAccumulator.length == 0) {
                    break
                }
            }
        }
        return solutions
    }

    return {
        generateAllSolutions: (nrOfDays, totalTravelsCount) => {
            let travelsPerDay = totalTravelsCount / nrOfDays
            travelCards.sort((a, b) => b.days - a.days)
            //.filter(ticket => ticket.priceFull / ticket.days <= travelsPerDay * singleTicket.priceFull)

            let solutions = travelCards.flatMap(travelCard => {
                let travelCardsSubsetForSolution = travelCards.filter(it => it.days <= travelCard.days)
                let isComplexSolutionsAllowed = travelCard.days < nrOfDays && (travelCard.days >= 30 || nrOfDays <= 30)

                return generateSolutionsUsingTravelCards(travelCardsSubsetForSolution, isComplexSolutionsAllowed, nrOfDays, travelsPerDay)
            })

            // Always add a solution with only single tickets
            solutions.push(
                createSolutionForSolutionItems(
                    [{
                        ticket: singleJourneyTicket,
                        count: totalTravelsCount
                    }]
                )
            )

            return solutions
        }
    }
}