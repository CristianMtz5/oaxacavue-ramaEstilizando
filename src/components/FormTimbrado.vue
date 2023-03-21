<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Timbrar</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form name="formTimbrado" ref="form" lazy-validation enctype="multipart/form-data">
          <v-row class="form-calendar">
            <v-col cols="12" md="4">
              <v-text-field :rules="txtRules" label="Archivo Timbrado" v-model="editedItem.archivoTimbrar" required dense
                outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field :rules="numberRules" @keypress="onlyNumber" label="Total de Empleados"
                v-model="editedItem.totalEmpleados" required dense outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field :rules="txtRules" label="Documento Contable" v-model="editedItem.documentoContable" dense
                required outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row class="calendar-div">
            <v-col>
              <v-menu :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field :rules="txtRules" v-model="dateRangeText" label="Fecha De Inicio - Fecha Fin"
                    prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dates" no-title range></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu v-model="menuFPago" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field :rules="txtRules" v-model="dateFechaPago" label="Fecha De Pago"
                    prepend-icon="mdi-calendar" readonly required v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dateFechaPago" @input="menuFPago = false" no-title scrollable></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-select :rules="txtRules" label="SNFC" v-model="descripcionSNFC" item-text="descripcion" item-value="id"
                :items="snfc" dense outlined></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select :rules="txtRules" label="Estatus Timbrado" v-model="descripcionStatus" item-text="descripcion"
                item-value="id" :items="statusTable" dense outlined></v-select>
            </v-col>
            <v-col>
              <v-menu v-model="menuFSubida" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field :rules="txtRules" v-model="dateFechaSubida" label="Fecha De Subida"
                    prepend-icon="mdi-calendar" readonly required v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dateFechaSubida" @input="menuFSubida = false" no-title scrollable></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field :rules="numberFloatRules" @keypress="onlyNumber" label="Importe Isr"
                v-model="editedItem.importeIsr" dense required outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field :rules="numberFloatRules" @keypress="onlyNumber" label="Neto" v-model="editedItem.neto" dense
                required outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field :rules="txtRules" label="Nómina" v-model="editedItem.nomina" dense required
                outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field :rules="numberRules" @keypress="onlyNumber" label="Número" v-model="editedItem.numero" dense
                required outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field :rules="numberRules" @keypress="onlyNumber" label="Número de Ejecuciones"
                v-model="editedItem.numEjecuciones" dense required outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-file-input accept=".rar" v-if="capitalHumanoItem" v-model="editedItem.archivo" label="Guardar Archivo"
                value="file" outlined dense :rules="fileRules"></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea rows="3" :rules="txtRules" label="Observaciones" v-model="editedItem.observaciones"
                name="input-7-4" outlined></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error darken-1" text @click="closeTimbrado">
        Cancelar
      </v-btn>
      <v-btn color="blue darken-1" text @click="saveData"> Guardar </v-btn>
    </v-card-actions>
    <v-dialog v-model="dialogErrorFecha" width="320">
      <ErrorFechasRangoModal @closeCompError="closeError" />
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import ErrorFechasRangoModal from "./ErrorFechasRangoModal.vue";

export default {
  name: "FormTimbrado",
  components: {
    ErrorFechasRangoModal,
  },
  props: {
    idCapitalH: "",
    idTimbradoForm: "",
    text: "",
    capitalHumanoItem: true,
    timbradoItem: true,
  },
  data: () => ({
    txtRules: [(v) => !!v || "Este campo es requerido"],
    numberFloatRules: [
      (v) => !!v || "Este campo es requerido",
      (v) => /^[0-9]+([.][0-9]+)?$/.test(v) || "Ejemplo : 156.26",
    ],
    numberRules: [
      (v) => !!v || "Este campo es requerido",
      (v) => /^[0-9]+$/.test(v) || "Solo números enteros: 0-9",
    ],
    fileRules: [(v) => !!v || "Este campo es requerido"],
    search: "",
    result: {},
    snfc: [],
    statusTable: [],
    status: true,
    dates: [],
    menuFPago: false,
    dateFechaPago: "",
    menuFSubida: false,
    dateFechaSubida: "",
    desserts: [],
    editedIndex: -1,
    descripcionSNFC: "",
    descripcionStatus: "",
    editedItem: [
      {
        archivo: "",
        archivoTimbrar: "",
        totalEmpleados: "",
        importeIsr: "",
        neto: "",
        documentoContable: "",
        numero: "",
        numEjecuciones: "",
        nomina: "",
        idCapitalHumano: "",
        observaciones: "",
      },
    ],
    idToUpdateFile: "",
    dialogErrorFecha: false,
  }),
  created() {
    this.getMapping();
    this.getSNFC();
    this.getStatus();
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    agregarFinalizado(id) {
      // console.log(id);
      this.dialog = true;
    },
    getSNFC() {
      axios.get("http://localhost:8082/api/SNFC").then((response) => {
        this.snfc = response.data;
      });
    },
    getStatus() {
      axios.get("http://localhost:8082/api/Status").then((response) => {
        this.statusTable = response.data;
      });
    },
    getMapping(idTimbradoTable) {
      if (this.idTimbradoForm !== undefined) {
        if (idTimbradoTable === undefined) {
          idTimbradoTable = this.idTimbradoForm;
        }
        try {
          axios
            .get("http://localhost:8082/api/Timbrado/" + idTimbradoTable)
            .then((response) => {
              // console.log(response.data);
              this.editedItem = response.data;
              this.editedItem.idCapitalHumano = response.data.capitalHEntity.id;
              this.descripcionSNFC = response.data.catalogoSNFCEntity.id;
              this.descripcionStatus = response.data.catalogoStatusEntity.id;
              this.dates = [response.data.fechaInicio, response.data.fechaFin];
              this.dateFechaPago = response.data.fechaPago;
              this.dateFechaSubida = response.data.fechaSubida;
            });
          this.$refs.form.resetValidation();
        } catch (error) { }
      }
    },
    saveData() {
      let validarForm = this.$refs.form.validate();
      if (validarForm) {
        if (this.dates[1]) {
          if (this.capitalHumanoItem) {
            let url = "http://localhost:8082/api/Timbrado";
            let post = axios.post;
            this.guardarDatos(post, url);
          } else if (this.timbradoItem) {
            let url =
              "http://localhost:8082/api/Timbrado/" + this.idTimbradoForm;
            let put = axios.put;
            this.actualizarDatos(put, url);
          }
        }else{
          this.dialogErrorFecha = true;
        }
      } else {
        // console.log("Error");
      }
    },
    actualizarDatos(tipoAxios, direccion) {
      if (this.idCapitalH === undefined) {
        this.idCapitalH = this.editedItem.idCapitalHumano;
      }
      tipoAxios(direccion, {
        // archivo: this.editedItem.archivo,
        archivoTimbrar: this.editedItem.archivoTimbrar,
        totalEmpleados: this.editedItem.totalEmpleados,
        fechaInicio: this.dates[0],
        fechaFin: this.dates[1],
        fechaPago: this.dateFechaPago,
        catalogoSNFCEntity: { id: this.descripcionSNFC },
        catalogoStatusEntity: { id: this.descripcionStatus },
        fechaSubida: this.dateFechaSubida,
        importeIsr: this.editedItem.importeIsr,
        neto: this.editedItem.neto,
        documentoContable: this.editedItem.documentoContable,
        numero: this.editedItem.numero,
        numEjecuciones: this.editedItem.numEjecuciones,
        nomina: this.editedItem.nomina,
        capitalHEntity: { id: this.idCapitalH },
        observaciones: this.editedItem.observaciones,
        status: this.status,
      })
        .then((response) => {
          this.closeTimbrado();
          this.$emit("actualizar");
        })
        .catch(() => {
          this.closeTimbrado();
        });
    },
    guardarDatos(tipoAxios, direccion) {
      tipoAxios(direccion, {
        // archivo: this.editedItem.archivo,
        archivoTimbrar: this.editedItem.archivoTimbrar,
        totalEmpleados: this.editedItem.totalEmpleados,
        fechaInicio: this.dates[0],
        fechaFin: this.dates[1],
        fechaPago: this.dateFechaPago,
        catalogoSNFCEntity: { id: this.descripcionSNFC },
        catalogoStatusEntity: { id: this.descripcionStatus },
        fechaSubida: this.dateFechaSubida,
        importeIsr: this.editedItem.importeIsr,
        neto: this.editedItem.neto,
        documentoContable: this.editedItem.documentoContable,
        numero: this.editedItem.numero,
        numEjecuciones: this.editedItem.numEjecuciones,
        nomina: this.editedItem.nomina,
        capitalHEntity: { id: this.idCapitalH },
        observaciones: this.editedItem.observaciones,
        status: this.status,
      })
        .then((response) => {
          let formData = new FormData();
          formData.append("file", this.editedItem.archivo);
          axios
            .put(
              "http://localhost:8082/api/Timbrado/upload/" + response.data.id,
              formData
            )
            .then(() => {
              this.$emit("actualizar");
            });
          this.closeTimbrado();
        })
        .catch(() => {
          this.closeTimbrado();
        });
    },
    closeTimbrado() {
      this.$emit("closeCompTim");
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.descripcionSNFC = "";
        this.descripcionStatus = "";
        this.dates = [];
        this.dateFechaPago = "";
        this.dateFechaSubida = "";
        this.editedIndex = -1;
      });
    },
    closeError() {
      this.dialogErrorFecha = false;
    },
    onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    showFecha() {
      this.dateFechaPago = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
    },
  },
};
</script>
