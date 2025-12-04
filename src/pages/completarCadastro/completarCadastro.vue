<template>
<div class="fundoCadastro">
<div class="divFormCadastro">
<v-sheet
style="
display: flex;
border-radius: 10px;
justify-content: center;
align-items: center;
flex-direction: column;
padding: 18px;
width: 30%;
"
class="sheetCadastro"
>
<v-form
:disabled="loading"
class="formCadastro"
ref="form"
@submit.prevent="onSubmit"
>
<div class="divImageLogo">
<v-img
style="padding: 12px 0 0 12px"
width="100%"
height="auto"
src="desapegueja-logo.svg"
></v-img>
</div>

<h1 class="tituloCadastro">Completar Cadastro</h1>

<v-text-field
            ref="inputCPF"
            label="CPF"
            v-model="usuario.CPF"
            prepend-inner-icon="mdi-card-account-details"
            base-color="#293559"
            placeholder="000.000.000-00"
            @input="usuario.CPF = usuario.CPF.slice(0, 14)"
          ></v-text-field>

<div style="display: flex; gap: 8px; width: 100%">
<v-select
:items="ddiOptions"
v-model="usuario.ddi"
item-title="text"
item-value="value"
style="max-width: 130px; flex-shrink: 0"
base-color="#293559"
density="compact"
variant="outlined"
label="País"
:rules="[rules.required]"
></v-select>

<v-text-field
ref="inputTelefone"
label="Telefone (DDD + Número)"
prepend-inner-icon="mdi-phone"
v-model="usuario.telefone"
@keypress="isNumber($event)"
:rules="[rules.required]"
base-color="#293559"
density="compact"
variant="outlined"
/>
</div>

<v-text-field
ref="inputData"
label="Data de nascimento"
append-inner-icon="mdi-calendar"
base-color="#293559"
:rules="rulesDataNascimento"
v-model="usuario.dataNascimento"
placeholder="DD/MM/AAAA"
@click:append-inner="openCalendar"
@keypress="isNumber($event)"
v-mask="'##/##/####'"
density="compact"
variant="outlined"
/>

<v-dialog max-width="350" v-model="calendarOpen" v-if="calendarOpen">
<v-card>
<v-date-picker
v-model="rawDate"
scrollable
@update:model-value="
(val) => {
usuario.dataNascimento = formatDate(val);
calendarOpen = false;
}
"
></v-date-picker>

<v-card-actions>
<v-spacer></v-spacer>
<v-btn text @click="calendarOpen = false">Cancelar</v-btn>
<v-btn text @click="calendarOpen = false">OK</v-btn>
</v-card-actions>
</v-card>
</v-dialog>

<v-btn
:disabled="disabled"
:loading="loading"
color="black"
class="btnCadastrar"
type="submit"
block
>FINALIZAR CADASTRO</v-btn
>
</v-form>
</v-sheet>
</div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify/dist/index";
import { useMask } from "../../utility/masks/mask";

const ddiOptions = ref([
  { text: "Brasil (+55)", value: "55" },
  { text: "Portugal (+351)", value: "351" },
  { text: "EUA (+1)", value: "1" },
]);
const retrieve = ref(null);
const router = useRouter();

const usuario = ref({
  dataNascimento: "",
  CPF: "",
  telefone: "", 
  ddi: "55",
});
const loading = ref(false);
const calendarOpen = ref(false);
const rawDate = ref("");
const inputData = ref(null);
const inputCPF = ref(null);
const inputTelefone = ref(null);
const token = ref(localStorage.getItem("token"))


useMask(inputData, { mask: "00/00/0000" }); 
useMask(inputCPF, { mask: "000.000.000-00" });


const isNumber = (evt) => {
  const charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    evt.preventDefault();
  }
  return true;
};

const openCalendar = () => {
  calendarOpen.value = true;
};

const formatDate = (val) => {
  if (!val) return "";

  const date = new Date(val);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async () => {
  loading.value = true;
  
 
const cpfFormatado = usuario.value.CPF.replace(/[./-]/g, "");
  const telefoneFormatado = usuario.value.telefone.replace(/\D/g, "");

  if (!usuario.value.telefone) {
    toast.error("Telefone obrigatório");
    loading.value = false;
    return;
  }

  console.log(cpfFormatado, "FormatCPF");
  console.log(telefoneFormatado, "formatTelefone");
  
  try {
    
    if (!retrieve.value?.id) {
      throw new Error(
        "ID do usuário não encontrado para finalizar o cadastro."
      );
    }

    const body = {
      cpf: cpfFormatado,
      telefone: `${usuario.value.ddi}${telefoneFormatado}`,
      data_de_nascimento: usuario.value.dataNascimento,
    };

    
    await connection.patch(`/desapega/usuarios/${retrieve.value.id}`, body,
    {headers: {
        Authorization: `Bearer ${token.value}`
    }}
);

    toast.success("Cadastro finalizado com sucesso! Redirecionando...", {
      autoClose: 2000,
    });
    router.push("/"); 
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      "Erro ao finalizar cadastro. Tente novamente.";
    toast.error(msg, { autoClose: 3000 });
    localStorage.removeItem("token");
    router.push("/login");
  } finally {
    loading.value = false;
  }
};
const rulesDataNascimento = [
    (value) => !!value || "Obrigatório preencher",
    (value) =>
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value) ||
        "Formato de data inválido (DD/MM/AAAA).",

   
    (value) => {
        if (!value) return true;
        
        
        const parts = value.split('/');
        
        const dataNascimento = new Date(parts[2], parts[1] - 1, parts[0]);
        
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

      
        return dataNascimento <= hoje || "A data de nascimento não pode ser futura.";
    }
];
const rules = {
  required: (v) => !!v || "Campo obrigatório.",





};

const disabled = computed(
  () =>
    !usuario.value.CPF ||
    !usuario.value.telefone ||
    !usuario.value.dataNascimento ||
    !usuario.value.ddi
);

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res?.status === 200 && res.data) retrieve.value = res.data;
    else throw new Error("Resposta inesperada ao buscar usuário");
  } catch (err) {
    console.error("getRetrieve:", err);
    toast.error(err.response?.data?.message || "Erro ao buscar o usuário");
  }
}

onMounted(async () => {
//   if (!localStorage.getItem("token")) {
//     router.replace("/login");
//   }
  await getRetrieve();
});
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>