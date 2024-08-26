let lowestPricedMinerArray = [];
let priceSortLow = document.getElementById("sort-price-btn-low");
priceSortLow.addEventListener("click", sortMinersByPriceLowest);
let priceSortHigh = document.getElementById("sort-price-btn-high");
priceSortHigh.addEventListener("click", sortMinersByPriceHighest);
// console.log(priceSort);
async function fetchPoolsJSON() {
  // const response = await fetch('pools.json');
  // const pools = await response.json();
  // console.log(pools);

  const url =
    "https://api.allorigins.win/get?url=" +
    encodeURIComponent(
      "https://tools.theuplift.world:3033/v1/world/info/pools"
    );

  let uplift_info = await fetch(url);

  let uplift_dat = await uplift_info.json();
  const jsonObject = JSON.parse(uplift_dat.contents);
  //console.log(jsonObject.payload);

  return jsonObject.payload;
}

async function fetchLowestPricedMinersJSON() {
  const response = await fetch(
    "https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&collection_name=upliftworld&schema_name=miners&page=1&limit=50&order=desc&sort=template_id"
  );
  const price = await response.json();

  return price;
}

async function getMinerDeals() {
  const miners = {
    name: "",
    rate: 0,
    id: 0,
    ratio: 0,
    price: 0,
    saleId: 0,
    img: 0,
    video: false,
    rarity: "",
  };

  let minerArray = [];


  await fetchPoolsJSON().then((pools) => {
    //console.log(pools);
    pools.forEach((element, index) => {
      const miner = Object.create(miners);

      miner.name = element.label;
      miner.rate = parseFloat(element.size_per_tick_per_asset);
      miner.id = element.template_id;
      minerArray[index] = miner;
    });
  });
  console.log(minerArray);
  await fetchLowestPricedMinersJSON().then((miner) => {
    miner.data.forEach((e, i) => {
      let m = minerArray.find((o) => o.id === e.assets[0].template.template_id);
      let ratio = m.rate / (e.price.amount / 100000000).toFixed(3);

      const lowMiner = Object.create(miners);
      lowMiner.name = e.assets[0].name;
      lowMiner.rate = parseFloat(m.rate).toFixed(2);
      lowMiner.id = e.assets[0].template.template_id;
      lowMiner.ratio = parseFloat(ratio).toFixed(2);
      lowMiner.price = parseFloat(e.price.amount / 100000000).toFixed(2);
      lowMiner.saleId = e.sale_id;
      //console.log("img:  " + e.assets[0].data.img+ "  video:  " + e.assets[0].data.video);

      if (e.assets[0].data.img != undefined) {
        // console.log(e.assets[0]);
        lowMiner.video = false;
        lowMiner.img = e.assets[0].data.img;
      } else {
        lowMiner.video = true;
        lowMiner.img = e.assets[0].data.video;
      }
      lowMiner.rarity = e.assets[0].data.rarity;

      lowestPricedMinerArray[i] = lowMiner;
    });
    lowestPricedMinerArray.sort(function (a, b) {
      return b.ratio - a.ratio;
    });
  });


  updateDOM();
  
}

function sortMinersByPriceLowest() {
    lowestPricedMinerArray.sort((a, b) => a.price - b.price);
    let section = document.getElementsByClassName("miner-section")[0];
    section.innerHTML = ''; 
    updateDOM();
}

function sortMinersByPriceHighest() {
    lowestPricedMinerArray.sort((a, b) => b.price - a.price);
    let section = document.getElementsByClassName("miner-section")[0];
    section.innerHTML = ''; 
    updateDOM();
}

function updateDOM() {
    let section = document.getElementsByClassName("miner-section");
    console.log(lowestPricedMinerArray);
    lowestPricedMinerArray.forEach((m) => {
   
        let imageX = document.createElement("img");
        imageX.width = "135";
        imageX.height = "200";
        imageX.marginwidth = "0";
        imageX.seamless = "true";
        imageX.src = "img/" + m.img + ".jpg";
        imageX.id = "img-shadow";
    
        //section[0].appendChild(imageX);
    
        let descriptionX = document.createElement("div");
        descriptionX.className = "miner-description";
        descriptionX.innerHTML += "<br>";
        descriptionX.append(imageX);
        descriptionX.innerHTML += "<br>";
        descriptionX.id = "p-description";
        descriptionX.innerHTML +=
          "<br><h2>" +
          m.name +
          "</h2><p>" +
          m.ratio +
          " Upliftium per hour / price <br>" +
          m.rate +
          " Upliftium per hour <br>" +
          m.price +
          ' wax</p><a href ="https://wax.atomichub.io/market/sale/' +
          m.saleId +
          '">AtomicHub</a><br><hr>';
    
        section[0].appendChild(descriptionX);
      });
    }
