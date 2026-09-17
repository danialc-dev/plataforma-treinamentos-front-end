import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { CartaoResumo, CabecalhoPagina, containerCard } from '../../components/admin/ElementosAdmin';

const opcoes = [
  { slug: 'individual', titulo: 'Relatório individual', descricao: 'Consulte o progresso e os prazos de um colaborador.', Icone: PersonSearchRoundedIcon },
  { slug: 'geral', titulo: 'Relatório geral', descricao: 'Acompanhe os treinamentos de toda a empresa.', Icone: BarChartRoundedIcon },
];

function Relatorios() {
  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <CabecalhoPagina titulo="Relatórios" descricao="Escolha um relatório para visualizar os dados completos" />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, mb: 3.5 }}>
        <CartaoResumo valor={132} texto="Colaboradores analisados" Icone={GroupOutlinedIcon} />
        <CartaoResumo valor={24} texto="Pendências encontradas" Icone={AssessmentOutlinedIcon} />
        <CartaoResumo valor={8} texto="Casos atrasados" Icone={WarningAmberRoundedIcon} cor="#b42318" fundo="#fdeceb" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
        {opcoes.map(({ slug, titulo, descricao, Icone }) => <Box key={slug} sx={{ ...containerCard, p: 2.5, display: 'flex', flexDirection: 'column', minHeight: 190, transition: 'box-shadow 0.15s ease, transform 0.15s ease', '&:hover': { boxShadow: '0 4px 12px rgba(17, 47, 33, 0.12)', transform: 'translateY(-1px)' } }}><Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: '#eaf6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}><Icone sx={{ color: '#1e5139' }} fontSize="small" /></Box><Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937', mb: 0.5 }}>{titulo}</Typography><Typography sx={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{descricao}</Typography><Button component={Link} to={`/admin/relatorios/${slug}`} variant="text" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 'auto', alignSelf: 'flex-start', px: 0, color: '#1e5139' }}>Abrir relatório</Button></Box>)}
      </Box>
    </Box>
  );
}

export default Relatorios;
