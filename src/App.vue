<script>
export default {
  data() {
    return {
      clients: 0,
      clientsGenerate: 0,
      endNumber: 10,
      transaccionesRealizadas: '',
      idClient: '',
      maxTransacciones: 5,
      transacFinish: false,
      transacPending: false,
      finish: false

    }
  },
  methods: {
    sendClient() {
      this.endNumber = this.clients;
    },
    async simulateQueue(totalClientes) {
      this.cola = new Queue();
      let cajero = new Cajero(this); // instancia de Cajero dentro del método simulateQueue
      let quedaronTransacciones = true;
      for (let i = 1; i <= totalClientes; i++) {
        this.cola.enqueue(new Cliente(i));
      }
      console.log(`Cantidad de clientes en this.cola: ${this.cola.items.length}`);

      while (!this.cola.isEmpty()) {
        let cliente = this.cola.dequeue();

        console.log(`Pasa a atenderse el cliente ${cliente.id}`);

        quedaronTransacciones = await cajero.atenderCliente(cliente);
        if (!quedaronTransacciones) {
          this.cola.enqueue(cliente);  
        }
        await wait(TIEMPO_ATENCION);
      }
    }, attendTrans(transaccionesRealizadas, idClient, maxTransacciones, finish) {
      this.idClient = idClient;
      this.transaccionesRealizadas = transaccionesRealizadas;
      this.maxTransacciones = maxTransacciones;
      this.finish = finish;
    },
    addNewElement() {
      this.array.push(this.array.length + 1);
      this.cola.enqueue(new Cliente(cola.items.length + 1)); //! No funciona, pues no reconoce "cola"
    },
  },
  computed: {
    array() {
      const result = []
      for (let i = 1; i <= this.endNumber; i++) {
        result.push(i)
      }
      return result
    }
  },
  mounted() {
    this.sendClient()
  }
}

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
  constructor(vueInstance) {
    this.maxTransacciones = 5;
    this.transaccionesRealizadas = 0;
    this.vueInstance = vueInstance;
  }
  async atenderCliente(cliente) {
    this.transaccionesRealizadas = 0;

    while (this.transaccionesRealizadas <= this.maxTransacciones) {
      this.transaccionesRealizadas++;
      await wait(TIEMPO_ATENCION);
      cliente.reducirTransacciones();
      this.vueInstance.attendTrans(this.transaccionesRealizadas, cliente.id, this.maxTransacciones, cliente.hayTransacciones());
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
</script>
<template>
  <div class="queue d-flex flex-column align-items-center justify-content-center w-100">
    <div class="btn btn-warning w-50 my-3">Banco</div>
    <div class="d-flex">
            
      <!-- Botones e input de usuarios -->
      <h5 class="mt-2">Usuarios: </h5>
      <input class="input-group mx-2" type="text" v-model="clients">
      <button class="btn btn-dark mx-2" @click="sendClient()">Enviar</button>
      <button class="btn btn-info mx-2" @click="simulateQueue(this.clients)">Start</button>
      <button class="btn btn-info mx-2" @click="addNewElement()">Agregar nuevo elemento</button>

    </div>
    <div class="item-queue d-flex flex-column ">
      <!-- Creacion de usuarios -->
      <div v-for="n in array" :key="n" :class="{ 'btn-danger': idClient === n }" class="btn btn-primary my-2">
        Usuario: {{ n }}

        <!-- Creacion de las transacciones -->
        <div v-for="i in maxTransacciones" :key="i" class="btn btn-light mx-2"
          :class="{ 'btn-dark': transaccionesRealizadas === i && idClient === n }">
          {{ i }}
        </div>
                
        <!-- Textos de finalizacion o en pendiente -->
        <div :class="{ 'finalizado': finish === false && maxTransacciones === transaccionesRealizadas && idClient === n }"
          v-if="finish === false && maxTransacciones === transaccionesRealizadas && idClient === n">Finalizado</div>
        <div v-if="finish === true && maxTransacciones === transaccionesRealizadas && idClient === n">Aun tiene
          transacciones pendientes</div>
      </div>
    </div>
  </div>
</template>

<style>
.finalizado {
  background: #cccc;
}
</style>