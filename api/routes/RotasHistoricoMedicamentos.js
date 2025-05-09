import { BD } from "../Db.js";

class RotasHistoricoMedicamentos{
    static async CriarHistoricoMedicamento(req,res){
        try {
            const {id_usuario, id_medicamento, tipo, data, status} = req.body
            const historico = await BD.query(`INSERT INTO historicoMedicamentos (id_usuario, id_medicamento, tipo, data, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [id_usuario, id_medicamento, tipo, data, status])
            res.status(201).json("Historico de medicamento criado com sucesso")
        } catch (error) {
            console.error("Erro ao registrar no histório", error);           
            res.status(500).json({ error: "Erro ao registrar no histório" });
        }
    }

    static async ListarHistoricoMedicamentos(req, res){
        try {
            const historico = await BD.query(`
                select u.nome as nome_usuario, m.nome as nome_medicamento, m.data_registro as data 
	            from medicamentos m 
	            right join usuarios u on m.id_usuario = u.id_usuario`);
            res.status(200).json(historico.rows);
        } catch (error) {
            console.error("Erro ao listar o historico de medicamentos:", error);
            res.status(500).json({ error: "Erro ao listar o historico de medicamentos" });
        }
    }

    static async ListarHistoricoMedicamentoPorId(req, res){
        const { id_historico } = req.params;
        try {
            const historico = await BD.query(`
                    select u.nome as nome_usuario, m.nome as nome_medicamento, m.data_registro as data 
        from historicomedicamentos h
        right join usuarios u on h.id_usuario = u.id_usuario
        right join medicamentos m on h.id_medicamento = m.id_medicamento
        where id_historico = $1`, 
                [id_historico]);
            if (historico.rows.length === 0) {
                return res.status(404).json({ error : "Historico de medicamento não encontrado" });
            }
            res.status(200).json(historico.rows[0]);
        } catch (error) {
            console.error("Erro ao listar o historico de medicamento:", error);
            res.status(500).json({ error: "Erro ao listar o historico de medicamento" });
        }
    }

    static async DeletarHistoricoMedicamento(req, res){
        const {id_historico} = req.params;
        try {
            const historico = await BD.query(`UPDATE historicoMedicamentos SET status = false WHERE id_historico = $1 RETURNING *`, [id_historico]);
            if (historico.rows.length === 0) {
                return res.status(404).json({ error: "Historico de medicamento não encontrado" });
            }
            res.status(200).json({ message: "Historico de medicamento deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar o historico de medicamento:", error);
            res.status(500).json({ error: "Erro ao deletar o historico de medicamento" });
        }
    }

    static async AtualizarTodos(req, res){
        const {id_historico} = req.params;
        const {id_usuario, id_medicamento, tipo, data, status} = req.body;
        try {
            const historico = await BD.query(`UPDATE historicoMedicamentos SET id_usuario = $1, id_medicamento = $2, tipo = $3, data = $4, status = $5 WHERE id_historico = $6 RETURNING *`, [id_usuario, id_medicamento, tipo, data, status, id_historico]);
            if (historico.rows.length === 0) {
                return res.status(404).json({ error: "Historico de medicamento não encontrado" });
            }
            res.status(200).json(historico.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar o historico de medicamento:", error);
            res.status(500).json({ error: "Erro ao atualizar o historico de medicamento" });
        }
    }

    static async Atualizar(req, res){
        const { id_historico } = req.params;
        const {id_usuario, id_medicamento, tipo, data} = req.body;
        try {
            const campos = [];
            const valores = [];

            if(id_usuario) {
                campos.push(`id_usuario = $${valores.length + 1}`);
                valores.push(id_usuario);
            }

            if(id_medicamento) {
                campos.push(`id_medicamento = $${valores.length + 1}`);
                valores.push(id_medicamento);
            }

            if(tipo) {
                campos.push(`tipo = $${valores.length + 1}`);
                valores.push(tipo);
            }

            if(data) {
                campos.push(`data = $${valores.length + 1}`);
                valores.push(data);
            }

            if(campos.length === 0) {
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE historicoMedicamentos SET ${campos.join(', ')} WHERE id_historico = ${id_historico} RETURNING *`;
            const resultado = await BD.query(query, valores);
            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "Historico de medicamento não encontrado" });
            }
            res.status(200).json(resultado.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar o historico de medicamento:", error);
            res.status(500).json({ error: "Erro ao atualizar o historico de medicamento" });
            
        }
    }
}
export default RotasHistoricoMedicamentos;