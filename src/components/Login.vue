<template>
  <main>
    <div class="box">
      <div class="inner-box">
        <div class="forms-wrap">
          <form action="index.html" autocomplete="off" class="sign-in-form">
            <div class="heading">
              <h2>Iniciar Sesión</h2>
            </div>
            <div class="actual-form">
              <div class="input-email">
                <v-text-field color="#151111" v-model="email" required outlined label="Email" append-icon="mdi-email"
                  :rules="emailRules"></v-text-field>
              </div>
              <div clas="input-password">
                <v-text-field color="#151111" v-model="password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'" name="input-10-1" label="Contraseña" outlined
                  @click:append="show = !show" :rules="passwordRules"></v-text-field>
              </div>
              <div class="btn-control">
                <v-btn class="btn-control" x-large block dark @click="obtenerToken" color="#151111">Acceder</v-btn>
              </div>
            </div>
          </form>
        </div>
        <div class="carousel">
          <div class="images-wrapper">
            <img src="../resources/img/municipio.png" class="image img-1 show" alt="" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import ErrorFechasRangoModal from "./ErrorFechasRangoModal.vue";

export default {
  name: "Login",
  components: {
    ErrorFechasRangoModal
  },
  data: () => ({
    show: false,
    email: "",
    emailRules: [(v) => !!v || "Este campo es requerido"],
    password: "",
    passwordRules: [(v) => !!v || "Este campo es requerido"],
    dialogErrorFecha: false,
  }),
  methods: {
    obtenerToken() {
      let validarForm = this.$refs.formLogin.validate();
      if (validarForm) {
        let userCred = {
          email: this.email,
          password: this.password,
        };
        axios
          .post("http://localhost:8082/login", userCred, {})
          .then((response) => {
            const headers = response.headers;
            const bToken = headers.get("Authorization");
            const token = bToken.replace("Bearer ", "");
            localStorage.setItem("token", token);
            this.$router.push({ path: "/CapitalHumano" });
          })
          .catch((error) => {
            this.dialogErrorFecha = true
          });
      } else {
      }
    },
    closeError() {
      this.dialogErrorFecha = false;
    },
  },
};
</script>

<style scoped>
@import "../style/Login.css";
/* .container-login {
  width: 500px;
  height: 500px;
} */
</style>
