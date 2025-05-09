import { BD } from "../Db.js";

class RotasMedicamentos{
    static async novoMedicamento(req, res){
        try{
        const {id_usuario, nome, observacoes, dosagem, frequencia, data_inicio, data_fim, horarios, ativo} = req.body
        const medicamento = await BD.query(`insert into medicamentos
            (id_usuario, nome, observacoes, dosagem, frequencia, data_inicio, data_fim, horarios, ativo)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
            `, [id_usuario, nome, observacoes, dosagem, frequencia, data_inicio, data_fim, horarios, ativo])
            res.status(201).json('medicamento criado com sucesso!')
        }
        catch(error){
            res.status(500).json('Erro ao criar medicamento', error)
        }
    }

    static async listarMedicamentos(req, res){
        try {
            const medicamentos = await BD.query(`SELECT * FROM medicamentos`);
            res.status(200).json(medicamentos.rows);
        } catch (error) {
            console.error("Erro ao listar os medicamentos:", error);
            res.status(500).json({ error: "Erro ao listar os medicamentos" });
        }
    }

    static async listarMedicamentosPorId(req, res){
        const { id_medicamento } = req.params;
        try {
            const medicamento = await BD.query(`SELECT * FROM Medicamentos WHERE id_medicamento = $1`, [id_medicamento]);
            if (medicamento.rows.length === 0) {
                return res.status(404).json({ error: "Medicamento não encontrado" });
            }
            res.status(200).json(medicamento.rows[0]);
        } catch (error) {
            console.error("Erro ao listar o medicamento:", error);
            res.status(500).json({ error: "Erro ao listar o medicamento" });
        }
    }
    
    static async DeletarMedicamentos(req, res){
        const {id_medicamento} = req.params 
        try{
        const medicamento = await BD.query(`UPDATE Medicamentos set ativo = false where id_medicamento = $1 RETURNING *`, [id_medicamento])
        res.status(200).json("Medicamento deletado com sucesso")
        } catch(error){
            res.status(500).json("Erro ao deletar medicamento")
        }
    }

    static async AtualizarTodos(req,res) {
        const { id_medicamento } = req.params;
        const { nome, observacoes, dosagem, frequencia, data_inicio, data_fim, horarios, ativo } = req.body;
        try {
            const medicamento = await BD.query(`UPDATE Medicamentos SET nome = $1, observacoes = $2, dosagem = $3, frequencia = $4, data_inicio = $5, data_fim = $6, horarios = $7, ativo = $8 WHERE id_medicamento = $9 RETURNING *`, [nome, observacoes, dosagem, frequencia, data_inicio, data_fim, horarios, ativo, id_medicamento]);
            res.status(200).json('Medicamento atualizado com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar o medicamento:", error);
            res.status(500).json({ error: "Erro ao atualizar o medicamento" });
        }
    }
    
    static async Atualizar(req,res){
        const {id_medicamento} = req.params;
        const {nome, observacoes, dosagem, frequencia, data_inicio, data_fim, horarios, ativo} = req.body

        try {
            const campos = [];
            const valores = [];

            if (nome) {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }
            if (observacoes) {
                campos.push(`observacoes = $${valores.length + 1}`);
                valores.push(observacoes);
            }
            if (dosagem) {
                campos.push(`dosagem = $${valores.length + 1}`);
                valores.push(dosagem);
            }
            if (frequencia) {
                campos.push(`frequencia = $${valores.length + 1}`);
                valores.push(frequencia);
            }
            if (data_inicio) {
                campos.push(`data_inicio = $${valores.length + 1}`);
                valores.push(data_inicio);
            }
            if (data_fim) {
                campos.push(`data_fim = $${valores.length + 1}`);
                valores.push(data_fim);
            }
            if (horarios) {
                campos.push(`horarios = $${valores.length + 1}`);
                valores.push(horarios);
            }
            if (ativo) {
                campos.push(`ativo = $${valores.length + 1}`);
                valores.push(ativo);
            }
            if (campos.length === 0) {
                return res.status(400).json({
                    message: "Nenhum campo para atualizar foi fornecido."
                });
            }
            const query = `UPDATE Medicamentos SET ${campos.join(', ')} WHERE id_medicamento = ${id_medicamento} RETURNING *`
            const resultado = await BD.query(query, valores);

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    message: "Medicamento não encontrado."
                });
            }

            res.status(200).json({
                message: "Medicamento atualizado com sucesso!",
                medicamento: resultado.rows[0]
            });

        } catch (error) {
            console.error("Erro ao atualizar o medicamento:", error);
            res.status(500).json({
                message:"Erro ao Atualizar o medicamento", error: error.message
            })
        }
    }
}
export default RotasMedicamentos; 