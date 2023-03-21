<template>
  <v-container >
    <v-data-table style="background-color: #AFE3CC" :headers="headers" :items="desserts" class="elevation-1" black>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn class="mr-3" elevation="1" color="primary" fab dark tile x-small @click="editItem(item.id)">
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
        <v-btn class="mr-3" elevation="1" color="error" fab dark tile x-small @click="ocultarFila(item.id)">
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogResultado" max-width="700px">
      <FormResultado ref="formResultado" @actualizar="getMapping" :resultadoProp="resultadoProp" @closeCompRes="close" :idResultado="idResultado" />
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import FormResultado from './FormResultado.vue';

export default{
  name: "ItemsResultado",
  components:{
    FormResultado,
  },
  props:{
    idTimbradoHa: "",
  },
  data: () =>({
    idResultado: "",
    resultadoProp: true,
    dialogResultado: false,
    desserts: [],
    headers: [
      { text: "ID", align:"start", value:"id" },
      { text: "Resultado", value:"resultado", sortable: false, },
      { text: "Exitosos", value:"exito" },
      { text: "Fallidos", value:"fallidos" },
      { text: "Isr Timbrado", value:"isrTimbrado" },
      { text: "Descarga (URL)", value:"urlDescarga", sortable: false, },
      { text: "PDF", value:"pdf" },
      { text: "QR", value:"qr" },
      { text: "XML", value:"xml" },
      { text: "Fecha Fin", value:"fechaFinalizado" },
      { text: "Observaciones", value:"observaciones", sortable: false, },
      { text: "Opciones", value:"actions", sortable: false }
    ],
  }),
  created(){
    this.getMapping();
  },
  methods: {
    getMapping() {
      this.desserts.length = "";
      axios.get("http://localhost:8082/api/Finalizado/dataFinalizado/" + this.idTimbradoHa + "/true").then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.desserts = response.data
          /* this.desserts.push({
            id: response.data[i].id,
            resultado: response.data[i].resultado,
            exito: response.data[i].exito,
            fallidos: response.data[i].fallidos,
            isrTimbrado: response.data[i].isrTimbrado,
            urlDescarga: response.data[i].urlDescarga,
            pdf: response.data[i].pdf,
            qr: response.data[i].qr,
            xml: response.data[i].xml,
            fechaFinalizado: response.data[i].fechaFinalizado,
            observaciones: response.data[i].observaciones,
            idTimbrado: response.data[i].timbradoEntity.idTimbrado,
          }); */
        }
      });
    },
    editItem(id){
      try {
        this.idResultado = id;
        this.dialogResultado = true;
        this.$refs.formResultado.getMapping(id);
      } catch (error) {
        console.log(error);
      }
    },
    ocultarFila(id){
      let statusFalse = false;
      axios.put("http://localhost:8082/api/Finalizado/statusFinalizado/" + id, {
        status : statusFalse,
      }).then(()=>{
        this.getMapping();
      })
    },
    close() {
      this.dialog = false;
      this.dialogResultado = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  }
}
</script>