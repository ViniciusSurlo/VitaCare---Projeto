import { BD } from "../Db.js";


class RotasConsultas{
    static async CriarConsulta(req, res){
        try{
        const {id_usuario, especialidade, data, hora, local, observacoes, horarios, ativo} = req.body
        const consultas = await BD.query(`insert into Consultas(id_usuario, especialidade, data, hora, local, observacoes, horarios, ativo)
            values($1, $2, $3, $4, $5, $6, $7, $8)          
            RETURNING *
            `, [id_usuario, especialidade, data, hora, local, observacoes, horarios, ativo])
            res.status(200).json("Usuário Criado com sucesso")
        } catch(error){
            console.log("Erro ao criar consulta", error);
            
        }
    }

    static async ListarConsultas(req, res){
        try {
            const consultas = await BD.query(`select u.nome, c.especialidade, c.data, c.hora, c.local, c.observacoes, c.horarios, c.ativo from consultas c 
	        join usuarios u on c.id_usuario = u.id_usuario`);
            res.status(200).json(consultas.rows);
        } catch (error) {
            console.error("Erro ao listar as consultas:", error);
            res.status(500).json({ error: "Erro ao listar as consultas" });
        }
    }

    static async ListarConsultasPorID(req,res){
        const {id_consulta} = req.params
        try {
            const consulta = await BD.query(`select u.nome, c.especialidade, c.data, c.hora, c.local, c.observacoes, c.horarios, c.ativo from consultas c 
	        join usuarios u on c.id_usuario = u.id_usuario WHERE id_consulta = $1`, [id_consulta]);
            if (consulta.rows.length === 0) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            res.status(200).json(consulta.rows[0]);
        } catch (error) {
            console.error("Erro ao listar a consulta:", error);
            res.status(500).json({ error: "Erro ao listar a consulta" });
        }
    }

    static async DeletarConsulta(req, res){
        const {id_consulta} = req.params
        try{
            const consulta = await BD.query(`UPDATE Consultas set ativo = false where id_consulta = $1 RETURNING *`, [id_consulta])
            if (consulta.rows.length === 0) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            res.status(200).json("Consulta deletada com sucesso")
        } catch(error){
            res.status(500).json("Erro ao deletar consulta")
        }
    }

    static async AtualizarTodos(req, res){
        const {id_consulta} = req.params
        const {especialidade, data, hora, local, observacoes, horarios, ativo} = req.body
        try {
            const consulta = await BD.query(`UPDATE Consultas SET especialidade = $1, data = $2, hora = $3, local = $4, observacoes = $5, horarios = $6, ativo = $7 WHERE id_consulta = $8 RETURNING *`, [especialidade, data, hora, local, observacoes, horarios, ativo, id_consulta]);
            if (consulta.rows.length === 0) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            res.status(200).json('Consulta atualizada com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar a consulta:", error);
            res.status(500).json({ error: "Erro ao atualizar a consulta" });
            
        }
    }

    static async Atualizar(req, res){
        const {id_consulta} = req.params
        const {especialidade, data, hora, local, observacoes, horarios, ativo} = req.body

        try {
            const campos = [];
            const valores = [];

            if(especialidade){
                campos.push(`especialidade = $${valores.length + 1}`);
                valores.push(especialidade);
            }

            if(data){
                campos.push(`data = $${valores.length + 1}`);
                valores.push(data);
            }

            if(hora){
                campos.push(`hora = $${valores.length + 1}`);
                valores.push(hora);
            }

            if(local){
                campos.push(`local = $${valores.length + 1}`);
                valores.push(local);
            }

            if(observacoes){
                campos.push(`observacoes = $${valores.length + 1}`);
                valores.push(observacoes);
            }

            if(horarios){
                campos.push(`horarios = $${valores.length + 1}`);
                valores.push(horarios);
            }

            if(ativo){
                campos.push(`ativo = $${valores.length + 1}`);
                valores.push(ativo);
            }

            if(campos.length === 0){
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE Consultas SET ${campos.join(', ')} WHERE id_consulta = ${id_consulta} RETURNING *`;
            const resultado = await BD.query(query, valores);
            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            res.status(200).json('Consulta atualizada com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar a consulta:", error);
            res.status(500).json({ error: "Erro ao atualizar a consulta" });
            
        }
    }
} 
export default RotasConsultas;