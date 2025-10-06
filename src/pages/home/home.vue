<template>
    
    <div v-if="tokenExiste">
        <p>Home</p>
    </div>  
</template>

<script setup>
import {ref} from "vue"

const tokenExiste = ref(false);
if(localStorage.getItem("token") != null){
    tokenExiste.value = true;
}
else{
    tokenExiste.value = false;
}
</script>