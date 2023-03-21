<template>
  <v-container class="container-CapitalHumano">
    <v-data-table :headers="headers" :items="desserts" :expanded.sync="expanded" show-expand class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="title">Capital Humano</v-toolbar-title>
          <v-divider class="mx-6" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-form ref="form" lazy-validation class="div-filter">
            <div v-show="showFilter">
              <v-text-field :rules="nameRules" solo readonly v-model="dateRangeFecha"></v-text-field>
            </div>
            <div>
              <v-btn v-show="showFilter" icon @click="getMapping">
                <v-icon color="error"> mdi-filter-remove</v-icon>
              </v-btn>
            </div>
          </v-form>
          <div class="text-center">
            <v-menu v-model="menuFechaBusqueda" :close-on-content-click="false" :nudge-width="400" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-show="algo" icon v-bind="attrs" v-on="on">
                  <v-icon> mdi-filter-plus </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-select v-model="showCalendar" label="Filtrar Por" :items="itemsFechas" hide-details></v-select>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list v-if="showCalendar.length > 0">
                  <v-list-item>
                    <v-menu :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field :rules="nameRules" v-model="dateRangeFecha" label="Fecha De Inicio - Fecha Fin"
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" required></v-text-field>
                      </template>
                      <v-date-picker v-model="datesRango" no-title range></v-date-picker>
                    </v-menu>
                  </v-list-item>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" text @click="getMapping">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary" text @click="buscarFecha">
                      Filtrar
                    </v-btn>
                  </v-card-actions>
                </v-list>
              </v-card>
            </v-menu>
          </div>
          <template>
            <v-dialog v-model="dialog" max-width="650px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="error" @click="cerrarSesion">
                  <v-icon>mdi-logout</v-icon>
                </v-btn>
                <v-divider class="mx-6" inset vertical></v-divider>
                <v-btn color="success" dark v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-divider class="mx-6" inset vertical></v-divider>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="form" lazy-validation>
                      <v-row class="form-calendar">
                        <v-col cols="12" md="4">
                          <v-text-field :rules="nameRules" label="Concepto" v-model="editedItem.concepto" required dense
                            outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field :rules="nameRules" label="Fondo" v-model="editedItem.fondo" required dense
                            outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field :rules="nameRules" label="Num. De Oficio" v-model="editedItem.numeroOficio"
                            required dense outlined></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row class="calendar-div">
                        <v-col>
                          <v-menu :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="dateRangeText" label="Fecha De Inicio - Fecha Fin"
                                prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" :rules="nameRules"
                                required></v-text-field>
                            </template>
                            <v-date-picker v-model="dates" no-title range></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col>
                          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field item-text="fechaPago" v-model="dateFechaPago" label="Fecha De Pago"
                                prepend-icon="mdi-calendar" readonly required v-bind="attrs" v-on="on"
                                :rules="nameRules"></v-text-field>
                            </template>
                            <v-date-picker v-model="dateFechaPago" @input="menu = false" no-title
                              scrollable></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field @keypress="onlyNumber" :rules="numberRules" label="Retención Isr"
                            v-model="editedItem.retencionIsr" dense required outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field @keypress="onlyNumber" :rules="numberRules" label="Ajuste Isr"
                            v-model="editedItem.ajusteIsr" dense required outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field @keypress="onlyNumber" :rules="numberRules" label="Subsidio"
                            v-model="editedItem.subsidioAjuste" dense required outlined></v-text-field>
                        </v-col>
                      </v-row>
                      <div>
                        <label v-show="false" for="">{{ calculaPago }}</label>
                        <v-text-field :rules="numberRules" readonly label="A Pagar" v-model="editedItem.pagar"
                          required></v-text-field>
                      </div>
                      <v-row v-show="false" class="main-div">
                        <v-col cols="12" md="4">
                          <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field :rules="nameRules" v-model="dateFechaCaptura" label="Fecha De Captura"
                                prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" v-show="false"
                                required></v-text-field>
                            </template>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <input type="text" v-show="false" v-model="editedItem.id" />
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="saveData">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="btn-control">
          <v-btn class="mr-3" elevation="1" color="orange" fab dark tile x-small @click="agregarTimbrado(item.id)">
            <v-icon small> mdi-bell </v-icon>
          </v-btn>
          <v-btn class="mr-3" elevation="1" color="primary" fab dark tile x-small @click="editItem(item)">
            <v-icon small> mdi-pencil </v-icon>
          </v-btn>
          <v-btn class="mr-3" elevation="1" color="error" fab dark tile x-small @click="ocultarFila(item.id)">
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <ItemsTimbrado ref="itemTimbrado" :idCapitalHa="item.id" />
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogTimbrado" max-width="700px">
      <FormTimbrado :capitalHumanoItem="capitalHumanoItem" :idCapitalH="idCapitalH" @actualizar="actualizarTableTimbrado"
        @closeCompTim="close" />
    </v-dialog>
    <v-dialog v-model="dialogErrorFecha" width="320"> 
      <ErrorFechasRangoModal @closeCompError="closeError"/>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import ErrorFechasRangoModal from "./ErrorFechasRangoModal.vue";
import FormTimbrado from "./FormTimbrado.vue";
import ItemsTimbrado from "./ItemsTimbrado.vue";

export default {
  name: "CapitalH",
  components: {
    FormTimbrado,
    ItemsTimbrado,
    ErrorFechasRangoModal
},
  data: () => ({
    nameRules: [(v) => !!v || "Este campo es requerido"],
    numberRules: [
      (v) => !!v || "Este campo es requerido",
      (v) => /^[0-9]+([.][0-9]+)?$/.test(v) || "Ejemplo : 156.26",
    ],
    dialogErrorFecha: false,
    showTxt: false,
    algo: true,
    showFilter: false,
    fechaBusqueda: "",
    fechasRango: "",
    showCalendar: "",
    capitalHumanoItem: true,
    dialog: false,
    dialogTimbrado: false,
    search: "",
    expanded: [],
    headers: [
      { text: "ID", align: "start", value: "id" },
      { text: "Concepto", value: "concepto", sortable: false },
      { text: "Fondo", value: "fondo", sortable: false },
      { text: "Número de Oficio", value: "numeroOficio", sortable: false },
      { text: "Fecha de Inicio", value: "fechaInicio" },
      { text: "Fecha Fin", value: "fechaFin" },
      { text: "Fecha Pago", value: "fechaPago" },
      { text: "Retención Isr", value: "retencionIsr" },
      { text: "Ajuste Isr", value: "ajusteIsr" },
      { text: "Subsidio", value: "subsidioAjuste" },
      { text: "A Pagar", value: "pagar" },
      { text: "", value: "data-table-expand" },
      { text: "Opciones", value: "actions", sortable: false },
    ],
    itemsFechas: ["Fecha De Inicio", "Fecha De Fin", "Fecha De Pago"],
    idCapitalH: "",
    status: true,
    result: [],
    menu1: false,
    menu: false,
    menuFechaBusqueda: false,
    dates: [],
    datesRango: [],
    dateFechaPago: "",
    dateFechaCaptura: new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
    desserts: [],
    editedIndex: -1,
    editedItem: [
      {
        concepto: "",
        fondo: "",
        numeroOficio: "",
        retencionIsr: "",
        ajusteIsr: "",
        dates: "",
        subsidio: "",
        pagar: 0,
      },
    ],
  }),
  created() {
    this.getMapping();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    token() {
      this.token = localStorage.token;
    },
  },
  computed: {
    calculaPago() {
      let retencionIsrLocal = this.editedItem.retencionIsr;
      let ajusteIsrLocal = this.editedItem.ajusteIsr;
      let subsidioAjuste = this.editedItem.subsidioAjuste;

      if (retencionIsrLocal == undefined || retencionIsrLocal.length == 0) {
        retencionIsrLocal = 0.0;
      }
      if (ajusteIsrLocal == undefined || ajusteIsrLocal.length == 0) {
        ajusteIsrLocal = 0.0;
      }
      if (subsidioAjuste == undefined || subsidioAjuste.length == 0) {
        subsidioAjuste = 0.0;
      }
      this.editedItem.pagar =
        retencionIsrLocal - ajusteIsrLocal - subsidioAjuste;
      this.editedItem.pagar = this.editedItem.pagar.toFixed(2);
      return retencionIsrLocal - ajusteIsrLocal - subsidioAjuste;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar" : "Editar";
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    dateRangeFecha() {
      return this.datesRango.join(" ~ ");
    },
  },
  methods: {
    agregarTimbrado(id) {
      this.dialogTimbrado = true;
      this.idCapitalH = id;
      this.idCapitalHa = id;
    },
    getMapping() {
      this.desserts.length = "";
      // interceptor();
      axios
        .get("http://localhost:8082/api/CapitalHumano/dataCapital/true")
        .then((response) => {
          // console.log(auth.token)
          this.desserts = response.data;
          this.menuFechaBusqueda = false;
          this.algo = true;
          this.showFilter = false;
          this.showTxt = false;
        });
    },
    saveData: function () {
      let validate = this.$refs.form.validate();
      if (validate) {
        if (this.dates[1]) {
          if (this.editedIndex > -1) {
            let url =
              "http://localhost:8082/api/CapitalHumano/" + this.editedItem.id;
            let put = axios.put;
            this.tipoDeGuardado(put, url);
          } else {
            let url = "http://localhost:8082/api/CapitalHumano";
            let post = axios.post;
            this.tipoDeGuardado(post, url);
          }
        } else {
          this.dialogErrorFecha = true;
        }
      } else {
        console.log("Eror");
      }
    },
    tipoDeGuardado(tipoAxios, direccion) {
      tipoAxios(direccion, {
        concepto: this.editedItem.concepto,
        fondo: this.editedItem.fondo,
        numeroOficio: this.editedItem.numeroOficio,
        fechaInicio: this.dates[0],
        fechaFin: this.dates[1],
        fechaPago: this.dateFechaPago,
        retencionIsr: this.editedItem.retencionIsr,
        ajusteIsr: this.editedItem.ajusteIsr,
        subsidioAjuste: this.editedItem.subsidioAjuste,
        pagar: this.editedItem.pagar,
        fechaCaptura: this.dateFechaCaptura,
        status: this.status,
      })
        .then(() => {
          this.getMapping();
          this.close();
        })
        .catch(() => {
          this.close();
        });
    },
    actualizarTableTimbrado() {
      this.$refs.itemTimbrado.getMapping();
    },
    buscarFecha() {
      let validate = this.$refs.form.validate();
      if (validate) {
        if (this.showCalendar === "Fecha De Pago") {
          this.desserts.length = "";
          let url =
            "http://localhost:8082/api/CapitalHumano/fechasPago/" +
            this.datesRango[0] +
            "/" +
            this.datesRango[1] +
            "/true";
          this.tipoFechaBusqueda(url);
        }else
        if (this.showCalendar === "Fecha De Inicio") {
          this.desserts.length = "";
          let url =
            "http://localhost:8082/api/CapitalHumano/fechasInicio/" +
            this.datesRango[0] +
            "/" +
            this.datesRango[1] +
            "/true";
          this.tipoFechaBusqueda(url);
        }
        if (this.showCalendar === "Fecha De Fin") {
          this.desserts.length = "";
          let url =
            "http://localhost:8082/api/CapitalHumano/fechasFin/" +
            this.datesRango[0] +
            "/" +
            this.datesRango[1] +
            "/true";
          this.tipoFechaBusqueda(url);
        }
      } else {
        console.log("Error")
      }
    },
    tipoFechaBusqueda(direccion) {
      axios
        .get(direccion)
        .then((response) => {
          // console.log("Entro");
          this.desserts = response.data;
          this.menuFechaBusqueda = false;
          this.algo = false;
          this.showFilter = true;
          this.showTxt = true;
        })
        .catch((error) => { });
    },
    ocultarFila(id) {
      let statusFalse = false;
      axios
        .put("http://localhost:8082/api/CapitalHumano/statusCapital/" + id, {
          status: statusFalse,
        })
        .then(() => {
          this.getMapping();
        });
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      try {
        axios
          .get("http://localhost:8082/api/CapitalHumano/" + item.id)
          .then((response) => {
            this.dialog = true;
            this.editedItem = response.data;
            this.dateFechaPago = response.data.fechaPago;
            this.dates = [response.data.fechaInicio, response.data.fechaFin];
          });
      } catch (error) { }
      // this.dialog = true;
    },
    cerrarSesion() {
      localStorage.removeItem("token");
      // console.log(auth.token)
      this.$router.push({ path: "/" });
    },
    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.dialogTimbrado = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        (this.dateFechaPago = ""), (this.dates = []);
        this.editedIndex = -1;
      });
    },
    closeError(){
      this.dialogErrorFecha = false;
    },
    onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

<style scoped>
/* @import "../style/CapitalH.css"; */

.btn-control {
  display: flex;
}

.div-filter {
  display: flex;
  margin-top: 30px;
}
</style>
