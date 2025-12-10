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
          width: 50%;
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
            :rules="[rules.required]"
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-text-field
            ref="inputTelefone"
            label="Telefone (DDI + DDD + NÚMERO)"
            prepend-inner-icon="mdi-phone"
            v-model="usuario.telefone"
            @keypress="isNumberOrPlus($event)"
            @input="onInputTelefone"
            :rules="[rules.required, rules.telefoneValido]"
            base-color="#293559"
            density="compact"
            variant="outlined"
          />

          <v-text-field
            ref="inputCep"
            label="CEP"
            v-model="endereco.cep"
            prepend-inner-icon="mdi-map-marker-outline"
            append-inner-icon="mdi-close"
            @click:append-inner="(usuario.cep = ''), limparEndereco()"
            placeholder="00000-000"
            @input="onInputCep"
            variant="outlined"
            density="compact"
            :loading="loadingCep"
            :rules="[rules.required]"
          />

          <div v-if="endereco.rua">
            <v-text-field
              label="Rua"
              v-model="endereco.rua"
              prepend-inner-icon="mdi-road"
              density="compact"
              variant="outlined"
              readonly
              base-color="#293559"
              :rules="[rules.required]"
            />

            <div style="display: flex; gap: 8px; width: 100%">
              <v-text-field
                id="input-numero"
                label="Número"
                v-model="endereco.numero"
                prepend-inner-icon="mdi-numeric"
                :rules="[rules.required]"
                density="compact"
                variant="outlined"
                base-color="#293559"
                style="flex-grow: 1"
              />
              <v-text-field
                label="Bairro"
                v-model="endereco.bairro"
                prepend-inner-icon="mdi-city-variant-outline"
                density="compact"
                variant="outlined"
                readonly
                base-color="#293559"
                style="flex-grow: 1"
                :rules="[rules.required]"
              />
            </div>

            <div style="display: flex; gap: 8px; width: 100%">
              <v-text-field
                label="Cidade"
                v-model="endereco.cidade"
                prepend-inner-icon="mdi-city"
                density="compact"
                variant="outlined"
                readonly
                base-color="#293559"
                style="flex-grow: 1"
                :rules="[rules.required]"
              />
              <v-text-field
                label="Estado (UF)"
                v-model="endereco.estado"
                prepend-inner-icon="mdi-map-marker-radius"
                density="compact"
                variant="outlined"
                readonly
                base-color="#293559"
                style="max-width: 120px; flex-shrink: 0"
                :rules="[rules.required]"
              />
            </div>
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
            @input="formatDateInput"
            @keypress="isNumberOrBackspace($event)"
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

const retrieve = ref(null);
const router = useRouter();
const form = ref();

const usuario = ref({
  dataNascimento: "",
  CPF: "",
  telefone: "",
});

const endereco = ref({
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
});

const limparEndereco = () => {
  endereco.value.rua = "";
  endereco.value.bairro = "";
  endereco.value.cidade = "";
  endereco.value.estado = "";
  endereco.value.numero = "";
};
const loadingCep = ref(false);
const buscarCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    limparEndereco();
    return;
  }

  loadingCep.value = true;

  try {
    const response = await connection.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    const data = response.data;

    if (data.erro) {
      toast.error("CEP não encontrado. Verifique a numeração.");
      limparEndereco();
      return;
    }

    endereco.value.rua = data.logradouro || "";
    endereco.value.bairro = data.bairro || "";
    endereco.value.cidade = data.localidade || "";
    endereco.value.estado = data.uf || "";

    await delay(50);
    document.querySelector("#input-numero")?.focus();
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    toast.error("Erro na comunicação para busca do CEP.");
    limparEndereco();
  } finally {
    loadingCep.value = false;
  }
};

const onInputCep = () => {
  const cepFormatado = endereco.value.cep.replace(/\D/g, "").slice(0, 8);

  if (cepFormatado.length === 8) {
    buscarCep(endereco.value.cep);
  } else {
    limparEndereco();
  }
};

const onInputTelefone = () => {
  let value = usuario.value.telefone;

  if (value.length > 0 && value[0] !== "+") {
    value = "+" + value;
  } else if (value.length === 0) {
    endereco.value.telefone = "";
    return;
  }

  let limpo = value.replace(/[^\d+]/g, "");

  if (limpo.startsWith("+")) {
    limpo = "+" + limpo.substring(1).replace(/\D/g, "");
  } else {
    limpo = limpo.replace(/\D/g, "");
  }

  usuario.value.telefone = limpo;
};

const loading = ref(false);
const calendarOpen = ref(false);
const rawDate = ref("");
const inputData = ref(null);
const inputCPF = ref(null);
const inputTelefone = ref(null);
const inputCep = ref(null);
const token = ref(localStorage.getItem("token"));

const isNumberOrBackspace = (evt) => {
  const charCode = evt.which ? evt.which : evt.keyCode;

  if (charCode >= 48 && charCode <= 57) {
    return true;
  }

  if (charCode === 8 || charCode === 46) {
    return true;
  }
  evt.preventDefault();
  return false;
};

const formatDateInput = () => {
  let value = usuario.value.dataNascimento.replace(/\D/g, "");

  if (value.length > 8) {
    value = value.slice(0, 8);
  }

  let formatted = "";
  if (value.length > 0) {
    formatted += value.substring(0, 2);

    if (value.length > 2) formatted += "/" + value.substring(2, 4);

    if (value.length > 4) formatted += "/" + value.substring(4, 8);
  }

  usuario.value.dataNascimento = formatted;
};

const isNumber = (evt) => {
  const charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    evt.preventDefault();
  }
  return true;
};

const isNumberOrPlus = (evt) => {
  const charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode >= 48 && charCode <= 57) {
    return true;
  }
  if (charCode === 43 && usuario.value.telefone.length === 0) {
    return true;
  }
  evt.preventDefault();
  return false;
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
    const { valid } = await form.value.validate();

    if (!valid) {
        toast.error("Preencha os campos obrigatórios antes de continuar!");
        loading.value = false;
        return;
    }

    const cpfFormatado = usuario.value.CPF.replace(/[./-]/g, "");
    const telefoneFormatado = usuario.value.telefone.replace(/\D/g, "");

    try {
        if (!retrieve.value?.id) {
            throw new Error(
                "ID do usuário não encontrado para finalizar o cadastro."
            );
        }

       
        const userId = retrieve.value.id; 

        
        const bodyUser = {
            cpf: cpfFormatado,
            telefone: telefoneFormatado,
            data_de_nascimento: usuario.value.dataNascimento
        };

        await connection.patch(`/desapega/usuarios/${userId}`, bodyUser, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });

 
        const bodyEndereco = {
          
            usuario_id: userId, 
            cep: endereco.value.cep.replace(/\D/g, ""),
            rua: endereco.value.rua,
            numero: endereco.value.numero,
            bairro: endereco.value.bairro,
            cidade: endereco.value.cidade,
            estado: endereco.value.estado,
        };
        await connection.post("/desapega/enderecos", bodyEndereco, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });


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

    const parts = value.split("/");

    const dataNascimento = new Date(parts[2], parts[1] - 1, parts[0]);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return (
      dataNascimento <= hoje || "A data de nascimento não pode ser futura."
    );
  },
];
const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  telefoneValido: (v) => {
    const limpo = v ? v.replace(/\D/g, "") : "";

    return (
      limpo.length >= 10 ||
      "Telefone deve ter no mínimo 10 dígitos (incluindo DDI e DDD)."
    );
  },
};

const disabled = computed(() => {
  const isAddressFilled =
    endereco.value.cep &&
    endereco.value.rua &&
    endereco.value.numero &&
    endereco.value.bairro &&
    endereco.value.cidade &&
    endereco.value.estado;

  return (
    !usuario.value.CPF ||
    !usuario.value.telefone ||
    !usuario.value.dataNascimento ||
    !isAddressFilled
  );
});

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
  await getRetrieve();
  useMask(inputCep, { mask: "00000-000" });
  useMask(inputCPF, { mask: "000.000.000-00" });
});
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>
