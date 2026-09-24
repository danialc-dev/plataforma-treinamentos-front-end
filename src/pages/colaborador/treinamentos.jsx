import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CabecalhoPagina, EtiquetaStatus, containerCard } from '../../components/admin/ElementosAdmin';
import { useTreinamentosColaborador } from '../../components/colaborador/AreaTreinamentos';
import { estaBloqueado, formatarDataTreinamento, prazoVencido, situacaoTreinamento } from '../../utils/treinamentosColaborador';

const colunas = { xs: '1fr', md: 'minmax(0, 2fr) minmax(110px, 0.8fr) minmax(120px, 0.8fr) 140px' };

function TreinamentosColaborador() {
  const { treinamentos } = useTreinamentosColaborador();
  const concluidos = treinamentos.filter((item) => item.status === 'concluido').length;

  return (
    <>
      <CabecalhoPagina titulo="Meus treinamentos" descricao={`${treinamentos.length} treinamentos na lista · ${concluidos} ${concluidos === 1 ? 'concluído' : 'concluídos'}`} />
      <Box sx={{ ...containerCard, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Seus treinamentos</Typography>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.5 }}>Escolha um treinamento para assistir e acompanhe seus prazos.</Typography>
        </Box>
        <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: colunas, gap: 2, px: 2.5, py: 1.5, bgcolor: '#f0f7f3' }}>
          {['Treinamento', 'Prazo', 'Situação', 'Ação'].map((titulo) => <Typography key={titulo} sx={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>{titulo}</Typography>)}
        </Box>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {treinamentos.map((item) => {
            const bloqueado = estaBloqueado(item, treinamentos);
            const requisito = treinamentos.find((outro) => outro.id === item.preRequisitoId);
            const concluido = item.status === 'concluido';
            const atrasado = prazoVencido(item);
            const acao = concluido ? 'Rever vídeo' : item.status === 'em_andamento' ? 'Continuar' : 'Assistir';
            return (
              <Box component="li" key={item.id} sx={{ display: 'grid', gridTemplateColumns: colunas, alignItems: 'center', gap: 2, px: 2.5, py: 2.5, borderTop: '1px solid #eef2f0', '&:hover': { bgcolor: '#f9fbfa' } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, flexShrink: 0, borderRadius: '10px', bgcolor: '#eaf6ef', color: '#1e5139' }}>
                    {bloqueado ? <LockOutlinedIcon fontSize="small" /> : <AssignmentOutlinedIcon fontSize="small" />}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, color: '#1f2937', fontWeight: 600, mb: 0.75, overflowWrap: 'anywhere' }}>{item.titulo}</Typography>
                    <EtiquetaStatus label={item.obrigatorio ? 'Obrigatório' : 'Não obrigatório'} tipo={item.obrigatorio ? 'warning' : 'neutral'} />
                    {requisito && <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.75 }}>Pré-requisito: {requisito.titulo}</Typography>}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ display: { md: 'none' }, fontSize: 11, color: '#6b7280', mb: 0.25 }}>Prazo</Typography>
                  <Typography sx={{ fontSize: 13, color: atrasado ? '#b42318' : '#374151' }}>{formatarDataTreinamento(item.prazo)}</Typography>
                  {atrasado && <Typography sx={{ fontSize: 12, color: '#b42318', fontWeight: 600 }}>Prazo vencido</Typography>}
                </Box>
                <Box>
                  <EtiquetaStatus {...situacaoTreinamento(item, treinamentos)} />
                  {concluido && <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.75 }}>Em {formatarDataTreinamento(item.concluidoEm)}</Typography>}
                </Box>
                {bloqueado ? <Button variant="outlined" disabled startIcon={<LockOutlinedIcon />} sx={{ justifySelf: { xs: 'start', md: 'stretch' } }}>Bloqueado</Button> : (
                  <Button component={Link} to={`/colaborador/treinamentos/${item.id}`} aria-label={`${acao}: ${item.titulo}`} variant={concluido ? 'outlined' : 'contained'} startIcon={<PlayCircleOutlineRoundedIcon />} sx={{ justifySelf: { xs: 'start', md: 'stretch' } }}>{acao}</Button>
                )}
              </Box>
            );
          })}
        </Box>
        {!treinamentos.length && <Typography sx={{ p: 3, color: '#6b7280' }}>Você ainda não possui treinamentos atribuídos.</Typography>}
      </Box>
    </>
  );
}

export default TreinamentosColaborador;
