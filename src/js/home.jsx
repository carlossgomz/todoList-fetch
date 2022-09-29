import React, { useState, useEffect } from "react";


const Home = () => {

	const [tarea, setTarea] = useState({ label: "", done: false })

	const [lisTarea, setlisTarea] = useState([]);

	const urlBase = "https://assets.breatheco.de/apis/fake/todos/user"
	const userBase = "gabriel"

	// 3) PUT///INICIO///
	const agregarTarea = async (item) => {
		if (item.key === "Enter") {
			if (tarea.label.trim() !== "") {                                  //si es distinto de vacio es xq tiene una tarea y la guarda 
				try {
					let response = await fetch(`${urlBase}/${userBase}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify([...lisTarea, tarea]),
					});
					if (response.ok) {
						setTarea({ label: "", done: false })
						getTodos()
					}
				} catch (error) {
					console.log(error)
				}
			} else {
				console.log('campos son obligatorios')
			}
		}
	};
	/////PUT/////FIN////

	const manejarInput = (item) => {
		setTarea({ ...tarea, [item.target.name]: item.target.value })
	}
	//////DELETE/////

	const borrarTarea = async (id) => {
		let newList = lisTarea.filter((item, index) => {
			if (id !== index) {
				return item
			}
		})
		try {
			let response = await fetch(`${urlBase}/${userBase}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newList)
			})
			if (response.ok) {
				getTodos()
			}
		} catch (error) {
			console.log(`Explote este es el error: ${error}`)
		}
		
	};
	///// 1) GET API//////

	const getTodos = async () => {		                                    //funcion para consultar la Api con el metodo async await///	
		try {
			let response = await fetch(`${urlBase}/${userBase}`)             //en esta linea se esta haciendo la consulta del fetch/// 
			let data = await response.json()
			//paso la respuesta a formato .json para que sea entendible para javascrip//
			if (response.status !== 404) {                                   // aqui verifico si hay usuario creado o no. 
				setlisTarea(data)

			} else {             /// 2) POST /////
				let responseTodos = await fetch(`${urlBase}/${userBase}`, {
					method: "POST",                                            //usamos el metodo POST////para crear el usuario
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify([])
				})

				if (responseTodos.ok) {
					getTodos()
				}
			}

		} catch (error) {
			console.log(`Explote : ${error}`)
		}
	}

	useEffect(() => {  		                                         //esto es para que el fetch se llame solo una vez  tengo que importarlo arriba.
		getTodos()
	}, [])                                                           //los [] son para que se ejecute solo una vez, importante no olvidar ponerlo

	return (
		<div className="container-principal d-flex justify-content-center py-5">
			<div className="row">
				<div className="contenedor-titulo text-center">
					<h1>TodoList</h1>
				</div >

				<ul className="card">
					<div className="contenedor-input text-center">
						<input className="input w-100"
							type="text"
							placeholder="Agrega tu tarea"
							onChange={manejarInput}
							onKeyDown={agregarTarea}
							name="label"
							value={tarea.label} />
					</div>

					{lisTarea.map((item, index) => {
						return (
							<div className="col-12 fancy inputText d-flex justify-content-between my-4" key={index}>
								{item.label}
								<button className=" fancy btn" type="button" onClick={() => borrarTarea(index)}><i className="fas fa-times"></i></button>
							</div>
						)
					})}
					<p className="item">{lisTarea.length}  Tareas</p>
				</ul>
			</div>
		</div>
	);
};

export default Home;