
import { useState, useEffect } from 'react';
import type { Tutor, Animal } from '../../types';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import TutorCard from '../../components/TutorCard';
import { useForm, useFieldArray } from 'react-hook-form';
import * as tutorService from '../../services/tutorService';
import * as animalService from '../../services/animalService';
import styles from './Tutores.module.css';

// ============================================
// TIPOS LOCAIS
// ============================================

// Tipo para o formulário (tutor + animais juntos)
interface TutorFormData {
  nome: string;
  email: string;
  telefone: string;
  animais: {
    nome: string;
    especie: 'gato' | 'cachorro';
    raca: string;
    idade: number;
  }[];
}

// ============================================
// COMPONENTE
// ============================================

const Tutores = () => {
  // Estados principais
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [animaisPorTutor, setAnimaisPorTutor] = useState<Record<string, Animal[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tutorEditando, setTutorEditando] = useState<Tutor | null>(null);

  // Estados de confirmação de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tutorParaDeletar, setTutorParaDeletar] = useState<Tutor | null>(null);
  const [isDeletando, setIsDeletando] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TutorFormData>({
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      animais: [],
    },
  });

  // Field Array para gerenciar animais dinamicamente
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'animais',
  });

  // ============================================
  // EFEITO: Carregar tutores ao montar
  // ============================================
  
  useEffect(() => {
    carregarTutores();
  }, []);

  // ============================================
  // FUNÇÃO: Carregar tutores e animais
  // ============================================
  
  const carregarTutores = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Buscar tutores
      const tutoresData = await tutorService.getTutores();
      setTutores(tutoresData);

      // Buscar animais de cada tutor
      const animaisMap: Record<string, Animal[]> = {};
      
      for (const tutor of tutoresData) {
        const animais = await animalService.getAnimaisByTutor(tutor.id);
        animaisMap[tutor.id] = animais;
      }

      setAnimaisPorTutor(animaisMap);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tutores');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLER: Abrir modal para adicionar
  // ============================================
  
  const handleAdicionar = () => {
    setIsEditMode(false);
    setTutorEditando(null);
    reset({
      nome: '',
      email: '',
      telefone: '',
      animais: [],
    });
    setIsModalOpen(true);
  };

  // ============================================
  // HANDLER: Abrir modal para editar
  // ============================================
  
  const handleEditar = async (tutor: Tutor) => {
    setIsEditMode(true);
    setTutorEditando(tutor);

    // Buscar animais do tutor
    const animais = animaisPorTutor[tutor.id] || [];

    // Preencher formulário
    reset({
      nome: tutor.nome,
      email: tutor.email,
      telefone: tutor.telefone,
      animais: animais.map((animal) => ({
        nome: animal.nome,
        especie: animal.especie,
        raca: animal.raca,
        idade: animal.idade,
      })),
    });

    setIsModalOpen(true);
  };

  // ============================================
  // HANDLER: Fechar modal
  // ============================================
  
  const handleFecharModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setTutorEditando(null);
    reset();
  };

  // ============================================
  // HANDLER: Submit do formulário
  // ============================================
  
  const onSubmit = async (data: TutorFormData) => {
    try {
      if (isEditMode && tutorEditando) {
        // ========== MODO EDIÇÃO ==========
        
        // 1. Atualizar tutor
        await tutorService.updateTutor(tutorEditando.id, {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
        });

        // 2. Deletar animais antigos
        await animalService.deleteAnimaisByTutor(tutorEditando.id);

        // 3. Criar novos animais
        for (const animalData of data.animais) {
          await animalService.createAnimal({
            ...animalData,
            tutorId: tutorEditando.id,
          });
        }
      } else {
        // ========== MODO CRIAÇÃO ==========
        
        // 1. Criar tutor
        const novoTutor = await tutorService.createTutor({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
        });

        // 2. Criar animais vinculados ao tutor
        for (const animalData of data.animais) {
          await animalService.createAnimal({
            ...animalData,
            tutorId: novoTutor.id,
          });
        }
      }

      // Recarregar lista
      await carregarTutores();

      // Fechar modal
      handleFecharModal();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar tutor');
    }
  };

  // ============================================
  // HANDLER: Confirmar exclusão
  // ============================================
  
  const handleConfirmarExclusao = (tutor: Tutor) => {
    setTutorParaDeletar(tutor);
    setIsDeleteModalOpen(true);
  };

  // ============================================
  // HANDLER: Deletar tutor
  // ============================================
  
  const handleDeletar = async () => {
    if (!tutorParaDeletar) return;

    try {
      setIsDeletando(true);

      // 1. Deletar todos os animais do tutor
      await animalService.deleteAnimaisByTutor(tutorParaDeletar.id);

      // 2. Deletar o tutor
      await tutorService.deleteTutor(tutorParaDeletar.id);

      // Recarregar lista
      await carregarTutores();

      // Fechar modal
      setIsDeleteModalOpen(false);
      setTutorParaDeletar(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir tutor');
    } finally {
      setIsDeletando(false);
    }
  };

  // ============================================
  // HANDLER: Cancelar exclusão
  // ============================================
  
  const handleCancelarExclusao = () => {
    setIsDeleteModalOpen(false);
    setTutorParaDeletar(null);
  };

  // ============================================
  // HANDLER: Adicionar animal ao formulário
  // ============================================
  
  const handleAdicionarAnimal = () => {
    append({
      nome: '',
      especie: 'cachorro',
      raca: '',
      idade: 0,
    });
  };

  // ============================================
  // HANDLER: Remover animal do formulário
  // ============================================
  
  const handleRemoverAnimal = (index: number) => {
    remove(index);
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <Header />

      {/* Conteúdo Principal */}
      <div className={styles.content}>
        {/* Título e Botão Adicionar */}
        <div className={styles.topSection}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Tutores</h1>
            <p className={styles.subtitle}>
              {tutores.length} {tutores.length === 1 ? 'tutor cadastrado' : 'tutores cadastrados'}
            </p>
          </div>
          <Button variant="primary" onClick={handleAdicionar}>
            ➕ Novo Tutor
          </Button>
        </div>

        {/* Lista de Tutores */}
        {isLoading ? (
          // Loading
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}>⏳</div>
            <p>Carregando tutores...</p>
          </div>
        ) : error ? (
          // Erro
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        ) : tutores.length === 0 ? (
          // Estado Vazio
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🐾</div>
            <h2 className={styles.emptyTitle}>Nenhum tutor cadastrado</h2>
            <p className={styles.emptyText}>
              Comece adicionando o primeiro tutor e seus pets ao sistema
            </p>
            <Button variant="primary" onClick={handleAdicionar}>
              ➕ Adicionar Tutor
            </Button>
          </div>
        ) : (
          // Grid de Cards
          <div className={styles.grid}>
            {tutores.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                animais={animaisPorTutor[tutor.id] || []}
                onEdit={handleEditar}
                onDelete={handleConfirmarExclusao}
              />
            ))}
          </div>
        )}

    {/* Modal de Adicionar/Editar */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          title={isEditMode ? 'Editar Tutor' : 'Novo Tutor'}
          footer={
            <>
              <Button variant="secondary" onClick={handleFecharModal}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
              >
                {isEditMode ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Campos do Tutor */}
            <Input
              label="Nome do Tutor"
              placeholder="João Silva"
              error={errors.nome?.message}
              {...register('nome', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Nome deve ter no mínimo 3 caracteres',
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="joao@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
            />

            <Input
              label="Telefone"
              type="tel"
              placeholder="(11) 98765-4321"
              error={errors.telefone?.message}
              {...register('telefone', {
                required: 'Telefone é obrigatório',
                pattern: {
                  value: /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/,
                  message: 'Telefone inválido',
                },
              })}
            />

            {/* Seção de Animais */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Animais</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={handleAdicionarAnimal}
                >
                  ➕ Adicionar Animal
                </Button>
              </div>

              {fields.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic', padding: '20px' }}>
                  Nenhum animal cadastrado. Clique em "Adicionar Animal" para começar.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        position: 'relative',
                      }}
                    >
                      {/* Cabeçalho do Animal */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                          Animal {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleRemoverAnimal(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '20px',
                            padding: '4px',
                          }}
                          title="Remover animal"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Campos do Animal */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Input
                          label="Nome"
                          placeholder="Rex"
                          error={errors.animais?.[index]?.nome?.message}
                          {...register(`animais.${index}.nome`, {
                            required: 'Nome do animal é obrigatório',
                          })}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                            Espécie <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <select
                            {...register(`animais.${index}.especie`, {
                              required: 'Espécie é obrigatória',
                            })}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              fontSize: '16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px',
                              fontFamily: 'inherit',
                            }}
                          >
                            <option value="cachorro">Cachorro</option>
                            <option value="gato">Gato</option>
                          </select>
                          {errors.animais?.[index]?.especie && (
                            <span style={{ fontSize: '14px', color: '#ef4444' }}>
                              {errors.animais[index]?.especie?.message}
                            </span>
                          )}
                        </div>

                        <Input
                          label="Raça"
                          placeholder="SRD"
                          error={errors.animais?.[index]?.raca?.message}
                          {...register(`animais.${index}.raca`, {
                            required: 'Raça é obrigatória',
                          })}
                        />

                        <Input
                          label="Idade (anos)"
                          type="number"
                          placeholder="5"
                          error={errors.animais?.[index]?.idade?.message}
                          {...register(`animais.${index}.idade`, {
                            required: 'Idade é obrigatória',
                            min: {
                              value: 0,
                              message: 'Idade não pode ser negativa',
                            },
                            max: {
                              value: 30,
                              message: 'Idade muito alta',
                            },
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </Modal>

    {/* Modal de Confirmação de Exclusão */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelarExclusao}
          title="Confirmar Exclusão"
          footer={
            <>
              <Button variant="secondary" onClick={handleCancelarExclusao}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleDeletar}
                isLoading={isDeletando}
              >
                Sim, Excluir
              </Button>
            </>
          }
        >
          <div style={{ padding: '8px 0' }}>
            <p style={{ fontSize: '16px', color: '#374151', margin: '0 0 16px 0' }}>
              Tem certeza que deseja excluir o tutor{' '}
              <strong>{tutorParaDeletar?.nome}</strong>?
            </p>
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>
                 Esta ação não pode ser desfeita. Todos os animais associados a este tutor também serão excluídos.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Tutores;