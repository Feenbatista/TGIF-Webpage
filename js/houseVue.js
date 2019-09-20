const url = 'https://api.propublica.org/congress/v1/113/house/members.json';
const init_str = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'cWbop5wBqK2HIQRT1rgkM8VgkpuDI5',
  },
  mode: 'cors',
};

fetch(url, init_str)
  .then(response => response.json())
  .then(json => {
    app.miembros = json.results[0].members
    app.miembrosFiltered = json.results[0].members
  })
  .catch(error => console.log(error))
var app = new Vue({
  el: '#app',
  data: {
    miembros: [],
    miembrosFiltered: [],
    listState: 'All',
  },
  computed: {
    listaEstados: function () {
      return this.miembros.map(element => element.state).sort().filter((item, index, array) => array.indexOf(item) === index);
    },
    totalMiembros: function() {
      return this.miembrosFiltered.length
    }
  },
  methods: {
    filter: function() {
      let aux = []
      let result = []
      this.miembrosFiltered = this.miembros
      var checkedBoxes = document.querySelectorAll('input[name=party]:checked');
      var partidos = Array.from(checkedBoxes).map(element => element.value)
      var listState = document.querySelector("#state").value
      partidos.forEach(partido => {
        if(listState === 'All') {
          aux = this.miembrosFiltered.filter(miembro => miembro.party === partido)
        }
        else {
        aux = this.miembrosFiltered.filter(miembro => miembro.party === partido && miembro.state === listState)
        }
        result = result.concat(aux)
      })
      result.sort((a, b) => (a.last_name > b.last_name ? 1 : -1))
      return this.miembrosFiltered = result
    }
  }
});

function suma(total, ele) {
  return total + ele.votes_with_party_pct;
}

function ordenarMissedPct(a, b) {
  return ((a.missed_votes_pct > b.missed_votes_pct) ? 1 : -1);
}
