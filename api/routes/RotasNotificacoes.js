import { BD } from "../Db.js";

class RotasNotificacoes{
    static async CriarNotificacao(req, res){
        try{
        const {id_usuario, id_medicamento, tipo, mensagem, horario} = req.body
        const consultas = await BD.query(`insert into notificacoes(id_usuario, id_medicamento, tipo, mensagem, horario)
            values($1, $2, $3, $4, $5)          
            RETURNING *
            `, [id_usuario, id_medicamento, tipo, mensagem, horario])
            res.status(200).json("Notificação Criada com sucesso")
        } catch(error){
            console.log("Erro ao criar notificação", error);
        }
    }
    static async ListarNotificacoes(req, res){
        try {
            const notificacoes = await BD.query(`select u.nome as nome_usuario, m.nome as nome_medicamento, n.tipo, n.mensagem, n.horario from notificacoes n
        right join usuarios u on n.id_usuario = u.id_usuario
        right join medicamentos m on n.id_medicamento = m.id_medicamento`);
                res.status(200).json(notificacoes.rows);
        } catch (error) {
            console.error("Erro ao listar as notificacoes:", error);
            res.status(500).json({ error: "Erro ao listar as notificacoes" });
        }
    }
    static async ListarNotificacoesPorID(req,res){
        const {id_notificacao} = req.params
        try {
            const notificacao = await BD.query(`select u.nome as nome_usuario, m.nome as nome_medicamento, n.tipo, n.mensagem, n.horario from notificacoes n
	right join usuarios u on n.id_usuario = u.id_usuario
	right join medicamentos m on n.id_medicamento = m.id_medicamento WHERE id_notificacao = $1`, [id_notificacao]);
            if (notificacao.rows.length === 0) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            res.status(200).json(notificacao.rows[0]);
        } catch (error) {
            console.error("Erro ao listar a notificacao:", error);
            res.status(500).json({ error: "Erro ao listar a notificacao" });
        }
    }
    
    static async DeletarNotificacao(req, res){
        const {id_notificacao} = req.params
        try{
            const notificacao = await BD.query(`UPDATE notificacoes set ativo = false where id_notificacao = $1 RETURNING *`, [id_notificacao])
            if (notificacao.rows.length === 0) {
                return res.status(404).json({ error: "notificacao não encontrada" });
            }
            res.status(200).json("notificacao deletada com sucesso")
        } catch(error){
            res.status(500).json("Erro ao deletar notificacao")
        }
    }
    static async AtualizarTodos(req, res){
        const {id_notificacao} = req.params
        const {id_medicamento, tipo, mensagem, horario} = req.body
        try {
            const notificacao = await BD.query(`UPDATE notificacoes SET id_medicamento = $1, tipo = $2, mensagem = $3, horario = $4 
                WHERE id_notificacao = $5 RETURNING *`, 
                [id_medicamento, tipo, mensagem, horario, id_notificacao]);
            if (notificacao.rows.length === 0) {
                return res.status(404).json({ error: "notificacao não encontrada" });
            }
            res.status(200).json('notificacao atualizada com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar a notificacao:", error);
            res.status(500).json({ error: "Erro ao atualizar a notificacao" });
            
        }
    }
    static async Atualizar(req, res){
        const {id_notificacao} = req.params
        const {id_medicamento, tipo, mensagem, horario} = req.body

        try {
            const campos = [];
            const valores = [];

            if(id_medicamento){
                campos.push(`id_medicamento = $${valores.length + 1}`);
                valores.push(id_medicamento);
            }

            if(tipo){
                campos.push(`tipo = $${valores.length + 1}`);
                valores.push(tipo);
            }

            if(mensagem){
                campos.push(`mensagem = $${valores.length + 1}`);
                valores.push(mensagem);
            }

            if(horario){
                campos.push(`horario = $${valores.length + 1}`);
                valores.push(horario);
            }

            if(campos.length === 0){
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE notificacoes SET ${campos.join(', ')} WHERE id_notificacao = ${id_notificacao} RETURNING *`;
            const resultado = await BD.query(query, valores);
            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "notificação não encontrada" });
            }
            res.status(200).json('notificacao atualizada com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar a notificacao:", error);
            res.status(500).json({ error: "Erro ao atualizar a notificacao" });
            
        }
    }
}
export default RotasNotificacoes;