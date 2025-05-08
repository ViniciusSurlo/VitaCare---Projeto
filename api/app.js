import cors from 'cors'
import express from 'express'
import { testarConexao } from './Db.js'
import RotasUsuarios, {autenticarToken} from './routes/RotasUsuarios.js'
import RotasMedicamentos from './routes/RotasMedicamentos.js'

const app = express() //criar uma instancia
testarConexao();

app.use(cors()); //habilitar o cors
app.use(express.json()); //habilitar o json no express

// app.use(RotasUsuarios);
app.get('/', (req, res) =>{
    res.send("API rodando!");
})

//rotas usuarios
app.post('/usuarios', RotasUsuarios.novoUsuario); //criar um novo usuario
app.get('/usuarios', RotasUsuarios.listarUsuarios); //listar todos os usuarios
app.post('/usuarios/login', RotasUsuarios.login); //fazer login
app.get('/usuarios/:id_usuario', RotasUsuarios.listarUsuariosPorId); //listar um usuario por id
app.put('/usuarios/:id_usuario',autenticarToken, RotasUsuarios.atualizarTodos); //atualizar todos os campos de um usuario
app.patch('/usuarios/:id_usuario',autenticarToken, RotasUsuarios.atualizar); //atualizar campos especificos de um usuario
app.delete('/usuarios/:id_usuario',autenticarToken, RotasUsuarios.deletarUsuario); //excluir um usuario

//rotas medicamentos
app.post('/medicamentos', RotasMedicamentos.novoMedicamento); //criar um novo medicamento
app.get('/medicamentos', RotasMedicamentos.listarMedicamentos); //listar todos os medicamentos
app.get('/medicamentos/:id_medicamento', RotasMedicamentos.listarMedicamentosPorId); //listar um medicamento por id
app.delete('/medicamentos/:id_medicamento', RotasMedicamentos.DeletarMedicamentos); //deletar um medicamento
app.put('/medicamentos/:id_medicamento', RotasMedicamentos.AtualizarTodos); //atualizar todos os campos de um medicamento
app.patch('/medicamentos/:id_medicamento', RotasMedicamentos.Atualizar); //atualizar campos especificos de um medicamento

//rotas consultas
//rotas historicoConsultas
//rotas historicoMedicamentos
//rotas Notificações

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Api rodando no http://localhost:${PORT}`);
})
