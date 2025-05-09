import { BD } from "../Db.js";

class RotasHistoricoConsultas{
    static async CriarHistoricoConsulta(req, res){
        try{
        const {id_usuario, id_consulta, tipo, data, status} = req.body
        const historico = await BD.query(`insert into historicoconsultas (id_usuario, id_consulta, tipo, data, status)
            values ($1, $2, $3, $4, $5) RETURNING*
            `, [id_usuario, id_consulta, tipo, data, status])
        }catch(error){
            console.log("Erro ao registrar no histório", error);           
        }

    }

    static async ListarHistoricoConsultas(req, res){
        try {
            const historico = await BD.query(`select u.nome, c.especialidade, c.data, c.data_registro from consultas c 
	        join usuarios u on c.id_usuario = u.id_usuario`);
            
            if (historico.rows.length === 0) {
                return res.status(404).json({ error: "Historico de consultas não encontrado" });
            }
            res.status(200).json(historico.rows);
        } catch (error) {
            console.error("Erro ao listar o historico de consultas:", error);
            res.status(500).json({ error: "Erro ao listar o historico de consultas" });
        }
    }

    static async ListarHistoricoConsultaPorId(req, res){
        const { id_historico } = req.params;
        try {
            const historico = await BD.query(`SELECT * FROM historicoConsultas WHERE id_historico = $1`, [id_historico]);
            if (historico.rows.length === 0) {
                return res.status(404).json({ error : "Historico de consulta não encontrado" });
            }
            res.status(200).json(historico.rows[0]);
        } catch (error) {
            console.error("Erro ao listar o historico de consulta:", error);
            res.status(500).json({ error: "Erro ao listar o historico de consulta" });
        }
    }
    
    static async DeletarHistoricoConsulta(req, res){
        const {id_historico} = req.params 
        try{
        const historico = await BD.query(`UPDATE historicoConsultas set status = false where id_historico = $1 RETURNING *`, [id_historico])

        if (historico.rows.length === 0) {
            return res.status(404).json({ error: "Historico de consulta não encontrado" });
        }
        res.status(200).json("Historico de consulta deletado com sucesso")
        } catch(error){
            res.status(500).json("Erro ao deletar historico de consulta")
        }
    }

    static async AtualizarTodos(req, res){
        const {id_historico} = req.params
        const {id_usuario, id_consulta, tipo, data, status} = req.body
        try{
            const historico = await BD.query(`UPDATE historicoConsultas set id_usuario = $1, id_consulta = $2, tipo = $3, data = $4, status = $5 where id_historico = $6 RETURNING *`, [id_usuario, id_consulta, tipo, data, status, id_historico])
            if (historico.rows.length === 0) {
                return res.status(404).json({ error: "Historico de consulta não encontrado" });
            }
            res.status(200).json("Historico de consulta atualizado com sucesso")
        }catch(error){
            res.status(500).json("Erro ao atualizar historico de consulta")
        }
    }

    static async AtualizarHistoricoConsulta(req, res){
        const { id_historico } = req.params;
        const {id_usuario, id_consulta, tipo, data, status} = req.body

        try {
            const campos = [];
            const valores = [];

            if(id_usuario) {
                campos.push(`id_usuario = $${valores.length + 1}`);
                valores.push(id_usuario);
            }

            if(id_consulta) {
                campos.push(`id_consulta = $${valores.length + 1}`);
                valores.push(id_consulta);
            }

            if(tipo){
                campos.push(`tipo = $${valores.length + 1}`);
                valores.push(tipo);
            }

            if(data){
                campos.push(`data = $${valores.length + 1}`);
                valores.push(data);
            }

            if(status){
                campos.push(`status = $${valores.length + 1}`);
                valores.push(status);
            }

            if (campos.length === 0) {
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE historicoConsultas SET ${campos.join(', ')} WHERE id_historico = ${id_historico} RETURNING *`;
            const resultado = await BD.query(query, valores)

            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "Historico de consulta não encontrado" });
            }
            res.status(200).json("Historico de consulta atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar o historico de consulta:", error);
            res.status(500).json({ error: "Erro ao atualizar o historico de consulta" });
            
        }
    }
}

export default RotasHistoricoConsultas;