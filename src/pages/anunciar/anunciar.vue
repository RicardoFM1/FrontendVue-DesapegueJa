    <template>
  <v-container class="wrapper pa-4" fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <div>
        <div class="panel-label">Painel</div>
        <div class="panel-title">Criar Produto • Preview</div>
      </div>
      <div class="panel-subtitle">Vendas • Usados</div>
    </v-row>

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
            <v-btn class="btn" @click="$refs.imageInput.click()" small>
              📁 Escolher imagem
            </v-btn>
              <v-btn class="btn" small @click="clearImage">✖ Limpar</v-btn>
              <v-btn class="btn" small @click="toggleFit">🔍 Ajustar</v-btn>
            </v-row>
          </v-row>

          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="d-none"
            @change="onImageChange"
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
                dense
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
              ></v-select>
            </v-col>
             <v-col cols="12" sm="4">
              <v-text-field
                v-model="estoque"
                label="Quantidade em estoque"
                type="number"
                step="1"
                dense
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
            <v-btn class="create-btn ml-2" @click="openModal">Criar</v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

   
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
  </v-container>
</template>

<script setup>
import { connection } from '@/connection/axiosConnection';
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";


const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);
const retrieve = ref();

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      
      
      
    
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
 

onMounted(async () => {
  
  await getCategorias()
  if (!tokenExiste.value) {
    router.push("/");
  }
  if(token.value){
    await getRetrieve()
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




function onImageChange(e){
  const f = e.target.files?.[0]
  if(!f || !f.type.startsWith('image/')) return alert('Selecione uma imagem válida')
  const reader = new FileReader()
  reader.onload = ev => previewImage.value = ev.target.result
  reader.readAsDataURL(f)
}

// function clearImage(){
//   previewImage.value = ''
//   if ($refs.imageInput) $refs.imageInput.value = ''
// }

function toggleFit(){ fitContain.value = !fitContain.value }
function resetForm(){
  if(confirm('Deseja limpar o formulário?')){
    titulo.value = ''
    preco.value = 0
    categoria.value = ''
    descricao.value = ''
    estoque.value = 0
    clearImage()
  }
}
function Voltar(){
  router.push("/")
}
function openModal(){ modal.value = true }
const loadingConfirmar = ref(false)

async function confirmarAnuncio()

{ 
  loadingConfirmar.value = true
 try{
  const body = {
    usuario_id: retrieve.value.id,
    nome: titulo.value,
    data_post: new Date().toISOString().slice(0, 19).replace("T", " "),
    preco: preco.value * 100,
    descricao: descricao.value,
    categoria_id: categoria.value,
    estoque: estoque.value
    
  }
  const res = await connection.post("/desapega/produtos", body, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
  if(res.status == 200 || res.status == 201){
    toast.success("Produto anunciado com sucesso!")
  }
  else{
    toast.error("Erro ao anunciar o produto")
  }
 }catch(err){
  console.log(err.response.data.message)
  toast.error(err.response.data.message || "Erro ao anunciar o produto")
 }finally{
  loadingConfirmar.value = false
 }

}


</script>
<style>
@import "../css/paginaAnunciar/anunciar.css";
</style>