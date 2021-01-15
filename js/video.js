//VARIABLES
const auth = firebase.auth();
const db = firebase.firestore();
const taskForm = document.getElementById('tabla');
const taskContainer = document.getElementById('contenedor');
const inputText1 = document.getElementById('task-url');
const boton1 = document.getElementById('btn-tabla');
let id = '';

//PARA GUARDAR (FUNCION)
const saveTask = (urlVideo) =>
    db.collection('Transmision').doc().set({
        urlVideo
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
const getTasks = () => db.collection('Transmision').get();

//PARA LEER UN SOLO DOCUMENTO POR ID
const getTask = (id) => db.collection('Transmision').doc(id).get();

//DE LA COLECCION, CADA VEZ QUE HAYA UN CAMBIO; SE MANEJA COMO FUNCION
const onGetTasks = (callback) => db.collection('Transmision').onSnapshot(callback);

//PARA ACTUALIZAR DE LA COLECCION
const updateTask = (id, updatedTask) => 
    db.collection('Transmision').doc(id).update(updatedTask);


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
            <h3 class="h5">URL DEL VIDEO ACTUALMENTE ACTIVO</h3>
            <p>${tarea.urlVideo}</p>
            <div>
                <button class="btn btn-primary btn-edit" data-id="${tarea.id}">Editar</button>   
            </div>
            </div>`;

            //SE RECORREN TODOS LOS BOTONES EDITAR PARA AÑADIRLES EL LISTENER
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {                    
                    const doc = await getTask(e.target.dataset.id);
                    const tarea = doc.data();

                    taskForm['task-url'].value = tarea.urlVideo;

                    //SE ASIGNA EL ID DEL DOC A LA VARIABLE GLOBAL
                    id = doc.id;
                    
                    boton1.disabled = false;
                    inputText1.disabled = false;
                    //taskForm['btn-tabla'].innerText = 'Actualizar'
                })
            })
        });
    });    
});


taskForm.addEventListener('submit', async (e)=> {
    e.preventDefault();

    const urlVideo = taskForm['task-url'];

        var opcion = confirm("¿Los datos son correctos?");
        if (opcion == true) {
        //DESDE AQUÏ==========================
        await updateTask(id, {
            urlVideo : urlVideo.value
        });
        //SE REGRESA A LA NORMALIDAD...
        id = '';
        taskForm['task-url'].innerText = '';
        boton1.disabled = true;
        inputText1.disabled = true;
        //===========================================
        } else {
        //NADA...
    }

    await getTasks();
    taskForm.reset();
    title.focus();
})

