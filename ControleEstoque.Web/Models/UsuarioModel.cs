using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;

namespace ControleEstoque.Web.Models
{
    public class UsuarioModel
    {
        public static bool ValidarUsuario (string login, string senha)
        {
            var ret = false;
            using (var conexao = new MySqlConnection())
            {
                conexao.ConnectionString = "server=localhost; user id=root; database=controle_estoque; password=suikodensan13";
                conexao.Open();
                using (var comando = new MySqlCommand())
                {
                    comando.Connection = conexao;
                    comando.CommandText = string.Format(
                        "SELECT count(*) FROM usuario WHERE login='{0}' and senha='{1}'", login, senha);
                    ret = (Convert.ToInt32(comando.ExecuteScalar()) > 0);
                }
            }

            return ret;
        }
    }
}