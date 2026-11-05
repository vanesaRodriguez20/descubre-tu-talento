import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn
} from 'typeorm';
import { Usuario } from './Usuario.entity';

export interface PreferenciasAccesibilidad {
  tamanoFuente: 'normal' | 'grande' | 'enorme';
  modoContraste: 'estandar' | 'alto_negro_amarillo' | 'alto_blanco_negro';
  fuenteDislexia: boolean;
  lectorVozCursor: boolean;
  dictadoPorVozSTT: boolean;
  modoCalmoSinAnimaciones: boolean;
  reglaGuiaLectura: boolean;
  volumenVoz: number; // 0 to 100
  velocidadVoz: number; // 0.5 to 1.5
}

export interface HabilidadesCualitativas {
  pensamientoLogico: number; // 0-100
  resilienciaResolucion: number; // 0-100 (capacidad de reintentar tras error)
  percepcionEspacial: number; // 0-100
  creatividadExploratoria: number; // 0-100
  atencionSostenida: number; // 0-100
  observacionesDocente?: string;
  recomendacionLumy?: string;
}

/**
 * Perfil gamificado, nivel de Zona de Desarrollo Próximo (ZPD) y configuración
 * de accesibilidad inclusiva del alumno.
 */
@Entity('estudiante_perfiles')
export class EstudiantePerfil {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Usuario, (usuario) => usuario.perfilEstudiante, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  @Column({ type: 'uuid' })
  usuarioId!: string;

  /**
   * Apodo cariñoso elegido por el alumno dentro de la plataforma (ej. "Campeón de las Estrellas")
   */
  @Column({ type: 'varchar', length: 60, default: 'Explorador LUM' })
  apodo!: string;

  /**
   * Avatar infantil personalizable (estilo emoji / ilustración / accesorios)
   */
  @Column({
    type: 'jsonb',
    default: () => `'{"icono": "👧", "colorFondo": "#8B5CF6", "accesorio": "gorra_astral", "marco": "oro"}'`
  })
  avatarConfig!: {
    icono: string;
    colorFondo: string;
    accesorio: string;
    marco: string;
  };

  /**
   * Puntuación de gamificación y economía de motivación intrínseca
   */
  @Column({ type: 'int', default: 0 })
  estrellasPuntos!: number;

  @Column({ type: 'int', default: 1 })
  nivelGamificacion!: number;

  /**
   * Zona de Desarrollo Próximo (ZPD): Escala del 1.0 al 10.0 que el motor Lumy
   * ajusta en tiempo real según la resiliencia y el éxito en las mecánicas de juego.
   */
  @Column({ type: 'float', default: 2.0 })
  nivelZPD!: number;

  /**
   * Medallas desbloqueadas por el menor, diseñadas para lectura conjunta con padres
   */
  @Column({
    type: 'jsonb',
    default: () => `'[]'`
  })
  medallasDesbloqueadas!: {
    idMedalla: string;
    titulo: string;
    icono: string;
    habilidadAsociada: string;
    descripcionParaPadres: string;
    fechaObtencion: string;
  }[];

  /**
   * Desglose cualitativo de habilidades evaluadas por Lumy
   */
  @Column({
    type: 'jsonb',
    default: () => `'{"pensamientoLogico": 50, "resilienciaResolucion": 50, "percepcionEspacial": 50, "creatividadExploratoria": 50, "atencionSostenida": 50}'`
  })
  habilidadesCualitativas!: HabilidadesCualitativas;

  /**
   * Ajustes de accesibilidad completos para niños con TDAH, dislexia,
   * baja visión o dificultades motrices/lectoescritoras.
   */
  @Column({
    type: 'jsonb',
    default: () => `'{"tamanoFuente": "normal", "modoContraste": "estandar", "fuenteDislexia": false, "lectorVozCursor": false, "dictadoPorVozSTT": false, "modoCalmoSinAnimaciones": false, "reglaGuiaLectura": false, "volumenVoz": 90, "velocidadVoz": 1.0}'`
  })
  ajustesAccesibilidad!: PreferenciasAccesibilidad;

  @UpdateDateColumn()
  fechaActualizacion!: Date;
}
