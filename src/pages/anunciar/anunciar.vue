<template>
  <v-layout>
    <v-container class="wrapper pa-4" fluid>
      <v-app-bar>
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          prepend-icon="mdi-home"
          color="#1976D2"
          @click="toHome"
          :disabled="carregando"
        >
          Home
        </v-btn>
        <div class="d-flex align-center gap-2 mr-2">
          
          

          <v-btn 
            icon 
            class="mr-2" 
            @click="toCarrinho"
            :disabled="carregandoProdutos"
          >
            <v-badge 
              color="error" 
              :content="carrinho.length" 
              v-if="carrinho.length > 0"
              offset-x="-1" 
              offset-y="-1"
            >
              <v-icon color="grey-darken-2">mdi-cart-outline</v-icon>
            </v-badge>
            <v-icon v-else color="grey-darken-2">mdi-cart-outline</v-icon>
          </v-btn>

          
        </div>

        <v-menu v-model="menu" offset-y location="bottom end" transition="scale-transition">
          <template #activator="{ props }">
            <v-btn icon v-bind="props" class="ml-1">
              <v-avatar size="40" :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'">
                <v-img v-if="avatarUsuario.tipo === 'imagem'" :src="avatarUsuario.src" cover />
                <span v-else class="text-white font-weight-bold">{{ avatarUsuario.texto }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card class="pa-4 rounded-xl" width="300" elevation="4">
            <div class="d-flex flex-column align-center mb-3">
              <v-avatar size="80" class="mb-3" :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'">
                <v-img v-if="avatarUsuario.tipo === 'imagem'" :src="avatarUsuario.src" cover />
                <span v-else class="text-h4 text-white">{{ avatarUsuario.texto }}</span>
              </v-avatar>
              <div class="text-h6 font-weight-bold text-truncate w-100 text-center">{{ usuario?.nome }}</div>
              <div class="text-h6 text-grey text-truncate w-100 text-center">{{ usuario?.email }}</div>
            </div>

            <v-divider class="mb-3"></v-divider>

            <v-btn block variant="tonal" color="primary" class="mb-2 rounded-lg" prepend-icon="mdi-account" @click="toPerfil">
              Meu Perfil
            </v-btn>
            <v-btn block variant="outlined" color="error" class="rounded-lg" prepend-icon="mdi-logout" @click="buttonSairClicado = !buttonSairClicado">
              Sair
            </v-btn>
          </v-card>
        </v-menu>
      </v-app-bar>

      <v-breadcrumbs
        class="text-black mt-12"
        :items="[
          { text: 'Home', disabled: false, href: '/' },
          { text: 'Anunciar', disabled: true },
        ]"
      >
        <template #title="{ item }">
          <span>{{ item.text }}</span>
        </template>
      </v-breadcrumbs>

      <v-form ref="form">
        <v-row>
          <v-col cols="12" md="5">
            <v-card class="card pa-3" outlined>
              <v-img
                :src="previewImage || placeholderImage"
                class="image-preview mb-2"
                :contain="fitContain"
              ></v-img>

              <v-row
                class="image-actions mb-2"
                align="center"
                justify="space-between"
              >
                <v-row style="margin: 12px; display: flex; gap: 18px" dense>
                  <v-btn class="btn" small @click="imageInput.click()">
                    📁 Escolher imagem
                  </v-btn>

                  <v-btn class="btn" small @click="removerImagem">
                    ✖ Remover
                  </v-btn>

                
                </v-row>
              </v-row>

              <input
                ref="imageInput"
                type="file"
                accept="image/png"
                class="d-none"
                @change="carregarImagem"
              />

              <v-row justify="space-between" class="text-caption">
                <div class="small">Formato aceito: PNG • Max 1MB</div>
                <div class="small">Verificação rápida de qualidade</div>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" md="7">
            <v-row justify="space-between" align="center">
              <v-col cols="12">
                <v-card  class="card pa-4" outlined>
                  <v-card-title class="text-h6 font-weight-bold mb-4">
                    <v-icon start color="primary">mdi-format-list-text</v-icon>
                    Detalhes do Anúncio
                  </v-card-title>

                  <v-row align="start" class="mb-4">
                    <v-col cols="12" sm="8">
                      <v-text-field
                        v-model="titulo"
                        label="Título do Produto"
                        hint="Obrigatório. Título principal do produto."
                        persistent-hint
                        :rules="[rules.required]"
                        :disabled="carregando"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4" class="text-right">
                      <div class="text-h5 font-weight-bold text-success">
                        R$ {{ preco || "0,00" }}
                      </div>
                      <v-chip
                        class="ma-1 mt-1"
                        size="large"
                        variant="tonal"
                        color="primary"
                      >
                        {{ categoriasNome || "Selecione Categoria" }}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>

                  <v-row class="mt-4" dense>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model.number="preco"
                        label="Preço (R$)"
                        type="number"
                        step="0.01"
                        min="0"
                        prefix="R$"
                        @input="apenasPositivo"
                        :rules="[rules.required, rules.preco]"
                        :disabled="carregando"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-select
                        v-model="categoria"
                        :items="categorias"
                        item-title="nome"
                        item-value="id"
                        label="Categoria"
                        :rules="[rules.required]"
                        :disabled="carregando"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model.number="estoque"
                        label="Estoque"
                        type="number"
                        step="1"
                        min="1"
                        @input="apenasPositivo"
                        :rules="[rules.required, rules.estoque]"
                        :disabled="carregando"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-textarea
                    v-model="descricao"
                    label="Descrição Detalhada"
                    rows="4"
                    class="mt-4"
                    hint="Inclua estado de conservação, dimensões e cores para atrair mais compradores."
                    persistent-hint
                    :disabled="carregando"
                  ></v-textarea>

                  <v-row justify="end" class="mt-4">
                    <v-btn
                      variant="outlined"
                      color="grey"
                      class="mr-2"
                      @click="resetForm"
                      :disabled="carregando"
                    >
                      Limpar Campos
                    </v-btn>

                    <v-btn
                      color="primary"
                      variant="flat"
                      @click="validarAntesDeCriar"
                      :loading="carregando"
                    >
                      <v-icon start>mdi-tag-plus</v-icon> Anunciar Produto
                    </v-btn>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-dialog
            max-width="500"
            v-model="buttonSairClicado"
            v-if="buttonSairClicado"
          >
            <v-card class="pa-4" elevation="8" rounded="xl">
              <v-card-title class="text-center font-weight-bold text-h4">
                <v-icon color="error" size="32" class="mr-2"
                  >mdi-alert-circle-outline</v-icon
                >
                Confirmar saída
              </v-card-title>

              <v-card-text class="text-center text-h5 text-medium-emphasis">
                Tem certeza de que deseja sair da sua conta?
              </v-card-text>

              <v-card-actions class="justify-center mt-2">
                <v-btn
                  color="grey"
                  variant="outlined"
                  rounded="xl"
                  @click="buttonSairClicado = false"
                  width="120"
                >
                  Cancelar
                </v-btn>

                <v-btn
                  color="error"
                  variant="flat"
                  rounded="xl"
                  width="120"
                  :loading="loadingLogout"
                  @click="FazerLogout"
                >
                  Sair
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="modal" max-width="700">
 <v-card class="card pa-4">
 <v-card-title class="headline text-h5 font-weight-bold">
 <v-icon start color="primary">mdi-check-circle-outline</v-icon>
  Revisar e Confirmar Anúncio
 </v-card-title>
 <v-card-subtitle class="mt-2">Confirme os detalhes do seu produto antes de publicar.</v-card-subtitle>
 
 <v-card-text class="mt-4">
 <v-row>
 <v-col cols="12" sm="4">
  <v-img 
  :src="previewImage || placeholderImage" 
  height="180" 
 class="rounded-lg border"
 ></v-img>
 </v-col>
 <v-col cols="12" sm="8">
  <div class="text-h6 font-weight-bold mb-2">{{ titulo }}</div>
 
  <div class="text-h5 font-weight-bold text-success">R$ {{ preco }}</div>
  
  <v-row class="mt-3" dense>
   <v-chip class="ma-1" variant="tonal" color="primary" size="large">
    <v-icon start>mdi-shape</v-icon> Categoria: {{ categoriasNome }}
   </v-chip>
   <v-chip class="ma-1" variant="tonal" color="info" size="large">
  <v-icon start>mdi-package-variant-closed</v-icon> Estoque: {{ estoque }}
   </v-chip>
  </v-row>
  
  <div class="mt-4 text-subtitle-2 font-weight-medium">Descrição:</div>
  <p class="text-body-2 text-medium-emphasis">{{ descricao || 'Nenhuma descrição fornecida.' }}</p>
 </v-col>
</v-row>
</v-card-text>

 <v-card-actions class="pt-0 pr-4 pb-4">
  <v-spacer></v-spacer>
  <v-btn variant="outlined" color="grey" @click="modal = false">Voltar e Editar</v-btn>
  <v-btn 
  color="primary" 
 variant="flat" 
   :loading="loadingConfirmar" 
  @click="confirmarAnuncio"
  >
   Publicar Anúncio
  </v-btn>
 </v-card-actions>
 </v-card>
 </v-dialog>
        </v-row>
      </v-form>
    </v-container>
  </v-layout>
</template>

<script setup>
import { connection } from "@/connection/axiosConnection";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const router = useRouter();
const imagem = ref(null);
const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);
const retrieve = ref();
const menu = ref(false);

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      usuario.value = res.data;
      console.log("FOTO PERFIL REAL:", res.data.foto_Perfil);
      console.log("Tamanho da string:", res.data.foto_Perfil?.length);
      console.log("RETORNO API:", res.data);

      if (
        retrieve.foto_Perfil &&
        retrieve.foto_Perfil !== "null" &&
        retrieve.foto_Perfil !== ""
      ) {
        if (retrieve.foto_Perfil.startsWith("data:image")) {
          retrieve.foto_Perfil = retrieve.foto_Perfil;
        } else if (retrieve.foto_Perfil.startsWith("/9j/")) {
          retrieve.foto_Perfil = `data:image/jpeg;base64,${retrieve.foto_Perfil}`;
        } else if (retrieve.foto_Perfil.startsWith("iVBORw0KGgo")) {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        } else if (
          retrieve.foto_Perfil.startsWith("R0lGODlh") ||
          retrieve.foto_Perfil.startsWith("R0lGODdh")
        ) {
          retrieve.foto_Perfil = `data:image/gif;base64,${retrieve.foto_Perfil}`;
        } else {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        }
      } else {
        retrieve.foto_Perfil = null;
      }
    } else {
      toast.error("Erro ao buscar o usuário");
      console.error("Resposta inesperada:", res);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    toast.error(error.response?.data?.message || "Erro ao buscar o usuário");
  }
}
const categorias = ref([]);
const categoria = ref("");

console.log(categorias.value);
async function getCategorias() {
  try {
    const res = await connection.get("/desapega/categorias");
    if (res.status == 200) {
      console.log(res.data, "Nome categoria");
      categorias.value = res.data;
    } else {
      return "Sem categoria";
    }
  } catch (error) {
    return null;
  }
}

const carrinho = ref([]);

async function getCarrinho() {
  if (token.value) {
    try {
      const res = await connection.get(
        `/desapega/carrinho/${retrieve?.value.id}`
      );

      if (res.status == 200 || res.status == 201) {
        carrinho.value = res.data;
      } else {
        toast.error("Estamos com dificuldade de listar seu carrinho...");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao listar seu carrinho");
    }
  }
}
onMounted(async () => {
  if(!localStorage.getItem("token")){
    router.push("/")
    return
  }
  await getCategorias();
  if (token.value) {
    await getRetrieve();
    await getCarrinho();
  }
});

const categoriasNome = computed(() => {
  const item = categorias.value.find((c) => c.id == categoria.value);
  return item ? item.nome : "";
});

const titulo = ref("Tênis esportivo preto");
const preco = ref(199.9);
const descricao = ref(
  "Tênis em bom estado, pouco uso. Tamanho 42. Pequeno desgaste na sola."
);
const estoque = ref(1);
const previewImage = ref("");
const fitContain = ref(false);
const modal = ref(false);
const placeholderImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23090f13'/%3E%3Ctext x='50%25' y='50%25' fill='%2399aab3' font-family='Arial, sans-serif' font-size='28' dominant-baseline='middle' text-anchor='middle'%3EPreview da imagem%3C/text%3E%3C/svg%3E";
const carregando = ref(false);
const usuario = ref();

function onImageChange(e) {
  const f = e.target.files?.[0];
  if (!f || !f.type.startsWith("image/"))
    return alert("Selecione uma imagem válida");
  const reader = new FileReader();
  reader.onload = (ev) => (previewImage.value = ev.target.result);
  reader.readAsDataURL(f);
}

function toggleFit() {
  fitContain.value = !fitContain.value;
}
function resetForm() {
  if (confirm("Deseja limpar o formulário?")) {
    titulo.value = "";
    preco.value = 0;
    categoria.value = "";
    descricao.value = "";
    estoque.value = 0;
    previewImage.value = "";
  }
}
const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
};

const avatarUsuario = computed(() => {
  const nome = usuario.value?.nome || "Usuário";
  const foto = usuario.value?.foto_Perfil;

  if (foto && foto !== "null" && foto !== "Sem imagem" && foto.trim() !== "") {
    if (foto.startsWith("data:image")) {
      return { tipo: "imagem", src: foto };
    }

    if (foto.startsWith("/9j/"))
      return { tipo: "imagem", src: `data:image/jpeg;base64,${foto}` };
    if (foto.startsWith("iVBORw0KGgo"))
      return { tipo: "imagem", src: `data:image/png;base64,${foto}` };

    return { tipo: "iniciais", texto: getIniciais(nome) };
  }

  return { tipo: "iniciais", texto: getIniciais(nome) };
});

const buttonSairClicado = ref(false);
const loadingLogout = ref(false);

function toPerfil() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/perfil");
}

function FazerLogout() {
  loadingLogout.value = true;
  setTimeout(() => {
    localStorage.removeItem("token");
    router.push("/login");
    loadingLogout.value = false;
  }, 2000);
}

function Voltar() {
  router.back();
}

function apenasPositivo(e) {
  const valor = Number(e.target.value);
  if (valor < 0) e.target.value = 0;
}

const form = ref(null);
const formValido = ref(false);

const rules = {
  required: (v) => !!v || "Campo obrigatório",
  min3: (v) => v?.length >= 3 || "Mínimo de 3 caracteres",
  min10: (v) => v?.length >= 10 || "Escreva pelo menos 10 caracteres",
  preco: (v) => v > 0 || "Preço inválido",
  estoque: (v) => v > 0 || "Estoque deve ser maior que 0",
};

async function validarAntesDeCriar() {
  const resultado = await form.value.validate();

  if (!resultado.valid) {
    toast.error("Corrija os campos destacados");
    return;
  }

  if (!previewImage.value) {
    toast.error("Adicione uma imagem");
    return;
  }

  modal.value = true;
}

const loadingConfirmar = ref(false);

async function confirmarAnuncio() {
  loadingConfirmar.value = true;

  try {
    if (!titulo.value || titulo.value.length < 3) {
      return toast.error("Título inválido");
    }

    if (!preco.value || preco.value <= 0) {
      return toast.error("Preço inválido");
    }

    if (!estoque.value || estoque.value <= 0) {
      return toast.error("Estoque deve ser maior que 0");
    }

    if (!categoria.value) {
      return toast.error("Selecione uma categoria");
    }

    if (!imagem.value) {
      return toast.error("Envie uma imagem PNG válida");
    }

    const body = {
      usuario_id: retrieve.value?.id,
      nome: titulo.value,
      data_post: new Date().toISOString().slice(0, 19).replace("T", " "),
      preco: preco.value * 100,
      descricao: descricao.value,
      categoria_id: categoria.value,
      estoque: estoque.value,
      imagem: imagem.value,
    };

    const res = await connection.post("/desapega/produtos", body, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res?.status === 200 || res?.status === 201) {
      toast.success("Produto anunciado com sucesso!");
      modal.value = false;
    } else {
      toast.error("Erro inesperado ao anunciar o produto");
    }
  } catch (err) {
    console.error("Erro ao anunciar:", err);

    const msg =
      err.response?.data?.message ||
      err.message ||
      "Erro inesperado ao anunciar o produto";

    toast.error(msg);
  } finally {
    loadingConfirmar.value = false;
    titulo.value = "";
    preco.value = 0;
    categoria.value = "";
    descricao.value = "";
    estoque.value = 0;
    previewImage.value = "";
  }
}

const arquivoImagem = ref(null);
const imageInput = ref(null);

function abrirInput() {
  imageInput.value.click();
}

function carregarImagem(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  if (!arquivo.type.includes("png")) {
    toast.error("Apenas imagens PNG são permitidas.");
    event.target.value = "";
    return;
  }

  if (arquivo.size > 1024 * 1024) {
    toast.error("A imagem deve ter no máximo 1MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    imagem.value = e.target.result;
  };
  reader.readAsDataURL(arquivo);
}

function removerImagem() {
  previewImage.value = null;
  arquivoImagem.value = null;
}
function toCarrinho() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/carrinho");
}
function toHome() {
  router.push("/");
}
</script>
<style>
@import "../css/paginaAnunciar/anunciar.css";
</style>
