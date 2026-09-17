import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { CartaoResumo, CabecalhoPagina, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';

const colaboradores = [
  { nome: 'João Silva', cpf: '123.456.789-00', status: 'Em dia', tipo: 'success', concluidos: 8, pendentes: 1 },
  { nome: 'Maria Souza', cpf: '987.654.321-00', status: 'Em dia', tipo: 'success', concluidos: 9, pendentes: 0 },
  { nome: 'Pedro Lima', cpf: '456.789.123-00', status: 'Atenção', tipo: 'warning', concluidos: 6, pendentes: 3 },
  { nome: 'Ana Costa', cpf: '654.321.987-00', status: 'Atrasado', tipo: 'danger', concluidos: 4, pendentes: 4 },
];

function Colaboradores() {
  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <CabecalhoPagina titulo="Colaboradores" descricao={`${colaboradores.length} colaboradores cadastrados`} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>
        <CartaoResumo valor={132} texto="Total de colaboradores" Icone={GroupOutlinedIcon} />
        <CartaoResumo valor={108} texto="Treinamentos em dia" Icone={CheckCircleOutlineRoundedIcon} />
        <CartaoResumo valor={8} texto="Precisam de atenção" Icone={WarningAmberRoundedIcon} cor="#b42318" fundo="#fdeceb" />
      </Box>
      <Box sx={{ ...containerCard, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 680 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 2fr) 1fr 1fr 100px 48px', gap: 2, alignItems: 'center', px: 2.5, py: 1.5, bgcolor: '#f6faf8' }}>
            {['Colaborador', 'Status', 'Concluídos', 'Pendentes', ''].map((titulo) => <Typography key={titulo} sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{titulo}</Typography>)}
          </Box>
          {colaboradores.map((colaborador) => {
            const iniciais = colaborador.nome.split(' ').slice(0, 2).map((nome) => nome[0]).join('');
            return <Box key={colaborador.cpf} sx={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 2fr) 1fr 1fr 100px 48px', gap: 2, alignItems: 'center', px: 2.5, py: 1.75, borderTop: '1px solid #eef2f0', '&:hover': { bgcolor: '#f9fbfa' } }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}><Avatar sx={{ width: 34, height: 34, bgcolor: '#eaf6ef', color: '#1e5139', fontSize: 12, fontWeight: 700 }}>{iniciais}</Avatar><Box><Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{colaborador.nome}</Typography><Typography sx={{ fontSize: 12, color: '#6b7280' }}>{colaborador.cpf}</Typography></Box></Box><EtiquetaStatus label={colaborador.status} tipo={colaborador.tipo} /><Typography sx={{ fontSize: 14, color: '#374151' }}>{colaborador.concluidos}</Typography><Typography sx={{ fontSize: 14, color: colaborador.pendentes ? '#b42318' : '#374151', fontWeight: colaborador.pendentes ? 600 : 400 }}>{colaborador.pendentes}</Typography><IconButton component={Link} to={`/admin/relatorios/individual?cpf=${colaborador.cpf}`} size="small" title="Ver relatório individual"><AssessmentOutlinedIcon fontSize="small" sx={{ color: '#1e5139' }} /></IconButton></Box>;
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Colaboradores;
