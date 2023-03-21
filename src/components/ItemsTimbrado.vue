<template>
  <v-container>
    <v-data-table
      style="background-color: #aed0e3"
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      :expanded.sync="expanded"
      show-expand
    >
      <!-- hide-default-footer -->
      <template v-slot:[`item.actions-descarga`]="{ item }">
        <div>
          <v-btn
            color="pink"
            icon
            small
            @click="descargarArchivo(item.id, item.nombreArchivo)"
          >
            <v-icon> mdi-download </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="btn-control">
          <v-btn
            class="mr-3"
            elevation="1"
            color="purple"
            fab
            dark
            tile
            x-small
            @click="agregarResultado(item.id)"
          >
            <v-icon> mdi-check </v-icon>
          </v-btn>
          <v-btn
            class="mr-3"
            elevation="1"
            color="primary"
            fab
            dark
            tile
            x-small
            @click="editItem(item.id)"
          >
            <v-icon small> mdi-pencil </v-icon>
          </v-btn>
          <v-btn
            class="mr-3"
            elevation="1"
            color="error"
            fab
            dark
            tile
            x-small
            @click="ocultarFila(item.id)"
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <ItemsResultado ref="itemResultado" :idTimbradoHa="item.id" />
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="700px">
      <FormTimbrado
        ref="formTimbrado"
        :timbradoItem="timbradoItem"
        :idTimbradoForm="idTimbradoForm"
        @closeCompTim="close"
        @actualizar="getMapping"
      />
    </v-dialog>
    <v-dialog v-model="dialogResultado" max-width="700px">
      <FormResultado
        :timbradoProp="timbradoProp"
        :idTimbrado="idTimbrado"
        @closeCompRes="close"
        @actualizar="actualizarTableResultado"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import FormResultado from "./FormResultado.vue";
import FormTimbrado from "./FormTimbrado.vue";
import ItemsResultado from "./ItemsResultado.vue";

export default {
  name: "ItemsTimbrado",
  components: {
    FormTimbrado,
    FormResultado,
    ItemsResultado,
  },
  props: {
    idCapitalHa: "",
  },
  data: () => ({
    dialog: false,
    timbradoItem: true,
    timbradoProp: true,
    result: [],
    expanded: [],
    desserts: [],
    headers: [
      { text: "ID", align: "start", value: "id" },
      { text: "Archivo", value: "actions-descarga", sortable: false },
      // { text: "Archivo", value: "archivo", sortable: false, },
      { text: "Archivo Timbrar", value: "archivoTimbrar", sortable: false },
      { text: "Fecha Inicio", value: "fechaInicio" },
      { text: "Fecha Fin", value: "fechaFin" },
      { text: "Fecha Pago", value: "fechaPago" },
      { text: "Fecha Subida", value: "fechaSubida" },
      {
        text: "SNFC",
        align: "center",
        value: "descripcionSNFC",
        sortable: false,
      },
      { text: "Estado", value: "descripcionStatus", sortable: false },
      { text: "Empleados", align: "center", value: "totalEmpleados" },
      { text: "Neto", value: "neto" },
      { text: "ISR", value: "importeIsr" },
      { text: "Ejecuciones", align: "center", value: "numEjecuciones" },
      {
        text: "Documento Contable",
        value: "documentoContable",
        sortable: false,
      },
      { text: "Numero", align: "center", value: "numero" },
      { text: "Nomina", value: "nomina" },
      { text: "Observaciones", value: "observaciones", sortable: false },
      { text: "", value: "data-table-expand" },
      { text: "Opciones", value: "actions", sortable: false },
    ],
    dialogResultado: false,
    idTimbrado: "",
    idTimbradoForm: "",
  }),
  created() {
    this.getMapping();
  },
  methods: {
    agregarResultado(id) {
      this.dialogResultado = true;
      this.idTimbrado = id;
      this.idTimbradoHa = id;
    },
    getMapping() {
      this.desserts.length = "";
      axios
        .get(
          "http://localhost:8082/api/Timbrado/dataTimbrado/" +
            this.idCapitalHa +
            "/true"
        )
        .then((response) => {
          this.result = response.data.data;
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              // id: response.data[i].capitalHEntity.id,
              id: response.data[i].id,
              archivo: response.data[i].archivo,
              archivoTimbrar: response.data[i].archivoTimbrar,
              totalEmpleados: response.data[i].totalEmpleados,
              fechaInicio: response.data[i].fechaInicio,
              fechaFin: response.data[i].fechaFin,
              fechaPago: response.data[i].fechaPago,
              descripcionSNFC: response.data[i].catalogoSNFCEntity.descripcion,
              importeIsr: response.data[i].importeIsr,
              descripcionStatus:
                response.data[i].catalogoStatusEntity.descripcion,
              fechaSubida: response.data[i].fechaSubida,
              neto: response.data[i].neto,
              numEjecuciones: response.data[i].numEjecuciones,
              observaciones: response.data[i].observaciones,
              documentoContable: response.data[i].documentoContable,
              numero: response.data[i].numero,
              nomina: response.data[i].nomina,
              nombreArchivo: response.data[i].nombreArchivo,
            });
          }
        });
    },
    actualizarTableResultado() {
      this.$refs.itemResultado.getMapping();
    },
    ocultarFila(id) {
      let statusFalse = false;
      axios
        .put("http://localhost:8082/api/Timbrado/statusTimbrado/" + id, {
          status: statusFalse,
        })
        .then(() => {
          this.getMapping();
        });
    },
    editItem(id) {
      try {
        this.idTimbradoForm = id;
        this.dialog = true;
        this.$refs.formTimbrado.getMapping(id);
      } catch (error) {
        console.log(error);
      }
    },
    descargarArchivo(id, nombreArchivo) {
      axios({
        url: "http://localhost:8082/api/Timbrado/descargar/" + id,
        method: "GET",
        responseType: "blob",
        /* headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.token}`,
        }, */
      })
        .then((response) => {
          let url = window.URL.createObjectURL(new Blob([response.data]));
          let link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", nombreArchivo);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {});
    },
    close() {
      this.dialog = false;
      this.dialogResultado = false;
      /* this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }); */
    },
  },
};
</script>

<style scoped>
/* @import "../style/CapitalH.css"; */
.btn-control {
  display: flex;
}
</style>
