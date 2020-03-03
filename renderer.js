// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password:'',
    database: 'sakila'
});

conexion.connect(function(error)
{
    if (error)
    {
        alert ('Error en la conexion de la base de datos');
        console.log ('La conexion no pudo ser establecida');
        return;
    }
    console.log('Conexion Exitosa');
})


const txtBusqueda = document.getElementById('txt_busqueda');
const formFiltrar = document.getElementById('form_filter');
const resultados = document.getElementById('table_results');
const cbTitulo = document.getElementById('busqueda_titulo');
const cbDescripcion = document.getElementById('busqueda_descripcion');
let searchQuery = `select title, description from film `

formFiltrar.addEventListener('submit', function(e)
{
    e.preventDefault();
})

txtBusqueda.addEventListener ('keyup', async function(evt)
{
    if (evt.code === 'Enter')
    {
        //Do the search in the DB
        if (cbTitulo.checked == true)
        {
            searchQuery += `where title like ?`
        }
        else if (cbDescripcion.checked == true)
        {
            searchQuery += `where description like ?`
        }
        else
        {
            alert('Por favor elija una opcion');
            return;
        }
        let html = '<tr> <th>Title</th> <th>Description</th> </tr>';

        console.log(searchQuery)
        conexion.query(searchQuery, [`%${txtBusqueda.value}%`], 
        function(err, rows, fields)
        {
            if (err)
            {
                console.log('Algo salio mal');
                return;
            }
            
            
            for (let row of rows )
            {
                html += '<tr>'
                html += `<td>${row.title}</td>`;
                html += `<td>${row.description}</td>`;
                html += '</tr>'
            }
            resultados.innerHTML = html;
            searchQuery = `select title, description from film `
        });
    }
});

cbTitulo.addEventListener ('click', function(e)
{
    cbDescripcion.checked = false;
})

cbDescripcion.addEventListener ('click', function(e)
{
    cbTitulo.checked = false;
})
