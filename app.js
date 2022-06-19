const neededAmount = 0;



async function fetchTotalsJSON() {
    const response = await fetch('https://api.waxsweden.org:443/v2/state/get_tokens?account=mtz3a.wam');
    const total = await response.json();
    
    const responseMio = await fetch('https://wax.api.atomicassets.io/atomicassets/v1/accounts?match_owner=mtz3a.wam&template_id=235703&page=1&limit=100&order=desc');
    const totalMio = await responseMio.json();


    const responseLiftiumPrice = await fetch('https://wax.alcor.exchange/api/pools/616/charts?period=24H');
    const liftiumPrice = await responseLiftiumPrice.json();

    const responseMioPrice = await fetch('https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&collection_name=upliftium.hi&schema_name=upliftium&page=1&limit=50&order=desc&sort=template_id');
    const mioPrice = await responseMioPrice.json();

    

    console.log(mioPrice.data[0].listing_price);

    let currentMioPrice = mioPrice.data[0].listing_price/100000000;


    const outputMioPrice = document.querySelector('.outputMioPrice');

    outputMioPrice.innerHTML += '<h3>' +currentMioPrice + '</h3>';



    let currentLiftiumPrice = Math.round(liftiumPrice[liftiumPrice.length-1].price_r);

    
    const outputLiftiumPrice = document.querySelector('.outputLiftiumPrice');

    outputLiftiumPrice.innerHTML += '<h3>' +currentLiftiumPrice.toLocaleString() + '</h3>';


    console.log(currentLiftiumPrice);

    let mioAmount = 0;
    let liftAmount = 0;

    mioAmount = totalMio.data[0].assets * 1000000;

    for (let i = 0; i <= total.tokens.length; i++) {
        console.log(total.tokens[i]);
        if(total.tokens[i].symbol == 'LIFTIUM'){
            liftAmount = total.tokens[i].amount;
            liftAmount = liftAmount + mioAmount;
            return liftAmount;
        }
    }

    liftAmount = liftAmount + mioAmount;
    return liftAmount;
}


async function getTotal() {
    await fetchTotalsJSON().then(tokens => {

        currentAmount = Math.round(tokens);

        const neededAmount = (5000000000 - currentAmount);

        const ctx = document.getElementById('myChart');


        const myChart = new Chart(ctx, {
            type: 'doughnut',
            options: {
                layout: {
                    padding: 30
                },
                responsive: false,
                plugins: {
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: {
                                size: 18,
                                family: 'sans-serif'

                            },
                            boxWidth:10
                        }

                    }
                }
            },
            data: {
                labels: ["Current: " + currentAmount.toLocaleString(), "Needed: " + neededAmount.toLocaleString()],
                datasets: [{
                    data: [currentAmount, neededAmount],
                    backgroundColor: [
                        'rgb(255, 65, 198,0.4)',
                        'rgb(6, 255, 255,0.5)'

                    ],
                    borderColor: [
                        ' rgb(255, 65, 198,1)',
                        ' rgb(6, 255, 255)'

                    ],
                    borderWidth: 2
                }]
            }

        });

    });

}

getTotal();

