(() => {
    const App = {
        htmlElements: {
            taskForm: document.getElementById('task-form'),
            mainTaskList: document.querySelector('.main-task-list'),
        },
        init: () => {
            App.bindEvents();
            App.initializeData.tasks();
        },
        bindEvents: () => {
            App.htmlElements.taskForm.addEventListener('submit', App.events.onTaskFormSubmit);
        },

        initializeData: {
            tasks: async () => {
                const { count, data } = await App.utils.get('http://localhost:4000/api/v1/tasks/'); 
                data.forEach(Tasks => {
                    App.utils.addTask(Tasks);
                });
            }
        },

        events: {
            onTaskFormSubmit: async (event) => {
                event.preventDefault();
                const { task: { value: taskValue } } = event.target.elements;
                
                var div_fila = document.createElement("div");

                div_fila.innerHTML =

                    `<div id="ext_${taskValue}">
                        <input type="checkbox" name="rendered-task">
                        <label for="">${taskValue}</label>
                        <input type="button" id="edi_${taskValue}" class="${taskValue}" name="edi_${taskValue}" value="Editar">
                        <input type="button" id="del_${taskValue}" class="${taskValue}" name="del_${taskValue}" value="Eliminar">
                    </div><br>
                    `
                ;

                div_fila.id = taskValue;

                App.htmlElements.mainTaskList.appendChild(div_fila);

                document.getElementById(`del_${taskValue}`).addEventListener('click', App.events.onTaskDelete)
                document.getElementById(`edi_${taskValue}`).addEventListener('click', App.events.onClickUpdate)

                // Guardar en el servidor
                await App.utils.postData('http://localhost:4000/api/v1/tasks/', {
                    name: taskValue,
                    completed: false,
                })

                document.getElementById(`input_txt`).value = "";

            },

            onClickUpdate: async (e) => {
                e.preventDefault();

                var idtask = e.currentTarget.className;

                console.log("ee")
                console.log(idtask)

                document.getElementById(`ext_${idtask}`).innerHTML = "";

                //Inserta el nuevo HTML dentro de la tarea existente.
                document.getElementById(`ext_${idtask}`).innerHTML = 
                
                `
                <form id="form_in_${idtask}" class=${idtask}>

                    <input name="tarea" type="text" id="txt_input_fin_${idtask}" class="${idtask}" value="${idtask}">
                    <button type="submit" id="btn_guardar_fin_${idtask}" class="${idtask}">Guardar</button>

                </form>
                `;

                document.getElementById(`txt_input_fin_${idtask}`).value = idtask;
                document.getElementById(`btn_guardar_fin_${idtask}`).addEventListener('click', App.events.onTaskUpdate)

            },

            onTaskUpdate: async (e) => {

                e.preventDefault();

                var idtask = e.target.className;

                var tarea = document.getElementById(`txt_input_fin_${idtask}`).value;

                App.htmlElements.mainTaskList.innerHTML = "";

                await App.utils.put("http://localhost:4000/api/v1/tasks/",{

                        name: tarea,
                        completed: idtask
    
                    },
                        {name: idtask}
                    
                    );
                
                App.initializeData.tasks();

                
            },


            onTaskDelete: async (e) => {
                App.htmlElements.mainTaskList.innerHTML = "";
                e.preventDefault();
                
                var ide = e.currentTarget.className;
                console.log(ide)
                
                await App.utils.delete("http://localhost:4000/api/v1/tasks/", {

                    name: ide 

                }
                );
                App.initializeData.tasks();
            },
        },
        




        utils: {

            get: async (url, method) => {
                const requestOptions = { method };
                const response = await fetch(url, requestOptions);
                return response.json();
            },
            // Ejemplo implementando el metodo POST:
            postData: async (url = '', data = {}) => {
                // Opciones por defecto estan marcadas con un *
                const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
                });
                return response.json(); // parses JSON response into native JavaScript objects
            },
            delete: async (url = "", id) => {

                const response = await fetch(url + id, {
                  method: "DELETE",
                  mode: "cors", 
                  cache: "no-cache", 
                  credentials: "same-origin", 
                  headers: { "Content-Type": "application/json",},
                  redirect: "follow", 
                  referrerPolicy: "no-referrer", 
                  body: JSON.stringify(id), 
                });
                return await response.json();
            },
            patch: async (url = "", data = {}, id) => {

                const response = await fetch(url + id, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
                return response.json();
            },

            put: async (url = "", data = {}, id) => {
                const response = await fetch(url + id, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
                return response.json();
            },

            addTask: ({ name, completed }) => {

                var div_fila = document.createElement("div");

                var attributo = ""

                if (completed == "true"){

                    attributo = "disabled=true"

                }

                div_fila.innerHTML =
                

                `<div id="ext_${name}">
                    <input type="checkbox" name="rendered-task">
                    <label for="">${name}</label>
                    <input type="button" id="edi_${name}" class="${name}" name="edi_${name}" value="Editar">
                    <input type="button" id="del_${name}" class="${name}" name="del_${name}" value="Eliminar">
                </div><br>
                `

                div_fila.id = name;

                App.htmlElements.mainTaskList.appendChild(div_fila);

                document.getElementById(`del_${name}`).addEventListener('click', App.events.onTaskDelete)
                document.getElementById(`edi_${name}`).addEventListener('click', App.events.onClickUpdate)
                
            }



        }
    };
    App.init();
})();