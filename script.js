// ==========================================
// ADD NORMAL SELLING COMBINATION
// ==========================================

function addCombination() {

    const combinations =
        document.getElementById("combinations");


    const newCombination =
        document.createElement("div");


    newCombination.classList.add("combination");


    newCombination.innerHTML = `

        <div>

            <label>Data</label>

            <select class="dataSize">

                <option value="0.5">500MB</option>
                <option value="1">1GB</option>
                <option value="2">2GB</option>
                <option value="3">3GB</option>
                <option value="5">5GB</option>
                <option value="10">10GB</option>
                <option value="20">20GB</option>
                <option value="36">36GB</option>
                <option value="65">65GB</option>

            </select>

        </div>


        <div>

            <label>Price (₦)</label>

            <input
                type="number"
                class="price"
                placeholder="e.g. 100"
                min="0"
            >

        </div>


        <div>

            <label>Quantity</label>

            <input
                type="number"
                class="quantity"
                placeholder="e.g. 2"
                min="0"
            >

        </div>


        <button
            class="removeBtn"
            onclick="removeCombination(this)"
        >
            ×
        </button>

    `;


    combinations.appendChild(newCombination);
}


// ==========================================
// REMOVE NORMAL COMBINATION
// ==========================================

function removeCombination(button) {

    button.parentElement.remove();

}


// ==========================================
// ADD PAID AFTER COMBINATION
// ==========================================

function addPaidCombination() {

    const container =
        document.getElementById(
            "paidAfterCombinations"
        );


    const newCombination =
        document.createElement("div");


    newCombination.classList.add(
        "paidCombination"
    );


    newCombination.innerHTML = `

        <div>

            <label>Data</label>

            <select class="paidDataSize">

                <option value="0.5">500MB</option>
                <option value="1">1GB</option>
                <option value="2">2GB</option>
                <option value="3">3GB</option>
                <option value="5">5GB</option>
                <option value="10">10GB</option>
                <option value="20">20GB</option>
                <option value="36">36GB</option>
                <option value="65">65GB</option>

            </select>

        </div>


        <div>

            <label>Paid After Price (₦)</label>

            <input
                type="number"
                class="paidAfterPrice"
                placeholder="e.g. 50"
                min="0"
            >

        </div>


        <button
            class="removeBtn"
            onclick="removePaidCombination(this)"
        >
            ×
        </button>

    `;


    container.appendChild(newCombination);
}


// ==========================================
// REMOVE PAID AFTER COMBINATION
// ==========================================

function removePaidCombination(button) {

    button.parentElement.remove();

}


// ==========================================
// SHOW / HIDE PAID AFTER
// ==========================================

function togglePaidAfter() {

    const checkbox =
        document.getElementById(
            "paidAfterEnabled"
        );


    const section =
        document.getElementById(
            "paidAfterSection"
        );


    if (checkbox.checked) {

        section.classList.remove("hidden");

    } else {

        section.classList.add("hidden");

    }

}


// ==========================================
// CALCULATE EVERYTHING
// ==========================================

function calculateProfit() {

    // --------------------------------------
    // MAIN DATA
    // --------------------------------------

    const mainData =
        Number(
            document.getElementById(
                "mainData"
            ).value
        );


    const mainCost =
        Number(
            document.getElementById(
                "mainCost"
            ).value
        );


    // --------------------------------------
    // NORMAL COMBINATIONS
    // --------------------------------------

    const dataSizes =
        document.querySelectorAll(
            ".dataSize"
        );


    const prices =
        document.querySelectorAll(
            ".price"
        );


    const quantities =
        document.querySelectorAll(
            ".quantity"
        );


    let totalData = 0;

    let totalSales = 0;

    let totalShares = 0;


    // --------------------------------------
    // LOOP THROUGH NORMAL SALES
    // --------------------------------------

    for (
        let i = 0;
        i < dataSizes.length;
        i++
    ) {

        const data =
            Number(
                dataSizes[i].value
            );


        const price =
            Number(
                prices[i].value
            );


        const quantity =
            Number(
                quantities[i].value
            );


        if (
            price < 0 ||
            quantity < 0
        ) {

            showError(
                "Price and quantity cannot be negative."
            );

            return;

        }


        const dataSold =
            data * quantity;


        const sales =
            price * quantity;


        totalData += dataSold;

        totalSales += sales;

        totalShares += quantity;

    }


    // --------------------------------------
    // VALIDATE MAIN PLAN
    // --------------------------------------

    if (
        mainData <= 0 ||
        mainCost < 0
    ) {

        showError(
            "Please enter a valid main data plan and amount."
        );

        return;

    }


    // --------------------------------------
    // CHECK DATA LIMIT
    // --------------------------------------

    if (
        totalData > mainData
    ) {

        showError(
            "You are trying to sell " +
            formatGB(totalData) +
            ", but you only have " +
            formatGB(mainData) +
            "."
        );

        return;

    }


    // --------------------------------------
    // AUTOMATION CHARGE
    // --------------------------------------

    const automationCharge =
        Number(
            document.getElementById(
                "automationCharge"
            ).value
        );


    const automationTotal =
        automationCharge * totalShares;


    // --------------------------------------
    // PAID AFTER
    // --------------------------------------

    let paidAfterTotal = 0;


    const paidAfterEnabled =
        document.getElementById(
            "paidAfterEnabled"
        ).checked;


    if (paidAfterEnabled) {

        const monthlyShares =
            Number(
                document.getElementById(
                    "monthlyShares"
                ).value
            );


        if (monthlyShares < 0) {

            showError(
                "Monthly shares cannot be negative."
            );

            return;

        }


        // ----------------------------------
        // HOW MANY SHARES ARE PAID AFTER?
        // ----------------------------------

        let extraShares =
            Math.max(
                0,
                totalShares - monthlyShares
            );


        // ----------------------------------
        // GET PAID AFTER PRICE LIST
        // ----------------------------------

        const paidDataSizes =
            document.querySelectorAll(
                ".paidDataSize"
            );


        const paidPrices =
            document.querySelectorAll(
                ".paidAfterPrice"
            );


        /*
            We create an object like:

            {
                "0.5": 50,
                "1": 100,
                "2": 200
            }

            This makes it easy to find
            the paid-after price for a
            particular data size.
        */

        const paidAfterPrices = {};


        for (
            let i = 0;
            i < paidDataSizes.length;
            i++
        ) {

            const data =
                Number(
                    paidDataSizes[i].value
                );


            const price =
                Number(
                    paidPrices[i].value
                );


            paidAfterPrices[data] = price;

        }


        // ----------------------------------
        // CALCULATE EXTRA SHARE CHARGES
        // ----------------------------------

        for (
            let i = 0;
            i < dataSizes.length;
            i++
        ) {

            if (
                extraShares <= 0
            ) {

                break;

            }


            const data =
                Number(
                    dataSizes[i].value
                );


            const quantity =
                Number(
                    quantities[i].value
                );


            /*
                How many of this particular
                combination become paid-after
                shares?
            */

            const paidQuantity =
                Math.min(
                    quantity,
                    extraShares
                );


            /*
                Find the paid-after price
                for this data size.
            */

            const paidPrice =
                paidAfterPrices[data];


            /*
                If the user hasn't configured
                this data size, show an error.
            */

            if (
                paidPrice === undefined &&
                paidQuantity > 0
            ) {

                showError(
                    "You have not set a Paid After price for " +
                    formatGB(data) +
                    "."
                );

                return;

            }


            paidAfterTotal +=
                paidQuantity * paidPrice;


            extraShares -=
                paidQuantity;

        }

    }


    // --------------------------------------
    // REMAINING DATA
    // --------------------------------------

    const remainingData =
        mainData - totalData;


    // --------------------------------------
    // TOTAL REVENUE
    // --------------------------------------

    const totalRevenue =
        totalSales +
        paidAfterTotal;


   // --------------------------------------
// FINAL PROFIT
// --------------------------------------

const profit =
    totalSales -
    (
        mainCost +
        automationTotal +
        paidAfterTotal
    );


    // --------------------------------------
    // DISPLAY RESULTS
    // --------------------------------------

    document.getElementById(
        "totalData"
    ).textContent =
        formatGB(totalData);


    document.getElementById(
        "remainingData"
    ).textContent =
        formatGB(remainingData);


    document.getElementById(
        "totalShares"
    ).textContent =
        totalShares;


    document.getElementById(
        "totalSales"
    ).textContent =
        formatMoney(totalSales);


    document.getElementById(
        "automationTotal"
    ).textContent =
        formatMoney(
            automationTotal
        );


    document.getElementById(
        "paidAfterTotal"
    ).textContent =
        formatMoney(
            paidAfterTotal
        );


    document.getElementById(
        "totalRevenue"
    ).textContent =
        formatMoney(
            totalRevenue
        );


    document.getElementById(
        "profit"
    ).textContent =
        formatMoney(
            profit
        );


    hideError();

}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount) {

    return (
        "₦" +
        amount.toLocaleString(
            "en-NG"
        )
    );

}


// ==========================================
// FORMAT DATA
// ==========================================

function formatGB(amount) {

    if (amount === 0) {

        return "0 GB";

    }


    if (amount === 0.5) {

        return "500 MB";

    }


    if (
        amount % 1 === 0.5
    ) {

        return (
            amount +
            " GB"
        );

    }


    return (
        amount +
        " GB"
    );

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    const error =
        document.getElementById(
            "error"
        );


    error.textContent =
        message;


    error.style.display =
        "block";

}


// ==========================================
// HIDE ERROR
// ==========================================

function hideError() {

    const error =
        document.getElementById(
            "error"
        );


    error.style.display =
        "none";

}