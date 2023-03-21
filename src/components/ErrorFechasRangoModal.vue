<template>
  <v-card>
    <v-card-title> Cuidado </v-card-title>
    <v-card-text> {{ alert }} </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('closeCompError')"> Entiendo </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ErroFechasRangoModal",
  data() {
    return {
      dialogError: false,
    };
  },
  methods:{}
};
</script>