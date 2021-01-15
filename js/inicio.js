//VARIABLES
const auth = firebase.auth();
const db = firebase.firestore();

const taskForm = document.getElementById('tabla');
const taskContainer = document.getElementById('contenedor');
const inputText1 = document.getElementById('task-titulo');
const inputText2 = document.getElementById('task-categoria');
const inputText3 = document.getElementById('task-descripcion');
const inputText4 = document.getElementById('task-estado');
const boton1 = document.getElementById('boton-tabla');
let id = '';
var est = new Boolean();

//PARA GUARDAR (FUNCION)
const saveTask = (titulo, categoria, descripcion, active) =>
    db.collection('Posts').doc().set({
        titulo,
        categoria,
        descripcion,
        active
    });

//==============================FUNCIONES==================================================
//CERRAR SESION
function signOut(){
    firebase.auth().signOut().then(function() {
        window.location.replace("index.html");
      }).catch(function(error) {
        // An error happened.
      });
}
//PARA LEER TODOS LOS DOCUMENTOS
const getTasks = () => db.collection('Posts').get();

//PARA LEER UN SOLO DOCUMENTO POR ID
const getTask = (id) => db.collection('Posts').doc(id).get();

//DE LA COLECCION, CADA VEZ QUE HAYA UN CAMBIO; SE MANEJA COMO FUNCION
const onGetTasks = (callback) => db.collection('Posts').onSnapshot(callback);

//PARA BORRAR DE LA COLLECION
const deleteTask = id => db.collection('Posts').doc(id).delete();

//PARA ACTUALIZAR DE LA COLECCION
const updateTask = (id, updatedTask) => 
    db.collection('Posts').doc(id).update(updatedTask);

//CARGA LA PANTALLA INICIAL, COMO EL ONSTART
window.addEventListener('DOMContentLoaded', async (e) => {
    //ES COMO EL LISTENER DE CAMBIOS
    onGetTasks((querySnapshot) => {

        //SE LIMPIA LA PANTALLA PARA VOLVER A CARGAR
        taskContainer.innerHTML = '';

        querySnapshot.forEach(doc => {
            console.log(doc.data())
    
            const tarea = doc.data();
            tarea.id = doc.id;
    
            taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
            <h3 class="h5">${tarea.titulo}</h3>
            <p>${tarea.categoria}</p>
            <p>${tarea.descripcion}</p>
            <p>${tarea.active}</p>
            <div>
                <button class="btn btn-primary btn-edit" data-id="${tarea.id}">Editar</button>
                <button class="btn btn-secondary btn-delete" data-id="${tarea.id}">Eliminar</button>    
            </div>
            </div>`;

            //SE RECORREN TODOS LOS BOTONES BORRAR PARA AÑADIRLES EL LISTENER
            //** SE CAMBIO document por tasksContainer**/
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    var opcion = confirm("¿Está seguro de eliminar este post?");
                    if (opcion == true) {  
                        await deleteTask(e.target.dataset.id)
	                } else {
                        //NO SE HACE NADA...
	                }
                })
            })

            //SE RECORREN TODOS LOS BOTONES EDITAR PARA AÑADIRLES EL LISTENER
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getTask(e.target.dataset.id);
                    const tarea = doc.data();

                    taskForm['task-titulo'].value = tarea.titulo;
                    taskForm['task-categoria'].value = tarea.categoria;
                    taskForm['task-descripcion'].value = tarea.descripcion;
                    taskForm['task-estado'].value = tarea.active;

                    //SE ASIGNA EL ID DEL DOC A LA VARIABLE GLOBAL
                    id = doc.id;

                    boton1.disabled = false;
                    inputText1.disabled = false;
                    inputText2.disabled = false;
                    inputText3.disabled = false;
                    inputText4.disabled = false;
                })
            })
        });
    });    
});


taskForm.addEventListener('submit', async (e)=> {
    e.preventDefault();

    const titulo = taskForm['task-titulo'];
    const categoria = taskForm['task-categoria'];
    const descripcion = taskForm['task-descripcion'];
    const estado = taskForm['task-estado'];
    //CONVIERTE A BOOLEAN EL VALOR OBTENIDO
    if(estado.value == "true"){
        est = true;
    } else if(estado.value =="false"){
        est = false;
    }

        await updateTask(id, {
            titulo : titulo.value,
            categoria : categoria.value,
            descripcion: descripcion.value,
            active : est,
        })
        //SE LIMPIAN LOS INPUT SE PONE EL EDIT STATUS EN FALSE, SE REINICIA EL ID Y SE CAMBIA EL TEXTO DEL BOTÓN
        editStatus = false;
        id = '';        
        taskForm['boton-tabla'].innerText = 'Guardar';
        taskForm['task-titulo'].innerText = '';
        //taskForm['task-categoria'].innerText = '';
        taskForm['task-descripcion'].innerText = '';
        //taskForm['task-estado'].innerText = '';
        boton1.disabled = true;
        inputText1.disabled = true;
        inputText2.disabled = true;
        inputText3.disabled = true;
        inputText4.disabled = true;
    
    taskForm.reset();
    //await getTasks();
    title.focus();
})
