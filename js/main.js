//Seleccionamos los elementos HTML correspondientes por medio de Ids para poder realizar el cáculo
//Cada elemento seleccionado llama a una función posteriormente creada, para que realice el proceso correspondiente
document.getElementById("calcular").addEventListener("click",calcular );
//Realizamos una función la cual nos preguntara por medio de una condicional si queeremos realizar un calculo extra,
//Si no se cumple el condicional nos redireccionará a otra página, en este caso, a la página principal del Ministerio de Hacienda
document.getElementById("borrar").addEventListener("click", function() {
    if (confirm("¿Desea realizar otro cálculo?")) {
        nuevoCalculo();
    } else {
        window.location.href = "https://www.mh.gob.sv/";
    }
});


//Declaramos 3 variables las cuales nos ayudarán a capturar los input del usuario por medio de un función tipo flecha
//y el metodo "change"
document.getElementById("tipo").addEventListener("change", (event) => {
    var salario = document.getElementById("salario");
	var tipo = event.target.value;
    //Con selectText capturamos la opción seleccionada en texto
    var selectText = event.target.options[event.target.selectedIndex].text;
    
	switch(tipo){
    	case 'mensual':
        	
            
        	salario.placeholder = '$0.00 - ' + selectText
        break;
        case 'quincenal':
        
            
        	salario.placeholder = '$0.00 - ' + selectText
        break;
        case 'semanal':
        	
            
        	salario.placeholder = '$0.00 - ' + selectText
        break;
    }
});

        //Con esta función se calculara cada prestación correspondiente
		function calcular() {
            var salario = document.getElementById("salario").value;
            var tipo = document.getElementById('tipo').value;
            var selectText = document.getElementById('tipo').options[document.getElementById('tipo').selectedIndex].text;

            var dividirEntre = 1;
            //Establecemos la candiad de veces que se debe dividir el cáculo en función del tipo de salario seleccionado.
            if (tipo == 'semanal') {
                dividirEntre = 4;
            }
            else if (tipo == 'quincenal') {
                dividirEntre = 2;
            }
            else if (tipo == 'mensual') {
                dividirEntre = 1;
            }

            //En este apartado establecemos las constantes que nos ayudarán a calcular las prestaciones correspondientes
            //Tomando en cuenta que estas variables están establecidas por la ley
            const porcentajeAFP = 0.0725;
            const limite = 7045.06;
            const baseAFP = (limite * porcentajeAFP).toFixed(2);

            const baseAfpPatronal = 545.99;
            const baseIsssPatronal = 75;
            
            //Si un dado caso no escribe nada el usuario o simplemente escribe un cero, retornará sin realizar ninguna operacion
            if(salario == 0)return;

            
            //Inicializamos la variable en 0, que posteriormente almacenará el salario neto mensual después de los posterioers cálculos
            var netoMensual = 0;
            /**
             * En este apartado si el resultado de la multiplicación de la variable declarada es mayor a la baseAfpPatronal/dividirEntre
             * se utiliza un operador ternario, para indicar que el resultado va hacer igual al monto de la baseAfpPatronal
             */
            var afpPatronal = ((salario * 0.0775)) > baseAfpPatronal/dividirEntre ? baseAfpPatronal/dividirEntre : salario * 0.0775;
            /**
             * En este apartado si el resultado de la multiplicación de la variable declarada es mayor a la baseIsssPatronal/dividirEntre
             * se utiliza un operador ternario, para indicar que el resultado va hacer igual al monto de la baseIsssPatronal
             */
            var isssPatronal = (salario * 0.075) > baseIsssPatronal/dividirEntre ? baseIsssPatronal/dividirEntre : salario * 0.075;
            /**
             * En este apartado si el resultado de la multiplicación de la variable declarada es mayor a la baseAFP/dividirEntre
             * se utiliza un operador ternario, para indicar que el resultado va hacer igual al monto de la baseAFP
             */
            var AFP = (salario * porcentajeAFP) > baseAFP/dividirEntre ? baseAFP/dividirEntre : salario * porcentajeAFP;

            /**
             * Esta variable nos va a guardar el resultado del salario digitado por el usuario - el resultado del AFP Laboral
             * calculado en el proceso anterior
             */
            var salarioAFP = salario - AFP;
            /**
             * Esta variable nos va a guardar el resultado del calculo del ISSS, el cual es el salario digitado por el salario,
             * el 3% establecido por la ley, teniendo en cuenta su respectivo limite de $30, si es mayor a esa cantidad, 
             * va a tener el valor de $30 el resultado del calculo del ISSS
             */
            const ISSS = ((salario * 0.03)) > 30 ? 30/dividirEntre : salario * 0.03;

            const renta = calcularRenta(salario, AFP, ISSS, tipo)
            var descuentoT = AFP + ISSS + renta;
            netoMensual = salario - AFP - ISSS - renta;
            
			/**Mostrar los resultados en los inputs del fomulario */
            document.getElementById('tipoCalculo').value = selectText;
            document.getElementById('afpPatronal').value = '$' + afpPatronal.toFixed(2);
            document.getElementById('isssPatronal').value = '$' + isssPatronal.toFixed(2);
            document.getElementById('afp').value = '$' + AFP.toFixed(2);
            document.getElementById('salario-afp').value = '$' + salarioAFP.toFixed(2);
            document.getElementById('isss').value = '$' + ISSS.toFixed(2);
            document.getElementById('renta').value = "$" + renta.toFixed(2);
            document.getElementById('descuentoT').value = '$' + descuentoT.toFixed(2);
            document.getElementById('salarioNeto').value = '$' + netoMensual.toFixed(2);
        }

        //Función para poder declarar la renta
        function calcularRenta(salario, AFP, ISSS, tipo) {
            /**Declaramos variables, en este caso inicializamos las que van representar la  cuota fija*/
            var CF1 = 0;
            var CF2 = 0;
            var CF3 = 0;
            /**Declaramos variables, en este caso inicializamos las que van representar "sobre el exceso de"*/
            var EX1 = 0;
            var EX2 = 0;
            var EX3 = 0;
            /**Declaramos variables, en este caso inicializamos las que van representar los limites inferiores
             * de ingresos para cada una de las 3 categorías
            */
            var H1 = 0;
            var H2 = 0;
            var H3 = 0;
            /**
             * Variable que nos va a permitir guardar la respuesta de la renta, luego de los procedimientos adecuados
            */
            var RF = 0;
            /**
             * En esta sección colocamos un condicional, para poder cambiar los datos de las variables creadas anteriormente,
             * teniendo en cuenta los datos establecidos por cada tramo
            */
            if (tipo == 'semanal') {
                CF1 = 4.42;
                CF2 = 15;
                CF3 = 72.14;
                EX1 = 118;
                EX2 = 223.81;
                EX3 = 509.52;
                H1 = 118;
                H2 = 223.81;
                H3 = 509.52;
            }
            else if (tipo == 'quincenal') {
                CF1 = 8.83;
                CF2 = 30;
                CF3 = 144.28;
                EX1 = 236;
                EX2 = 447.62;
                EX3 = 1019.05;
                H1 = 236;
                H2 = 447.62;
                H3 = 1019.05;
            }
            else if (tipo == 'mensual') {
                CF1 = 17.67;
                CF2 = 60;
                CF3 = 288.57;
                EX1 = 472;
                EX2 = 895.24;
                EX3 = 2038.10;
                H1 = 472;
                H2 = 895.24;
                H3 = 2038.10;
            }

            /**
             * Creamos una variable de tipo constante, la creamos constante porque ese valor no va a cambiar,
             * y el resultado de esa variable va a ser, el salario que digita el usuario - lo del AFP - lo del ISSS
             */
            const rentaAgravada = salario - AFP -ISSS;
                /** I TRAMO
                 * Realizamos una condicional para poder saber lo en que tramo de la tabla esta la rentaAgravada
                 */
                if (rentaAgravada > 0 && rentaAgravada <= H1) {
                    return 0;
                }
                else if (rentaAgravada > H1 && rentaAgravada <= H2) {
                    /**
                     * II TRAMO
                     * Creamos una variable para poder calcular los procedimientos correspondientes y guardar su respuesta,
                     * restamos la rentaAgravada - el excedente 1 (segundo tramo) y posteriormente el multiplicamos el porcentaje
                     * correspondiente + la cuota fija, declarada en la condicional anterior.
                     */
                    var r = rentaAgravada - EX1;
                    RF = (r * 0.1) + CF1;
                }
                else if (rentaAgravada > H2 && rentaAgravada <= H3) {
                    /**
                     * III TRAMO
                     * Creamos una variable para poder calcular los procedimientos correspondientes y guardar su respuesta,
                     * restamos la rentaAgravada - el excedente 2 (tercer tramo) y posteriormente el multiplicamos el porcentaje
                     * correspondiente + la cuota fija, declarada en la condicional anterior.
                     */
                    var r = rentaAgravada - EX2;
                    RF = (r * 0.2) + CF2;
                }
                else if (rentaAgravada > H3) {
                    /**
                     * IV TRAMO
                     * Creamos una variable para poder calcular los procedimientos correspondientes y guardar su respuesta,
                     * restamos la rentaAgravada - el excedente 3 (cuarto tramo) y posteriormente el multiplicamos el porcentaje
                     * correspondiente + la cuota fija, declarada en la condicional anterior.
                     */
                    var r = rentaAgravada - EX3;
                    RF = (r * 0.3) + CF3;
                }

            return RF;
        }
        /**
         * Función para poner en blanco todos los inputs del formulario
         */
        function nuevoCalculo() {
        	document.getElementById('tipoCalculo').value = '';
            document.getElementById('afpPatronal').value = '';
            document.getElementById('isssPatronal').value = '';
            document.getElementById('salario').value = '';
            document.getElementById('afp').value = '';
            document.getElementById('salario-afp').value = '';
            document.getElementById('isss').value = '';
            document.getElementById('renta').value = '';
            document.getElementById('descuentoT').value = '';
            document.getElementById('salarioNeto').value = '';
        }