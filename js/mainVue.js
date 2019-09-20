var statistics = {
  "number_of_democrats": 0,
  "number_of_republicans": 0,
  "number_of_independents": 0,
  "total": 0,
  "democrats_average_votes_with_party": 0,
  "republicans_average_votes_with_party": 0,
  "independents_average_votes_with_party": 0,
  "total_average": 0,
  "least_engaged": [],
  "most_engaged": [],
  "least_loyal": [],
  "most_loyal": [],
  "members_dem": [],
  "members_rep": [],
  "members_ind": []
};

const init_str = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'cWbop5wBqK2HIQRT1rgkM8VgkpuDI5',
  },
  mode: 'cors',
};

getArrayFromURL(url, init_str);

var app = new Vue({
  el: '#app',
  data: {
    miembros: [],
    statistics: {}
  },
  computed: {
    listaEstados: function () {
      return this.miembros.map(element => element.state).sort().filter((item, index, array) => array.indexOf(item) === index);
    },
    totalMiembros: function () {
      return this.miembros.length
    }
  },
  methods: {
  }
})

async function  getArrayFromURL(urlAddr, options){
  try {
    const response = await fetch(urlAddr, options);
    const json = await response.json();
    app.miembros = json.results[0].members;
    app.statistics = makeStats(statistics);
    
    return `Estado del servidor: ${response.status === 200 ? "OK" : "NOT OK"}`;
  } catch (e) {
    throw `Manejo interno del error. Error original: ${e}`;
  }
}

function makeStats(data) {
  data.members_dem = app.miembros.filter(ele => ele.party === "D")
  data.number_of_democrats = data.members_dem.length
  data.members_rep = app.miembros.filter(ele => ele.party === "R")
  data.number_of_republicans = data.members_rep.length
  data.members_ind = app.miembros.filter(ele => ele.party === "I")
  data.number_of_independents = data.members_ind.length
  data.total = app.miembros.length
  data.democrats_average_votes_with_party = (data.members_dem.reduce(sumar, 0) / data.number_of_democrats).toFixed(4)
  data.republicans_average_votes_with_party = (data.members_rep.reduce(sumar, 0) / data.number_of_republicans).toFixed(4)
  data.independents_average_votes_with_party = (data.number_of_independents !== 0 ? (data.members_ind.reduce(sumar, 0) / data.number_of_independents).toFixed(4) : 0)
  data.total_average = ((parseFloat(data.democrats_average_votes_with_party) + parseFloat(data.republicans_average_votes_with_party) + parseFloat(data.independents_average_votes_with_party)) / 3).toFixed(4)

  var mem_votes_w_party = app.miembros.sort(ordenar_x_party_pct)
  var indice = Math.round(mem_votes_w_party.length / 10)
  var array_less = mem_votes_w_party.slice(0, indice)
  tope = mem_votes_w_party[indice - 1].votes_with_party_pct
  let adicionales = mem_votes_w_party.filter((votes, index) => (index >= indice && votes.votes_with_party_pct === tope))
  data.least_loyal = array_less.concat(adicionales)

  mem_votes_w_party.reverse()
  var array_more = mem_votes_w_party.slice(0, indice)
  tope = mem_votes_w_party[indice - 1].votes_with_party_pct
  adicionales = mem_votes_w_party.filter((votes, index) => (index >= indice && votes.votes_with_party_pct === tope))
  data.most_loyal = array_more.concat(adicionales)

  var mem_missed_votes_pct = app.miembros.sort(ordenar_x_missed_pct)
  var indEng = Math.round(mem_missed_votes_pct.length / 10)
  tope = mem_missed_votes_pct[indice - 1].missed_votes_pct
  array_less = mem_missed_votes_pct.slice(0, indEng)
  adicionales = mem_missed_votes_pct.filter((votes, index) => (index >= indEng && votes.missed_votes_pct === tope))
  data.least_engaged = array_less.concat(adicionales)

  mem_missed_votes_pct.reverse()
  array_more = mem_missed_votes_pct.slice(0, indEng)
  adicionales = mem_missed_votes_pct.filter((votes, index) => (index >= indice && votes.votes_with_party_pct === tope))
  data.most_engaged = array_more.concat(adicionales)

  console.log(data);

  return  data;
}

function ordenar_x_party_pct(a, b) {
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return 1
  }
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return -1
  }
  return 0
}

function ordenar_x_missed_pct(a, b) {
  return ((a.missed_votes_pct > b.missed_votes_pct) ? 1 : -1)
}

function sumar(sum, e) {
  return (sum + e.votes_with_party_pct)
}