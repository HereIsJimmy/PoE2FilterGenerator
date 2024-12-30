
<template>
  <!-- <router-link to="/create" class="routerlink btn-primary btn-lg" tag="button">Create Filter</router-link> -->
  <!-- <router-link to="/edit" class="routerlink btn-success btn-lg" tag="button">Edit Filter</router-link> -->
  <router-view />
</template>

<script setup lang="ts">
// import { ref } from "vue";
// import { storeToRefs } from "pinia";
// import { useCounterStore } from "../store/counter";
// defineProps<{ msg: string }>();

// const { count } = storeToRefs(useCounterStore());
// const filePath = ref(null);
// const openFile = async () => {
//   //@ts-ignore
//   filePath.value = await window.electronAPI.openFile();
// };
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
.routerlink {
  margin: 0 10px;
}
#examples {
  margin: 10px;
  display: flex;
  background-color: beige;
}
</style>
