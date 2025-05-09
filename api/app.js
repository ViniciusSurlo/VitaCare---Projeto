import cors from 'cors'
import express from 'express'
import { testarConexao } from './Db.js'
import RotasUsuarios, {autenticarToken} from './routes/RotasUsuarios.js'
import RotasMedicamentos from './routes/RotasMedicamentos.js'
import RotasConsultas from './routes/RotasConsultas.js'
import RotasNotificacoes from './routes/RotasNotificacoes.js'
import RotasHistoricoConsultas from './routes/RotasHistoricoConsultas.js'
import RotasHistoricoMedicamentos from './routes/RotasHistoricoMedicamentos.js'

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
app.post('/consultas', RotasConsultas.CriarConsulta); //criar uma nova consulta
app.get('/consultas', RotasConsultas.ListarConsultas); //listar todas as consultas
app.get('/consultas/:id_consulta', RotasConsultas.ListarConsultasPorID); //listar uma consulta por id
app.delete('/consultas/:id_consulta', RotasConsultas.DeletarConsulta); //deletar uma consulta
app.put('/consultas/:id_consulta', RotasConsultas.AtualizarTodos); //atualizar todos os campos de uma consulta
app.patch('/consultas/:id_consulta', RotasConsultas.Atualizar); //atualizar campos especificos de uma consulta

//rotas historicoConsultas
app.post('/historicoConsultas', RotasHistoricoConsultas.CriarHistoricoConsulta); //criar um novo historico de consulta
app.get('/historicoConsultas', RotasHistoricoConsultas.ListarHistoricoConsultas); //listar todos os historicos de consultas
app.get('/historicoConsultas/:id_historico', RotasHistoricoConsultas.ListarHistoricoConsultaPorId); //listar um historico de consulta por id
app.delete('/historicoConsultas/:id_historico', RotasHistoricoConsultas.DeletarHistoricoConsulta); //deletar um historico de consulta
app.patch('/historicoConsultas/:id_historico', RotasHistoricoConsultas.AtualizarHistoricoConsulta); //atualizar todos os campos de um historico de consulta
app.put('/historicoConsultas/:id_historico', RotasHistoricoConsultas.AtualizarTodos); //atualizar campos especificos de um historico de consulta

//rotas historicoMedicamentos
app.post('/historicoMedicamentos', RotasHistoricoMedicamentos.CriarHistoricoMedicamento); //criar um novo historico de medicamento
app.get('/historicoMedicamentos', RotasHistoricoMedicamentos.ListarHistoricoMedicamentos); //listar todos os historicos de medicamentos
app.get('/historicoMedicamentos/:id_historico', RotasHistoricoMedicamentos.ListarHistoricoMedicamentoPorId); //listar um historico de medicamento por id
app.delete('/historicoMedicamentos/:id_historico', RotasHistoricoMedicamentos.DeletarHistoricoMedicamento); //deletar um historico de medicamento
app.patch('/historicoMedicamentos/:id_historico', RotasHistoricoMedicamentos.Atualizar); //atualizar todos os campos de um historico de medicamento
app.put('/historicoMedicamentos/:id_historico', RotasHistoricoMedicamentos.AtualizarTodos); //atualizar campos especificos de um historico de medicamento

//rotas Notificações
app.post('/notificacoes', RotasNotificacoes.CriarNotificacao); //criar uma nova notificação
app.get('/notificacoes', RotasNotificacoes.ListarNotificacoes); //listar todas as notificações
app.get('/notificacoes/:id_notificacao', RotasNotificacoes.ListarNotificacoesPorID); //listar uma notificação por id
app.delete('/notificacoes/:id_notificacao', RotasNotificacoes.DeletarNotificacao); //deletar uma notificação
app.put('/notificacoes/:id_notificacao', RotasNotificacoes.AtualizarTodos); //atualizar todos os campos de uma notificação
app.patch('/notificacoes/:id_notificacao', RotasNotificacoes.Atualizar); //atualizar campos especificos de uma notificação

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Api rodando no http://localhost:${PORT}`);
})
