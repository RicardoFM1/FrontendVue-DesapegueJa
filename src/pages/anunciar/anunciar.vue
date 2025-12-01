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
        <v-badge
  :content="carrinho.length"
  color="primary"
  class="ml-4 mr-4"
>
  <v-btn
    variant="flat"
    prepend-icon="mdi-cart"
    color="#3fa34f"
    @click="toCarrinho"
    :disabled="carregando"
  >
    Carrinho
  </v-btn>
</v-badge>

          <v-menu v-model="menu" offset-y location="bottom end">
            <template #activator="{ props }">
              <v-tooltip top>
                <template #activator="{ props: tooltip }">
                  <v-btn
                    v-bind="{ ...props, ...tooltip }"
                    :disabled="carregando"
                    variant="text"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>Mais opções</span>
              </v-tooltip>
            </template>

            <v-card class="pa-4" width="300">
              <v-row justify="center">
                <v-avatar
                  size="70"
                  class="d-flex align-center justify-center"
                  :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'"
                >
                  <template v-if="avatarUsuario.tipo === 'imagem'">
                    <v-img :src="avatarUsuario.src" cover />
                  </template>

                  <template v-else>
                    <span class="text-white text-h6 font-weight-bold">
                      {{ avatarUsuario.texto }}
                    </span>
                  </template>
                </v-avatar>
              </v-row>
              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 nomeUsuario ellipses">
                      {{ usuario?.nome }}
                    </div>
                  </template>
                  <span>{{ usuario?.nome }}</span>
                </v-tooltip>
              </v-row>

              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 emailUsuario ellipses">
                      {{ usuario?.email }}
                    </div>
                  </template>
                  <span>{{ usuario?.email }}</span>
                </v-tooltip>
              </v-row>

              <v-divider class="my-3"></v-divider>

              <v-btn
                block
                color="#eaece7"
                variant="flat"
                class="mb-4"
                prepend-icon="mdi-account"
                @click="toPerfil"
                :disabled="carregando"
              >
                PERFIL
              </v-btn>
              <v-btn
                block
                color="#cc0000"
                variant="flat"
                class="mb-4"
                prepend-icon="mdi-logout"
                @click="buttonSairClicado = !buttonSairClicado"
                :disabled="carregando"
                >
                SAIR
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
        
        
        <v-row class="image-actions mb-2" align="center" justify="space-between">
          <v-row style="margin: 12px; display: flex; gap: 18px" dense>
          
          <v-btn class="btn" small @click="imageInput.click()">
            📁 Escolher imagem
          </v-btn>

          <v-btn class="btn" small @click="removerImagem">
            ✖ Remover
          </v-btn>

          <v-btn class="btn" small @click="toggleFit">
            🔍 Ajustar
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
        <v-card class="card pa-4" outlined>
          <v-row justify="space-between" align="center">
            <v-col>
              <v-text-field
              v-model="titulo"
              label="Título do produto"
              hide-details
              :rules="[rules.required]"
              dense
              ></v-text-field>
              <div class="small">Título exibido para compradores</div>
            </v-col>
            <v-col class="d-flex flex-column align-end">
              <div class="price">R$ {{ preco }}</div>
              <div class="ola" style="display: flex; flex-direction: row;">
                
                <v-chip class="chip ma-1" outlined>{{ categoriasNome }}</v-chip>
              </div>
            </v-col>
          </v-row>
          
          <v-row class="mt-4" dense>
            <v-col cols="12" sm="4">
              <v-text-field
              v-model.number="preco"
              label="Preço (R$)"
              type="number"
              step="0.01"
              min="0"
              @input="apenasPositivo"
              dense
              :rules="[rules.required, rules.preco]"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="4">
              <v-select
              v-model="categoria"
              :items="categorias"
              item-title="nome"
              item-value="id"
              label="Categoria"
              dense
              :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
              v-model="estoque"
              label="Quantidade em estoque"
              type="number"
              step="1"
              min="1"
              @input="apenasPositivo"
              dense
              :rules="[rules.required, rules.estoque]"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-textarea
          v-model="descricao"
          label="Descrição"
          rows="4"
          class="mt-4"
          ></v-textarea>
          
          <v-row justify="space-between" align="center" class="mt-2">
            <div class="small">Adicione mais fotos para aumentar a chance de venda.</div>
          </v-row>
          
          <v-row justify="end" class="mt-4">
            <v-btn class="secondary" outlined @click="Voltar">Voltar</v-btn>
            <v-btn class="secondary" outlined @click="resetForm">Limpar</v-btn>
            <v-btn class="create-btn ml-2" @click="validarAntesDeCriar">Criar</v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    
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
      <v-card class="card">
        <v-card-title class="headline">Confirmar criação do produto</v-card-title>
        <v-card-subtitle>Revise as informações antes de confirmar.</v-card-subtitle>
        
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-img :src="previewImage || placeholderImage" height="120"></v-img>
            </v-col>
            <v-col cols="8">
              <div class="d-flex justify-space-between">
                  <strong>{{ titulo }}</strong>
                  <span class="price">R$ {{ preco }}</span>
                </div>
                <v-row class="mt-2" dense>
                  
                  <v-chip class="chip ma-1" outlined>Categoria: {{ categoriasNome }}</v-chip>
                <v-chip class="chip ma-1" outlined>Estoque: {{ estoque }}</v-chip>
              </v-row>
              <div class="mt-2">
                <div class="small">Descrição</div>
                <div>{{ descricao }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="secondary" text @click="modal = false">Cancelar</v-btn>
          <v-btn class="btn primary" :loading="loadingConfirmar" @click="confirmarAnuncio">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
      
    </v-dialog>
  </v-form>
</v-container>
</v-layout>
</template>

<script setup>
import { connection } from '@/connection/axiosConnection';
import { ref, computed, onMounted, watch } from 'vue'
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



console.log(categorias.value)
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

 
const carrinho = ref([])

async function getCarrinho() {
  if(token.value){
  try {

    const res = await connection.get(`/desapega/carrinho/${retrieve?.value.id}`);
    
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
  
  await getCategorias()
  if (!tokenExiste.value) {
    router.push("/");
  }
  if(token.value){
    await getRetrieve()
    await getCarrinho()
  }
});

const categoriasNome = computed(() => {
  const item =  categorias.value.find(c => c.id == categoria.value)
   return item ? item.nome : ""
})


const titulo = ref('Tênis esportivo preto')
const preco = ref(199.90)
const descricao = ref('Tênis em bom estado, pouco uso. Tamanho 42. Pequeno desgaste na sola.')
const estoque = ref(1);
const previewImage = ref('')
const fitContain = ref(false)
const modal = ref(false)
const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1200\' height=\'900\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23090f13\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%2399aab3\' font-family=\'Arial, sans-serif\' font-size=\'28\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3EPreview da imagem%3C/text%3E%3C/svg%3E'
const carregando = ref(false)
const usuario = ref();


function onImageChange(e){
  const f = e.target.files?.[0]
  if(!f || !f.type.startsWith('image/')) return alert('Selecione uma imagem válida')
  const reader = new FileReader()
  reader.onload = ev => previewImage.value = ev.target.result
  reader.readAsDataURL(f)
}


function toggleFit(){ fitContain.value = !fitContain.value }
function resetForm(){
  if(confirm('Deseja limpar o formulário?')){
    titulo.value = ''
    preco.value = 0
    categoria.value = ''
    descricao.value = ''
    estoque.value = 0
    previewImage.value = ''
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

function Voltar(){
  router.back()
}

function apenasPositivo(e) {
  const valor = Number(e.target.value);
  if (valor < 0) e.target.value = 0;
}

const form = ref(null)
const formValido = ref(false)

const rules = {
  required: v => !!v || "Campo obrigatório",
  min3: v => (v?.length >= 3) || "Mínimo de 3 caracteres",
  min10: v => (v?.length >= 10) || "Escreva pelo menos 10 caracteres",
  preco: v => v > 0 || "Preço inválido",
  estoque: v => v > 0 || "Estoque deve ser maior que 0"
}

async function validarAntesDeCriar() {
  const resultado = await form.value.validate();

  if (!resultado.valid) {
    toast.error("Corrija os campos destacados")
    return
  }

  if (!previewImage.value) {
    toast.error("Adicione uma imagem")
    return
  }

  modal.value = true
}

const loadingConfirmar = ref(false)

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
      imagem: imagem.value 
    };

    const res = await connection.post("/desapega/produtos", body, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
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
    titulo.value = ''
    preco.value = 0
    categoria.value = ''
    descricao.value = ''
    estoque.value = 0
    previewImage.value = ''
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
  router.push("/")
}
</script>
<style>
@import "../css/paginaAnunciar/anunciar.css";
</style>