
// Back del algoritmo original

let TIEMPO_ATENCION = 1000;

class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length == 0;
    }
    printQueue() {
        let str = "";
        for (let i = 0; i < this.items.length; i++) str += this.items[i] + " ";
        return str;
    }
}

class Cliente {
    constructor(id) {
        this.id = id;
        this.transacciones = Math.floor(Math.random() * 10) + 1;
    }
    reducirTransacciones() {
        this.transacciones--;
    }
    hayTransacciones() {
        return this.transacciones > 0;
    }
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class Cajero {
    constructor() {
        this.maxTransacciones = 5;
        this.transaccionesRealizadas = 0;
    }

    async atenderCliente(cliente) {
        this.transaccionesRealizadas = 0;

        while (this.transaccionesRealizadas <= this.maxTransacciones) {
            this.transaccionesRealizadas++;

            console.log(`Atendiendo transacción ${this.transaccionesRealizadas} del cliente ${cliente.id} con el cajero`);
            await wait(TIEMPO_ATENCION);
            cliente.reducirTransacciones();
        }

        if (cliente.hayTransacciones()) {
            console.log(`El cliente ${cliente.id} ha sido atendido, queda con transacciones pendientes`);
            return false
        } else {
            console.log(`El cliente ${cliente.id} ha sido atendido`);
            return true
        }
    }

}

async function simulateQueue(totalClientes) {
    let cola = new Queue();
    let cajero = new Cajero();
    let quedaronTransacciones = null; // Se declara la variable y se le asigna un valor por defecto

    // Agregar clientes a la cola
    for (let i = 1; i <= totalClientes; i++) {
        cola.enqueue(new Cliente(i));
    }

    console.log(`Cantidad de clientes en cola: ${cola.items.length}`);

    // Atender a los clientes en la cola
    while (!cola.isEmpty()) {
        let cliente = cola.dequeue();

        console.log(`Pasa a atenderse el cliente ${cliente.id}`);

        quedaronTransacciones = await cajero.atenderCliente(cliente)
        if (!quedaronTransacciones) {
            cola.enqueue(cliente);
        }

        await wait(TIEMPO_ATENCION);
    }
}

simulateQueue(10); // Simular la atención de 10 clientes