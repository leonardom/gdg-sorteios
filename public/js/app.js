var sortear = document.getElementById('sortear-button')
var sorteado = {}
var sorteios = []

if (!sorteios) {
  sorteios = []
}

sortear.addEventListener('click', function(e) {
  e.preventDefault()
  
  $.getJSON('http://localhost:3000/sortear', function(person) {
    sorteado = person
    $('#res_senha').html('SENHA: <strong>' + person.senha + '</strong>')
    $('#res_nome').html('PARABÉNS!!! <strong>' +person.nome + '</strong>')

    sortear.setAttribute('disabled', true)
  })
})

var novo = document.getElementById('novo-sorteio')
novo.addEventListener('click', function(e) {
  e.preventDefault()

  if (confirm('Deseja salvar sorteado?')){
    sorteios.push({
      numero: sorteios.length + 1,
      data_hora: new Date(),
      sorteado: sorteado
    })
    
    salvar(sorteios)
  }

  $('#res_senha').html('SENHA')
  $('#res_nome').html('NOME')
  sortear.removeAttribute('disabled')
  sorteado = {}
  renderList()
})

var participantes = document.getElementById('mostrar-participantes')
participantes.addEventListener('click', function(e) {
  e.preventDefault()

  $.getJSON('http://localhost:3000/participantes', function(participantes) {
    var ul = document.getElementById('participantes-list')
    ul.innerHTML = ''

    participantes.forEach(function(p) {
      if (p.nome !== 'Nome') {
        var li = document.createElement('li')
        li.innerHTML = p.nome + ' (Senha: ' + p.senha + ')'

        ul.appendChild(li)
      }
    })

    $('#modal1').modal();
    $('#modal1').modal('open');
  })  
})

function getSorteios() {
  $.getJSON('http://localhost:3000/sorteios', function(data) {
    sorteios = data
    renderList()
  })
}

function salvar(values) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/salvar',
    data: JSON.stringify(values),
    success: function(data) { 
      if (!data || !data.ok) {
        alert('Erro ao salvar')
      }
    },
    contentType: "application/json",
    dataType: 'json'
  });
}

function renderList() {
  var div = document.getElementById('sorteados-div')
  var ul = document.getElementById('sorteados-list')
  ul.innerHTML = ''

  sorteios.forEach(function(item) {
    var li = document.createElement('li')
    li.innerHTML = 'Senha: ' + item.sorteado.senha
      + ' - ' +  item.sorteado.nome

    ul.appendChild(li)
  });

  div.style.visibility = sorteios.length > 0 ? 'visible' : 'hidden'
  console.log(div.style.visibility)
}

getSorteios()