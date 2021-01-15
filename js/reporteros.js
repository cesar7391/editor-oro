//VARIABLES
const auth = firebase.auth();
const db = firebase.firestore();
const taskForm = document.getElementById('tabla');
const taskContainer = document.getElementById('contenedor');
const inputText1 = document.getElementById('task-username');
const inputText2 = document.getElementById('task-telefono');
const inputText3 = document.getElementById('task-correo');
const boton1 = document.getElementById('btn-tabla');
let id = '';

//PARA GUARDAR (FUNCION)
const saveTask = (username, phone, email) =>
    db.collection('Reporteros').doc().set({
        username,
        phone,
        email
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
const getTasks = () => db.collection('Reporteros').get();

//PARA LEER UN SOLO DOCUMENTO POR ID
const getTask = (id) => db.collection('Reporteros').doc(id).get();

//DE LA COLECCION, CADA VEZ QUE HAYA UN CAMBIO; SE MANEJA COMO FUNCION
const onGetTasks = (callback) => db.collection('Reporteros').onSnapshot(callback);

//PARA BORRAR DE LA COLLECION
const deleteTask = id => db.collection('Reporteros').doc(id).delete();

//PARA ACTUALIZAR DE LA COLECCION
const updateTask = (id, updatedTask) => 
    db.collection('Reporteros').doc(id).update(updatedTask);


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
            <h3 class="h5">${tarea.username}</h3>
            <p>${tarea.phone}</p>
            <p>${tarea.email}</p>
            <div>
                <button class="btn btn-primary btn-edit" data-id="${tarea.id}">Editar</button>
                <button class="btn btn-secondary btn-delete" data-id="${tarea.id}">Eliminar</button>    
            </div>
            </div>`;

            //SE RECORREN TODOS LOS BOTONES BORRAR PARA AÑADIRLES EL LISTENER
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    var opcion = confirm("¿Está seguro de eliminar este usuario?");
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

                    taskForm['task-username'].value = tarea.username;
                    taskForm['task-telefono'].value = tarea.phone;
                    taskForm['task-correo'].value = tarea.email;

                    //SE ASIGNA EL ID DEL DOC A LA VARIABLE GLOBAL
                    id = doc.id;

                    boton1.disabled = false;
                    inputText1.disabled = false;
                    inputText2.disabled = false;
                    inputText3.disabled = false;
                })
            })
        });
    });    
});


taskForm.addEventListener('submit', async (e)=> {
    e.preventDefault();

    const username = taskForm['task-username'];
    const phone = taskForm['task-telefono'];
    const email = taskForm['task-correo'];

        var opcion = confirm("¿Los datos son correctos?");
        if (opcion == true) {
        //DESDE AQUÏ==========================
        await updateTask(id, {
            username : username.value,
            phone: phone.value,
            email : email.value
        });
        //SE REGRESA A LA NORMALIDAD...
        id = '';
        taskForm['task-username'].innerText = '';
        taskForm['task-telefono'].innerText = '';
        taskForm['task-correo'].innerText = '';
        
        boton1.disabled = true;
        inputText1.disabled = true;
        inputText2.disabled = true;
        inputText3.disabled = true;
        
        } else {
        //NADA...
    }

    await getTasks();
    taskForm.reset();
    title.focus();
})
