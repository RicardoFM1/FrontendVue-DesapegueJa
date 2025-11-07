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

          <v-row class="image-actions mb-2" align="center" justify="space-between" padding="12px">
              <v-row class="ml-0" dense>
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
            <div class="small">Formato aceito: JPG, PNG • Max 5MB</div>
            <div class="small">Verificação rápida de qualidade</div>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card class="card pa-4" outlined>
          <v-row justify="space-between" align="center">
            <v-col>
              <v-text-field
                v-model="title"
                label="Título do produto"
                hide-details
                dense
              ></v-text-field>
              <div class="small">Título exibido para compradores</div>
            </v-col>
            <v-col class="d-flex flex-column align-end">
              <div class="price">{{ formattedPrice }}</div>
              <v-chip class="chip ma-1" outlined>{{ estado }}</v-chip>
              <v-chip class="chip ma-1" outlined>{{ categoria }}</v-chip>
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
                v-model="estado"
                :items="estados"
                label="Estado de Conservação"
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="categoria"
                :items="categorias"
                label="Categoria"
                dense
              ></v-select>
            </v-col>
          </v-row>

          <v-textarea
            v-model="descricao"
            
            rows="4"
            class="mt-4"
            ></v-textarea>
          
          <v-row justify="space-between" align="center" class="mt-2">
            <div class="small">Adicione mais fotos para aumentar a chance de venda.</div>
            <v-btn class="secondary" small @click="editQuick">Editar rápido</v-btn>
          </v-row>

          <v-row justify="end" class="mt-4">
            <v-btn class="secondary" outlined @click="resetForm">Cancelar</v-btn>
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
                <strong>{{ title }}</strong>
                <span class="price">{{ formattedPrice }}</span>
              </div>
              <v-row class="mt-2" dense>
                <v-chip class="chip ma-1" outlined>Estado: {{ estado }}</v-chip>
                <v-chip class="chip ma-1" outlined>Categoria: {{ categoria }}</v-chip>
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
          <v-btn class="btn primary" @click="confirmCreate">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

onMounted(async () => {
  
  if (!tokenExiste.value) {
     router.push("/");
  }});
  
const title = ref('Tênis esportivo preto')
const preco = ref(199.90)
const estado = ref('Seminovo')
const categoria = ref('Calçados')
const descricao = ref('Tênis em bom estado, pouco uso. Tamanho 42. Pequeno desgaste na sola.')

const previewImage = ref('')
const fitContain = ref(false)
const modal = ref(false)
const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1200\' height=\'900\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23090f13\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%2399aab3\' font-family=\'Arial, sans-serif\' font-size=\'28\' dominant-baseline=\'middle\' text-anchor=\'middle\'%3EPreview da imagem%3C/text%3E%3C/svg%3E'

const estados = ['Novo','Seminovo','Usado','Com Defeito']
const categorias = ['Calçados','Eletrônicos','Roupas','Livros','Outros']

const formattedPrice = computed(() => preco.value.toLocaleString('pt-BR',{style:'currency', currency:'BRL'}))

function onImageChange(e){
  const f = e.target.files?.[0]
  if(!f || !f.type.startsWith('image/')) return alert('Selecione uma imagem válida')
  const reader = new FileReader()
  reader.onload = ev => previewImage.value = ev.target.result
  reader.readAsDataURL(f)
}

function clearImage(){
  previewImage.value = ''
  if ($refs.imageInput) $refs.imageInput.value = ''
}

function toggleFit(){ fitContain.value = !fitContain.value }
function resetForm(){
  if(confirm('Deseja limpar o formulário?')){
    title.value = 'Tênis esportivo preto'
    preco.value = 199.90
    estado.value = 'Seminovo'
    categoria.value = 'Calçados'
    descricao.value = 'Tênis em bom estado, pouco uso. Tamanho 42. Pequeno desgaste na sola.'
    clearImage()
  }
}
function openModal(){ modal.value = true }
function confirmCreate(){ alert('Produto criado com sucesso! (simulação)'); modal.value = false; resetForm() }
function editQuick(){ alert('Funcionalidade de edição rápida (simulação)') }

</script>
<style>
@import "../css/paginaAnunciar/anunciar.css";
</style>